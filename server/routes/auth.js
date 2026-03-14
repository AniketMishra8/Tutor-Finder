const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'temporary_secret_for_development';

// 1. REGISTER ROUTE
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, studentEmail } = req.body;

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

    // D. Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      studentEmail: role === 'parent' ? studentEmail : undefined
    });

    await newUser.save();

    // E. Generate JWT
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

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // A. Check if user exists (we must explicitly request the password field since it has select: false in schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // B. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
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
        studentName
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

module.exports = router;
