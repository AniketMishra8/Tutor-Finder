// server/ml/dataset.js
// Synthetic training data for all 3 brain.js ML models

// ── HELPERS ──────────────────────────────────────────────────────────────────
const subjects    = ['math', 'physics', 'chemistry', 'biology', 'english', 'history', 'cs', 'economics'];
const modes       = ['online', 'offline', 'both'];
const styles      = ['visual', 'auditory', 'reading', 'kinesthetic'];
const locations   = ['delhi', 'mumbai', 'bangalore', 'chennai', 'other'];

function rand(min, max) { return Math.random() * (max - min) + min; }
function pick(arr)       { return arr[Math.floor(Math.random() * arr.length)]; }
function encode(arr, val){ return arr.map(a => a === val ? 1 : 0); }

// ── 1. TUTOR MATCHING DATASET ─────────────────────────────────────────────────
// Input  : student profile + tutor profile (normalised numbers)
// Output : match score 0–1
function makeTutorMatchData(n = 600) {
  const data = [];
  for (let i = 0; i < n; i++) {
    const subjectMatch   = Math.random() > 0.4 ? 1 : 0;
    const modeMatch      = Math.random() > 0.3 ? 1 : 0;
    const locationMatch  = Math.random() > 0.5 ? 1 : 0;
    const budgetOk       = Math.random() > 0.35 ? 1 : 0;
    const tutorRating    = parseFloat(rand(3, 5).toFixed(2));
    const tutorExp       = parseFloat(rand(0, 15).toFixed(1));
    const styleMatch     = Math.random() > 0.5 ? 1 : 0;
    const langMatch      = Math.random() > 0.4 ? 1 : 0;

    // Weighted score formula (ground truth)
    const score =
      subjectMatch  * 0.30 +
      modeMatch     * 0.20 +
      locationMatch * 0.15 +
      budgetOk      * 0.15 +
      ((tutorRating - 3) / 2) * 0.10 +
      (tutorExp / 15)          * 0.05 +
      styleMatch               * 0.03 +
      langMatch                * 0.02;

    data.push({
      input: {
        subjectMatch,
        modeMatch,
        locationMatch,
        budgetOk,
        tutorRating:  tutorRating / 5,
        tutorExp:     tutorExp / 15,
        styleMatch,
        langMatch,
      },
      output: { score: parseFloat(Math.min(score, 1).toFixed(3)) }
    });
  }
  return data;
}

// ── 2. STUDENT PERFORMANCE DATASET ───────────────────────────────────────────
// Input  : quiz history metrics
// Output : { weak, average, strong }
function makePerformanceData(n = 600) {
  const data = [];
  for (let i = 0; i < n; i++) {
    const avgScore      = rand(0, 100);
    const attempts      = Math.floor(rand(1, 20));
    const consistency   = rand(0, 1);          // std-dev inverted
    const recentTrend   = rand(-1, 1);         // improving (+) / declining (-)
    const timePerQ      = rand(5, 60);         // seconds
    const topicsCovered = rand(0, 1);

    // Classify performance
    let weak = 0, average = 0, strong = 0;
    if (avgScore < 40 || (avgScore < 55 && consistency < 0.4)) {
      weak = 1;
    } else if (avgScore >= 75 && consistency > 0.6 && recentTrend > 0) {
      strong = 1;
    } else {
      average = 1;
    }

    data.push({
      input: {
        avgScore:      avgScore / 100,
        attempts:      Math.min(attempts / 20, 1),
        consistency,
        recentTrend:   (recentTrend + 1) / 2,   // normalise to 0–1
        timePerQ:      1 - Math.min(timePerQ / 60, 1), // faster = better
        topicsCovered,
      },
      output: { weak, average, strong }
    });
  }
  return data;
}

// ── 3. TUTOR RECOMMENDATION DATASET ──────────────────────────────────────────
// Input  : student-tutor compatibility features (richer than matching)
// Output : recommendation score 0–1
function makeTutorRecommendData(n = 600) {
  const data = [];
  for (let i = 0; i < n; i++) {
    const subjectMatch        = Math.random() > 0.35 ? 1 : 0;
    const studentPerf         = parseFloat(rand(0, 1).toFixed(2));   // 0=weak 1=strong
    const tutorSuccessRate    = parseFloat(rand(0.5, 1).toFixed(2));
    const pastInteraction     = Math.random() > 0.6 ? 1 : 0;
    const tutorRating         = parseFloat(rand(3, 5).toFixed(2));
    const budgetFit           = parseFloat(rand(0, 1).toFixed(2));
    const availabilityOverlap = parseFloat(rand(0, 1).toFixed(2));
    const reviewSentiment     = parseFloat(rand(0, 1).toFixed(2));

    const score =
      subjectMatch        * 0.25 +
      tutorSuccessRate    * 0.20 +
      ((tutorRating - 3) / 2) * 0.15 +
      budgetFit           * 0.12 +
      availabilityOverlap * 0.10 +
      reviewSentiment     * 0.08 +
      pastInteraction     * 0.06 +
      studentPerf         * 0.04;

    data.push({
      input: {
        subjectMatch,
        studentPerf,
        tutorSuccessRate,
        pastInteraction,
        tutorRating:         tutorRating / 5,
        budgetFit,
        availabilityOverlap,
        reviewSentiment,
      },
      output: { score: parseFloat(Math.min(score, 1).toFixed(3)) }
    });
  }
  return data;
}

module.exports = { makeTutorMatchData, makePerformanceData, makeTutorRecommendData };