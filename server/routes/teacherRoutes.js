const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'temporary_secret_for_development';

// ====== JWT MIDDLEWARE ======
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

// 1. SAVE/UPDATE TEACHER PROFILE (Protected)
router.post('/profile', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only teachers can update their profile.' });
    }

    const { subjects, bio, hourlyRate, experience, location, qualifications, languages, mode, availability } = req.body;

    if (!subjects || subjects.length === 0) {
      return res.status(400).json({ error: 'Please add at least one subject.' });
    }
    if (!bio || bio.trim().length < 20) {
      return res.status(400).json({ error: 'Please write a bio of at least 20 characters.' });
    }
    if (!hourlyRate || hourlyRate <= 0) {
      return res.status(400).json({ error: 'Please set a valid hourly rate.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.subjects = subjects;
    user.bio = bio;
    user.hourlyRate = hourlyRate;
    user.experience = experience || '';
    user.location = location || '';
    user.qualifications = qualifications || [];
    user.languages = languages || [];
    user.mode = mode || ['online'];
    user.availability = availability || [];
    user.isProfileComplete = true;
    user.avatar = `https://i.pravatar.cc/150?u=${user.email}`;

    await user.save();

    res.json({
      message: 'Profile updated successfully!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        subjects: user.subjects,
        bio: user.bio,
        hourlyRate: user.hourlyRate,
        experience: user.experience,
        location: user.location,
        qualifications: user.qualifications,
        languages: user.languages,
        mode: user.mode,
        availability: user.availability,
        isProfileComplete: user.isProfileComplete,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Teacher Profile Update Error:', error);
    res.status(500).json({ error: 'Server error while updating profile.' });
  }
});

// 2. GET CURRENT TEACHER'S OWN PROFILE (Protected) — MUST be before /:id
router.get('/me/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -verificationToken -verificationTokenExpires');
    if (!user || user.role !== 'teacher') {
      return res.status(404).json({ error: 'Teacher profile not found.' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      subjects: user.subjects,
      bio: user.bio,
      hourlyRate: user.hourlyRate,
      experience: user.experience,
      location: user.location,
      qualifications: user.qualifications,
      languages: user.languages,
      mode: user.mode,
      availability: user.availability,
      isProfileComplete: user.isProfileComplete,
      avatar: user.avatar
    });

  } catch (error) {
    console.error('Get My Profile Error:', error);
    res.status(500).json({ error: 'Server error while fetching profile.' });
  }
});

// 3. GET ALL TEACHERS (PUBLIC — for students to browse)
router.get('/', async (req, res) => {
  try {
    const teachers = await User.find({
      role: 'teacher',
      isProfileComplete: true
    }).select('-password -studentEmail');

    const formatted = teachers.map(t => ({
      id: t._id,
      name: t.name,
      avatar: t.avatar || `https://i.pravatar.cc/150?u=${t.email}`,
      subjects: t.subjects,
      rating: 0,
      reviews: 0,
      aiMatchScore: Math.floor(Math.random() * 15) + 80,
      verified: true,
      experience: t.experience,
      hourlyRate: t.hourlyRate,
      mode: t.mode,
      location: t.location,
      bio: t.bio,
      qualifications: t.qualifications,
      availability: t.availability,
      languages: t.languages,
      totalStudents: 0,
      totalSessions: 0,
      responseTime: '< 1 hour',
      reviewsList: [],
      isFromDB: true
    }));

    res.json(formatted);

  } catch (error) {
    console.error('Get Teachers Error:', error);
    res.status(500).json({ error: 'Server error while fetching teachers.' });
  }
});

// 4. GET SINGLE TEACHER BY ID (PUBLIC)
router.get('/:id', async (req, res) => {
  try {
    const teacher = await User.findOne({
      _id: req.params.id,
      role: 'teacher',
      isProfileComplete: true
    }).select('-password -studentEmail');

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }

    res.json({
      id: teacher._id,
      name: teacher.name,
      avatar: teacher.avatar || `https://i.pravatar.cc/150?u=${teacher.email}`,
      subjects: teacher.subjects,
      rating: 0,
      reviews: 0,
      aiMatchScore: Math.floor(Math.random() * 15) + 80,
      verified: true,
      experience: teacher.experience,
      hourlyRate: teacher.hourlyRate,
      mode: teacher.mode,
      location: teacher.location,
      bio: teacher.bio,
      qualifications: teacher.qualifications,
      availability: teacher.availability,
      languages: teacher.languages,
      totalStudents: 0,
      totalSessions: 0,
      responseTime: '< 1 hour',
      reviewsList: []
    });

  } catch (error) {
    console.error('Get Teacher Error:', error);
    res.status(500).json({ error: 'Server error while fetching teacher.' });
  }
});

module.exports = router;
