const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'temporary_secret_for_development';

// ─── VALIDATION HELPERS ───────────────────────────────────────────────────────

/**
 * Validates email format using RFC-compliant regex.
 * Accepts: user@domain.com, user.name+tag@sub.domain.org, etc.
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Validates name:
 * - 2 to 50 characters long
 * - Only letters, spaces, hyphens, and apostrophes (e.g. "O'Brien", "Mary-Jane")
 * - Must start and end with a letter
 */
const isValidName = (name) => {
  const nameRegex = /^[A-Za-z][A-Za-z\s'\-]{0,48}[A-Za-z]$|^[A-Za-z]{2}$/;
  return nameRegex.test(name.trim());
};

/**
 * Validates password strength:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character
 */
const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#_\-])[A-Za-z\d@$!%*?&^#_\-]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Allowed roles for registration.
 */
const VALID_ROLES = ['student', 'parent', 'teacher'];

// ─── 1. REGISTER ROUTE ────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, studentEmail } = req.body;

    // ── STEP 1: Check all required fields are present ──
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are all required.' });
    }

    // ── STEP 2: Validate inputs ──
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!isValidName(name)) {
      return res.status(400).json({ error: 'Name must be 2-50 letters (spaces, hyphens, apostrophes allowed).' });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 8 characters with uppercase, lowercase, digit, and special character.' });
    }
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be student, parent, or teacher.' });
    }
    // A. Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // B. Validate Parent-Child linkage
    if (role === 'parent') {
      const childExists = await User.findOne({ email: studentEmail, role: 'student' });
      if (!childExists) {
        return res.status(400).json({ error: 'We could not find a registered student with that email. Please ensure the student has registered first.' });
      }
    }

    // C. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // E. Create user (treat as verified immediately)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      studentEmail: role === 'parent' ? studentEmail : undefined
    });

    await newUser.save();

    // Auto-login upon registration
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isProfileComplete: newUser.isProfileComplete
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // A. Check if user exists (we must explicitly request the password field since it has select: false in schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // B. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // C. Generate Token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // D. If parent, attach the student's name for UI convenience
    let studentName = null;
    if (user.role === 'parent') {
      const child = await User.findOne({ email: user.studentEmail, role: 'student' });
      studentName = child ? child.name : 'Unknown Student';
    }

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentName,
        isProfileComplete: user.isProfileComplete
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;