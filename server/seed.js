// This script seeds the MongoDB database with demo accounts for quick login.
// Run it once: node seed.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI;

const demoUsers = [
  { name: 'Alex Johnson',    email: 'alex@student.com',   password: 'password', role: 'student' },
  { name: 'Dr. Priya Sharma', email: 'priya@teacher.com', password: 'password', role: 'teacher' },
  { name: 'Mr. Johnson',     email: 'johnson@parent.com', password: 'password', role: 'parent', studentEmail: 'alex@student.com' }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB for seeding...');

  for (const u of demoUsers) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`  ⏭️  Skipping ${u.email} (already exists)`);
      continue;
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(u.password, salt);
    await User.create({ ...u, password: hashed });
    console.log(`  ✅ Created ${u.role}: ${u.email}`);
  }

  console.log('Seeding complete!');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
