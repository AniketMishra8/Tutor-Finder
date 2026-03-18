// server/routes/ml.js
// ML-powered API endpoints using trained brain.js models

const express = require('express');
const router  = express.Router();
const brain   = require('brain.js');
const fs      = require('fs');
const path    = require('path');
const User    = require('../models/User');

const ML_DIR = path.join(__dirname, '../ml');

// ── LOAD TRAINED MODELS ───────────────────────────────────────────────────────
function loadNet(filename) {
  const filePath = path.join(ML_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Model file not found: ${filename}. Run: node ml/trainModels.js`);
  }
  const net = new brain.NeuralNetwork();
  net.fromJSON(JSON.parse(fs.readFileSync(filePath)));
  return net;
}

let matchNet, perfNet, recommendNet;

try {
  matchNet     = loadNet('matchModel.json');
  perfNet      = loadNet('perfModel.json');
  recommendNet = loadNet('recommendModel.json');
  console.log('✅  All ML models loaded successfully.');
} catch (e) {
  console.warn('⚠️   ML models not yet trained. Run: node ml/trainModels.js');
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function clamp(val, min = 0, max = 1) { return Math.max(min, Math.min(max, val)); }

function buildMatchInput(student, tutor) {
  const subjectMatch   = student.subjects?.some(s => tutor.subjects?.includes(s)) ? 1 : 0;
  const modeMatch      = student.preferredMode === 'both' || tutor.mode?.includes(student.preferredMode) ? 1 : 0;
  const locationMatch  = student.preferredMode === 'online' ? 1 :
                         (tutor.location?.toLowerCase() === student.location?.toLowerCase() ? 1 : 0);
  const budgetOk       = tutor.hourlyRate <= (student.budget || 9999) ? 1 : 0;
  const tutorRating    = clamp((tutor.rating || 4) / 5);
  const tutorExp       = clamp(parseInt(tutor.experience || '0') / 15);
  const styleMatch     = tutor.teachingStyles?.includes(student.learningStyle) ? 1 : 0;
  const langMatch      = tutor.languages?.some(l => student.languages?.includes(l)) ? 1 : 0;

  return { subjectMatch, modeMatch, locationMatch, budgetOk, tutorRating, tutorExp, styleMatch, langMatch };
}

function buildPerfInput(history) {
  const scores     = history.map(h => h.score);
  const avgScore   = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
  const attempts   = history.length;
  const mean       = avgScore;
  const variance   = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (scores.length || 1);
  const stdDev     = Math.sqrt(variance);
  const consistency = clamp(1 - stdDev / 100);
  const recent     = scores.slice(-3);
  const older      = scores.slice(-6, -3);
  const recentAvg  = recent.reduce((a, b) => a + b, 0) / (recent.length || 1);
  const olderAvg   = older.reduce((a, b) => a + b, 0) / (older.length || 1);
  const recentTrend = clamp((recentAvg - olderAvg + 100) / 200);
  const avgTime    = history.reduce((a, b) => a + (b.timePerQuestion || 20), 0) / (history.length || 1);
  const timePerQ   = clamp(1 - avgTime / 60);
  const topicsCovered = clamp(new Set(history.map(h => h.topic)).size / 10);

  return {
    avgScore:      clamp(avgScore / 100),
    attempts:      clamp(attempts / 20),
    consistency,
    recentTrend,
    timePerQ,
    topicsCovered,
  };
}

function buildRecommendInput(student, tutor, studentPerf) {
  const subjectMatch        = student.subjects?.some(s => tutor.subjects?.includes(s)) ? 1 : 0;
  const perfScore           = { weak: 0, average: 0.5, strong: 1 }[studentPerf] || 0.5;
  const tutorSuccessRate    = clamp((tutor.successRate || 75) / 100);
  const pastInteraction     = tutor.pastStudents?.includes(student._id?.toString()) ? 1 : 0;
  const tutorRating         = clamp((tutor.rating || 4) / 5);
  const budgetFit           = clamp(1 - Math.max(0, (tutor.hourlyRate || 0) - (student.budget || 500)) / 500);
  const days                = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const studentDays         = student.availability || days.slice(0, 5);
  const tutorDays           = tutor.availability || days.slice(0, 5);
  const overlap             = studentDays.filter(d => tutorDays.includes(d)).length;
  const availabilityOverlap = clamp(overlap / 7);
  const reviewSentiment     = clamp((tutor.reviewScore || 0.7));

  return {
    subjectMatch,
    studentPerf:         perfScore,
    tutorSuccessRate,
    pastInteraction,
    tutorRating,
    budgetFit,
    availabilityOverlap,
    reviewSentiment,
  };
}

// ── MIDDLEWARE: check models are loaded ───────────────────────────────────────
function requireModels(req, res, next) {
  if (!matchNet || !perfNet || !recommendNet) {
    return res.status(503).json({
      error: 'ML models not loaded. Please run: node ml/trainModels.js first.'
    });
  }
  next();
}

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/ml/match
// Body: { studentProfile, tutorIds[] }
// Returns tutors ranked by AI match score
// ══════════════════════════════════════════════════════════════════════════════
router.post('/match', requireModels, async (req, res) => {
  try {
    const { studentProfile, tutorIds } = req.body;

    if (!studentProfile || !tutorIds?.length) {
      return res.status(400).json({ error: 'studentProfile and tutorIds are required.' });
    }

    // Fetch tutors from DB
    const tutors = await User.find({ _id: { $in: tutorIds }, role: 'teacher' });

    const results = tutors.map(tutor => {
      const input      = buildMatchInput(studentProfile, tutor);
      const output     = matchNet.run(input);
      const matchScore = Math.round(clamp(output.score) * 100);
      return {
        tutorId:    tutor._id,
        name:       tutor.name,
        subjects:   tutor.subjects,
        location:   tutor.location,
        hourlyRate: tutor.hourlyRate,
        mode:       tutor.mode,
        matchScore,
      };
    });

    results.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, matches: results });
  } catch (err) {
    console.error('Match error:', err);
    res.status(500).json({ error: 'Error running tutor match model.' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/ml/performance
// Body: { studentId, quizHistory[] }
// quizHistory: [{ score, topic, timePerQuestion }]
// Returns: { level: 'weak'|'average'|'strong', scores, advice }
// ══════════════════════════════════════════════════════════════════════════════
router.post('/performance', requireModels, async (req, res) => {
  try {
    const { studentId, quizHistory } = req.body;

    if (!quizHistory?.length) {
      return res.status(400).json({ error: 'quizHistory array is required.' });
    }

    const input  = buildPerfInput(quizHistory);
    const output = perfNet.run(input);

    // Pick highest output neuron
    const level = Object.entries(output).sort((a, b) => b[1] - a[1])[0][0];

    const advice = {
      weak:    'Focus on fundamentals. Practice 10 questions daily. Book a tutor for core topics.',
      average: 'Good progress! Target weak topics and increase quiz frequency.',
      strong:  'Excellent! Challenge yourself with advanced topics and help peers.',
    }[level];

    const avgScore = quizHistory.reduce((a, b) => a + b.score, 0) / quizHistory.length;

    res.json({
      success: true,
      studentId,
      level,
      confidence: {
        weak:    Math.round(output.weak    * 100),
        average: Math.round(output.average * 100),
        strong:  Math.round(output.strong  * 100),
      },
      stats: {
        avgScore:   Math.round(avgScore),
        attempts:   quizHistory.length,
        topicsDone: [...new Set(quizHistory.map(h => h.topic))].length,
      },
      advice,
    });
  } catch (err) {
    console.error('Performance error:', err);
    res.status(500).json({ error: 'Error running performance model.' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/ml/recommend
// Body: { studentProfile, quizHistory[], tutorIds[] }
// Returns: tutors ranked by recommendation score based on student's progress
// ══════════════════════════════════════════════════════════════════════════════
router.post('/recommend', requireModels, async (req, res) => {
  try {
    const { studentProfile, quizHistory, tutorIds } = req.body;

    if (!studentProfile || !tutorIds?.length) {
      return res.status(400).json({ error: 'studentProfile and tutorIds are required.' });
    }

    // Step 1: Get student's performance level
    let perfLevel = 'average';
    if (quizHistory?.length) {
      const perfInput  = buildPerfInput(quizHistory);
      const perfOutput = perfNet.run(perfInput);
      perfLevel = Object.entries(perfOutput).sort((a, b) => b[1] - a[1])[0][0];
    }

    // Step 2: Fetch tutors
    const tutors = await User.find({ _id: { $in: tutorIds }, role: 'teacher' });

    // Step 3: Score each tutor
    const results = tutors.map(tutor => {
      const input     = buildRecommendInput(studentProfile, tutor, perfLevel);
      const output    = recommendNet.run(input);
      const recScore  = Math.round(clamp(output.score) * 100);
      return {
        tutorId:    tutor._id,
        name:       tutor.name,
        subjects:   tutor.subjects,
        location:   tutor.location,
        hourlyRate: tutor.hourlyRate,
        mode:       tutor.mode,
        recScore,
        whyRecommended: perfLevel === 'weak'
          ? 'Great for building fundamentals'
          : perfLevel === 'strong'
          ? 'Perfect for advanced learning'
          : 'Well-matched for your current level',
      };
    });

    results.sort((a, b) => b.recScore - a.recScore);

    res.json({
      success: true,
      studentPerformanceLevel: perfLevel,
      recommendations: results,
    });
  } catch (err) {
    console.error('Recommend error:', err);
    res.status(500).json({ error: 'Error running recommendation model.' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/ml/status
// Check if models are loaded
// ══════════════════════════════════════════════════════════════════════════════
router.get('/status', (req, res) => {
  res.json({
    matchModel:     !!matchNet,
    perfModel:      !!perfNet,
    recommendModel: !!recommendNet,
    status: (matchNet && perfNet && recommendNet) ? 'ready' : 'not trained',
  });
});

module.exports = router;