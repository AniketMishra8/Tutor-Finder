const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');

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

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/bookings — Create a new booking
// ══════════════════════════════════════════════════════════════════════════════
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tutorId, tutorName, subject, date, time, mode, notes } = req.body;

    if (!tutorId || !tutorName || !subject || !date || !time) {
      return res.status(400).json({ error: 'tutorId, tutorName, subject, date, and time are required.' });
    }

    const booking = await Booking.create({
      studentId: req.user.id,
      studentName: req.body.studentName || 'Student',
      tutorId,
      tutorName,
      subject,
      date,
      time,
      mode: mode || 'Online (Video Call)',
      notes: notes || '',
      status: 'confirmed'
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ error: 'Server error creating booking.' });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/bookings/my — Get bookings for logged-in user
// ══════════════════════════════════════════════════════════════════════════════
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const query = req.user.role === 'teacher'
      ? { tutorId: req.user.id }
      : { studentId: req.user.id };

    const bookings = await Booking.find(query).sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (err) {
    console.error('Fetch bookings error:', err);
    res.status(500).json({ error: 'Server error fetching bookings.' });
  }
});

module.exports = router;
