const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false // Do not return password by default in queries
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'parent'],
    required: true,
    default: 'student'
  },
  studentEmail: {
    type: String,
    required: function() { return this.role === 'parent'; },
    trim: true,
    lowercase: true
  },

  // Email Verification
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpires: {
    type: Date
  },

  // Teacher Profile Fields
  subjects: [{
    type: String,
    trim: true
  }],
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  hourlyRate: {
    type: Number,
    default: 0
  },
  experience: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  qualifications: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    trim: true
  }],
  mode: [{
    type: String,
    enum: ['online', 'offline']
  }],
  availability: [{
    type: String,
    enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }],
  isProfileComplete: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
