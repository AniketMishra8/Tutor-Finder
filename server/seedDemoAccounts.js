const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

const seedDemoAccounts = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);

    const demoUsers = [
      {
        name: 'Alex Student',
        email: 'alex@student.com'.toLowerCase(),
        password: hashedPassword,
        role: 'student'
      },
      {
        name: 'Priya Teacher',
        email: 'priya@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['Mathematics', 'Physics'],
        bio: 'Experienced tutor with a passion for math and science.',
        hourlyRate: 800,
        experience: '5 years',
        location: 'Online',
        qualifications: ['M.Sc. Physics'],
        languages: ['English', 'Hindi'],
        mode: ['online'],
        availability: ['Mon', 'Wed', 'Fri']
      },
      {
        name: 'Johnson Parent',
        email: 'johnson@parent.com'.toLowerCase(),
        password: hashedPassword,
        role: 'parent',
        studentEmail: 'alex@student.com'.toLowerCase()
      }
    ];

    for (const u of demoUsers) {
      const existingUser = await User.findOne({ email: u.email });
      if (!existingUser) {
        await User.create(u);
        console.log(`Created demo user: ${u.email}`);
      } else {
        console.log(`Demo user ${u.email} already exists.`);
      }
    }

    console.log('Demo accounts seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding demo accounts:', error);
    process.exit(1);
  }
};

seedDemoAccounts();
