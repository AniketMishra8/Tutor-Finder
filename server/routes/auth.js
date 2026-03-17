const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'temporary_secret_for_development';

// ====== EMAIL TRANSPORTER ======
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP Email
async function sendVerificationEmail(email, otp) {
  // If no email credentials are set, log to console (dev mode)
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`\n📧 [DEV MODE] Verification OTP for ${email}: ${otp}\n`);
    return;
  }

  const mailOptions = {
    from: `"Tutor Finder" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '🔐 Verify Your Tutor Finder Account',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: linear-gradient(135deg, #1a1a24, #2a2a3a); border-radius: 16px; color: #f4f4f5;">
        <h1 style="text-align: center; color: #FD7333; margin-bottom: 8px;">Tutor Finder</h1>
        <p style="text-align: center; color: #a1a1aa; margin-bottom: 24px;">Verify your email to get started</p>
        <div style="text-align: center; background: rgba(253,115,51,0.1); border: 1px solid rgba(253,115,51,0.3); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <p style="color: #a1a1aa; margin: 0 0 8px 0; font-size: 14px;">Your verification code is:</p>
          <h2 style="color: #FD7333; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h2>
        </div>
        <p style="color: #71717a; font-size: 13px; text-align: center;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

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

    // D. Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // E. Create user (unverified)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      studentEmail: role === 'parent' ? studentEmail : undefined,
      isVerified: false,
      verificationToken: otp,
      verificationTokenExpires: otpExpires
    });

    await newUser.save();

    // F. Send verification email
    await sendVerificationEmail(email, otp);

    res.status(201).json({
      needsVerification: true,
      message: 'Registration successful! Please check your email for the verification code.',
      email: email
    });

  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// 2. VERIFY EMAIL ROUTE
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      verificationToken: otp,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification code. Please try again or request a new one.' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Generate JWT and auto-login
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isProfileComplete: user.isProfileComplete
      }
    });

  } catch (error) {
    console.error('Verify Email Error:', error);
    res.status(500).json({ error: 'Server error during email verification.' });
  }
});

// 3. RESEND OTP ROUTE
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'No account found with this email.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'This account is already verified. Please login.' });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.verificationToken = otp;
    user.verificationTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // Send email
    await sendVerificationEmail(email, otp);

    res.json({ message: 'A new verification code has been sent to your email.' });

  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ error: 'Server error while resending verification code.' });
  }
});

// 4. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // A. Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // B. Check if verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        error: 'Please verify your email before logging in.',
        needsVerification: true,
        email: user.email
      });
    }

    // C. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // D. Generate Token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    // E. If parent, attach the student's name
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
