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
    const hashedPassword = await bcrypt.hash('Demo@1234', salt);

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
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['Computer Science', 'AI/ML'],
        bio: 'Former Google engineer turned educator. Expert in Data Structures, Machine Learning, and Full-Stack Development.',
        hourlyRate: 1000,
        experience: '6 years',
        location: 'Bangalore, India',
        qualifications: ['M.Tech CS - IISc Bangalore', 'Google Certified ML Engineer'],
        languages: ['English', 'Hindi', 'Kannada'],
        mode: ['online'],
        availability: ['Tue', 'Thu', 'Sat', 'Sun']
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['English', 'Creative Writing'],
        bio: 'Published author and language enthusiast. Helps students master English communication and creative expression.',
        hourlyRate: 600,
        experience: '5 years',
        location: 'Mumbai, India',
        qualifications: ['MA English Literature', 'CELTA Certified', 'Published Author'],
        languages: ['English', 'Hindi', 'Marathi'],
        mode: ['online', 'offline'],
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
      },
      {
        name: 'Dr. Sarah Chen',
        email: 'sarah@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['History', 'Political Science'],
        bio: 'Former university professor making history come alive through storytelling and primary source analysis.',
        hourlyRate: 850,
        experience: '12 years',
        location: 'Chennai, India',
        qualifications: ['PhD History - JNU', 'MA Political Science'],
        languages: ['English', 'Tamil'],
        mode: ['online'],
        availability: ['Sat', 'Sun']
      },
      {
        name: 'Vikram Rathore',
        email: 'vikram@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['Biology', 'Chemistry'],
        bio: 'MBBS graduate passionate about teaching NEET aspirants. Combines medical knowledge with engaging teaching methods.',
        hourlyRate: 700,
        experience: '4 years',
        location: 'Pune, India',
        qualifications: ['MBBS - AIIMS Pune', 'B.Sc Biology'],
        languages: ['English', 'Hindi', 'Marathi'],
        mode: ['offline', 'online'],
        availability: ['Mon', 'Wed', 'Sat', 'Sun']
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['Economics', 'Business Studies'],
        bio: 'CA and MBA with deep expertise in economics and business. Makes dry subjects engaging with real-world case studies.',
        hourlyRate: 750,
        experience: '7 years',
        location: 'Kolkata, India',
        qualifications: ['MBA - IIM Calcutta', 'CA - ICAI'],
        languages: ['English', 'Hindi', 'Bengali'],
        mode: ['online'],
        availability: ['Mon', 'Tue', 'Wed', 'Thu']
      },
      {
        name: 'Rahul Verma',
        email: 'rahul.python@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['Python', 'Machine Learning', 'Data Science'],
        bio: 'Former Google Engineer passionate about teaching Python and AI. I build practical, real-world projects with my students.',
        hourlyRate: 1200,
        experience: '8 years',
        location: 'Bangalore, India',
        qualifications: ['B.Tech Computer Science - IIT Delhi'],
        languages: ['English', 'Hindi'],
        mode: ['online'],
        availability: ['Sat', 'Sun', 'Wed', 'Fri']
      },
      {
        name: 'Elena Rodriguez',
        email: 'elena.spanish@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['Spanish', 'French'],
        bio: 'Native Spanish speaker with DELE certification. I teach conversational and academic Spanish through cultural immersion.',
        hourlyRate: 800,
        experience: '5 years',
        location: 'Madrid, Spain',
        qualifications: ['MA in Linguistics', 'DELE Examiner'],
        languages: ['English', 'Spanish', 'French'],
        mode: ['online'],
        availability: ['Mon', 'Tue', 'Thu', 'Fri']
      },
      {
        name: 'Aishwarya Sen',
        email: 'aishwarya.music@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['Piano', 'Music Theory', 'Vocals'],
        bio: 'Trinity College London grade 8 certified. I teach classical piano and modern keyboard techniques for all age groups.',
        hourlyRate: 600,
        experience: '10 years',
        location: 'Mumbai, India',
        qualifications: ['Grade 8 Piano - Trinity Laban'],
        languages: ['English', 'Hindi', 'Marathi'],
        mode: ['online', 'offline'],
        availability: ['Sat', 'Sun', 'Mon']
      },
      {
        name: 'Dr. Ritesh Deshmukh',
        email: 'ritesh.physics@teacher.com'.toLowerCase(),
        password: hashedPassword,
        role: 'teacher',
        isProfileComplete: true,
        subjects: ['Physics', 'Advanced Mathematics'],
        bio: 'Specializing in JEE Advanced Physics. My students consistently secure top 1000 ranks.',
        hourlyRate: 1500,
        experience: '15 years',
        location: 'Kota, India',
        qualifications: ['PhD in Quantum Mechanics'],
        languages: ['English', 'Hindi'],
        mode: ['online', 'offline'],
        availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
