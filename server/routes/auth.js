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
const VALID_ROLES = ['student', 'parent', 'tutor'];

// ─── 1. REGISTER ROUTE ────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, studentEmail } = req.body;

    // ── STEP 1: Check all required fields are present ──
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are all required.' });
    }

    const trimmedName  = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedRole  = role.trim().toLowerCase();

    // ── STEP 2: Validate name ──
    if (!isValidName(trimmedName)) {
      return res.status(400).json({
        error: 'Name must be 2–50 characters and contain only letters, spaces, hyphens, or apostrophes.'
      });
    }

    // ── STEP 3: Validate email format ──
    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address (e.g. user@example.com).' });
    }

    // ── STEP 4: Validate role ──
    if (!VALID_ROLES.includes(trimmedRole)) {
      return res.status(400).json({ error: `Role must be one of: ${VALID_ROLES.join(', ')}.` });
    }

    // ── STEP 5: Validate password strength ──
    if (!isStrongPassword(password)) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&^#_-).'
      });
    }

    // ── STEP 6: Validate studentEmail if registering as parent ──
    if (trimmedRole === 'parent') {
      if (!studentEmail || !studentEmail.trim()) {
        return res.status(400).json({ error: 'A student email is required when registering as a parent.' });
      }
      const trimmedStudentEmail = studentEmail.trim().toLowerCase();
      if (!isValidEmail(trimmedStudentEmail)) {
        return res.status(400).json({ error: 'Please enter a valid student email address.' });
      }
      if (trimmedStudentEmail === trimmedEmail) {
        return res.status(400).json({ error: 'Parent email and student email cannot be the same.' });
      }
    }

    // ── STEP 7: Check if user already exists ──
    let existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    // ── STEP 8: Validate Parent-Child linkage ──
    if (trimmedRole === 'parent') {
      const trimmedStudentEmail = studentEmail.trim().toLowerCase();
      const childExists = await User.findOne({ email: trimmedStudentEmail, role: 'student' });
      if (!childExists) {
        return res.status(400).json({
          error: 'We could not find a registered student with that email. Please ensure the student has registered first.'
        });
      }
    }

    // ── STEP 9: Hash password ──
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ── STEP 10: Create and save user ──
    const newUser = new User({
      name: trimmedName,
      email: trimmedEmail,
      password: hashedPassword,
      role: trimmedRole,
      studentEmail: trimmedRole === 'parent' ? studentEmail.trim().toLowerCase() : undefined
    });

    await newUser.save();

    // ── STEP 11: Generate JWT ──
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// ─── 2. LOGIN ROUTE ───────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── STEP 1: Check required fields ──
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // ── STEP 2: Validate email format before hitting the database ──
    if (!isValidEmail(trimmedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // ── STEP 3: Check if user exists ──
    // (must explicitly select password since it has select: false in schema)
    const user = await User.findOne({ email: trimmedEmail }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // ── STEP 4: Compare password ──
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // ── STEP 5: Generate Token ──
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // ── STEP 6: If parent, attach the student's name for UI convenience ──
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
        studentName
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;