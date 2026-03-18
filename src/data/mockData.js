export const tutors = [
  {
    id: 1,
    name: "Dr. Priya Sharma",
    avatar: "https://i.pravatar.cc/150?u=priya",
    subjects: ["Mathematics", "Physics"],
    rating: 4.9,
    reviews: 234,
    aiMatchScore: 97,
    verified: true,
    experience: "8 years",
    hourlyRate: 800,
    mode: ["online", "offline"],
    location: "Delhi, India",
    bio: "PhD in Applied Mathematics from IIT Delhi. Passionate about making complex concepts simple and accessible. Specializes in competitive exam preparation and advanced calculus.",
    qualifications: ["PhD Applied Mathematics - IIT Delhi", "M.Sc Mathematics - DU", "CSIR NET Qualified"],
    availability: ["Mon", "Wed", "Fri", "Sat"],
    languages: ["English", "Hindi"],
    totalStudents: 450,
    totalSessions: 1820,
    responseTime: "< 1 hour",
    reviewsList: [
      { name: "Rahul K.", rating: 5, text: "Best math tutor! Helped me crack JEE Advanced.", date: "2 weeks ago" },
      { name: "Sneha M.", rating: 5, text: "Excellent teaching methodology. Very patient and thorough.", date: "1 month ago" },
      { name: "Amit P.", rating: 4, text: "Great at explaining concepts. Highly recommended.", date: "2 months ago" }
    ]
  },
  {
    id: 2,
    name: "Arjun Mehta",
    avatar: "https://i.pravatar.cc/150?u=arjun",
    subjects: ["Computer Science", "AI/ML"],
    rating: 4.8,
    reviews: 189,
    aiMatchScore: 94,
    verified: true,
    experience: "6 years",
    hourlyRate: 1000,
    mode: ["online"],
    location: "Bangalore, India",
    bio: "Former Google engineer turned educator. Expert in Data Structures, Machine Learning, and Full-Stack Development. Makes coding fun and practical.",
    qualifications: ["M.Tech CS - IISc Bangalore", "B.Tech CS - NIT Trichy", "Google Certified ML Engineer"],
    availability: ["Tue", "Thu", "Sat", "Sun"],
    languages: ["English", "Hindi", "Kannada"],
    totalStudents: 380,
    totalSessions: 1540,
    responseTime: "< 30 min",
    reviewsList: [
      { name: "Kiran S.", rating: 5, text: "Amazing at teaching DSA. Got placed at Amazon!", date: "1 week ago" },
      { name: "Pooja R.", rating: 5, text: "The ML course was incredibly well-structured.", date: "3 weeks ago" },
      { name: "Dev M.", rating: 4, text: "Very knowledgeable. Sometimes sessions go overtime (in a good way!).", date: "1 month ago" }
    ]
  },
  {
    id: 3,
    name: "Ananya Iyer",
    avatar: "https://i.pravatar.cc/150?u=ananya",
    subjects: ["English", "Creative Writing"],
    rating: 4.7,
    reviews: 156,
    aiMatchScore: 91,
    verified: true,
    experience: "5 years",
    hourlyRate: 600,
    mode: ["online", "offline"],
    location: "Mumbai, India",
    bio: "Published author and language enthusiast. Helps students master English communication, academic writing, and creative expression with personalized approaches.",
    qualifications: ["MA English Literature - Mumbai University", "CELTA Certified", "Published Author"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    languages: ["English", "Hindi", "Marathi"],
    totalStudents: 290,
    totalSessions: 1100,
    responseTime: "< 2 hours",
    reviewsList: [
      { name: "Sara J.", rating: 5, text: "My IELTS score jumped from 6.5 to 8.0!", date: "2 weeks ago" },
      { name: "Rohan T.", rating: 5, text: "Creative writing sessions are so inspiring.", date: "1 month ago" },
      { name: "Meera S.", rating: 4, text: "Very patient teacher. Highly recommend for beginners.", date: "2 months ago" }
    ]
  },
  {
    id: 4,
    name: "Vikram Rathore",
    avatar: "https://i.pravatar.cc/150?u=vikram",
    subjects: ["Chemistry", "Biology"],
    rating: 4.6,
    reviews: 142,
    aiMatchScore: 88,
    verified: false,
    experience: "4 years",
    hourlyRate: 700,
    mode: ["offline"],
    location: "Pune, India",
    bio: "MBBS graduate with a passion for teaching NEET aspirants. Combines medical knowledge with engaging teaching methods to make science come alive.",
    qualifications: ["MBBS - AIIMS Pune", "B.Sc Biology - Fergusson College"],
    availability: ["Mon", "Wed", "Sat", "Sun"],
    languages: ["English", "Hindi", "Marathi"],
    totalStudents: 210,
    totalSessions: 890,
    responseTime: "< 3 hours",
    reviewsList: [
      { name: "Priya N.", rating: 5, text: "Cleared NEET with AIR under 5000. Thank you sir!", date: "3 weeks ago" },
      { name: "Arjun K.", rating: 4, text: "Good teacher but sometimes hard to schedule.", date: "1 month ago" },
      { name: "Neha P.", rating: 5, text: "Biology concepts became so clear after his sessions.", date: "2 months ago" }
    ]
  },
  {
    id: 5,
    name: "Sneha Kapoor",
    avatar: "https://i.pravatar.cc/150?u=sneha",
    subjects: ["Music", "Piano"],
    rating: 4.9,
    reviews: 98,
    aiMatchScore: 85,
    verified: true,
    experience: "10 years",
    hourlyRate: 900,
    mode: ["online", "offline"],
    location: "Jaipur, India",
    bio: "Trinity College London certified pianist and music educator. Teaching Western and Indian classical music with a modern, student-friendly approach.",
    qualifications: ["LTCL Trinity College", "MA Music - Rajasthan University"],
    availability: ["Tue", "Thu", "Fri", "Sat"],
    languages: ["English", "Hindi"],
    totalStudents: 180,
    totalSessions: 760,
    responseTime: "< 1 hour",
    reviewsList: [
      { name: "Riya A.", rating: 5, text: "Learned piano from scratch to Grade 5 in 2 years!", date: "1 week ago" },
      { name: "Kunal S.", rating: 5, text: "Best music teacher. Very encouraging and skilled.", date: "1 month ago" },
      { name: "Anita B.", rating: 5, text: "My daughter loves her sessions. Highly recommended!", date: "2 months ago" }
    ]
  },
  {
    id: 6,
    name: "Rajesh Kumar",
    avatar: "https://i.pravatar.cc/150?u=rajesh",
    subjects: ["Economics", "Business Studies"],
    rating: 4.5,
    reviews: 167,
    aiMatchScore: 82,
    verified: true,
    experience: "7 years",
    hourlyRate: 750,
    mode: ["online"],
    location: "Kolkata, India",
    bio: "CA and MBA with deep expertise in economics and business. Makes dry subjects engaging with real-world case studies and current affairs integration.",
    qualifications: ["MBA - IIM Calcutta", "CA - ICAI", "B.Com - St. Xavier's Kolkata"],
    availability: ["Mon", "Tue", "Wed", "Thu"],
    languages: ["English", "Hindi", "Bengali"],
    totalStudents: 320,
    totalSessions: 1300,
    responseTime: "< 2 hours",
    reviewsList: [
      { name: "Simran P.", rating: 5, text: "Economics was never this interesting before!", date: "2 weeks ago" },
      { name: "Varun G.", rating: 4, text: "Great for Commerce students. Very professional.", date: "1 month ago" },
      { name: "Deepa M.", rating: 4, text: "Helped me understand macroeconomics concepts deeply.", date: "3 months ago" }
    ]
  },
  {
    id: 7,
    name: "Dr. Sarah Chen",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    subjects: ["History", "Political Science"],
    rating: 4.8,
    reviews: 112,
    aiMatchScore: 89,
    verified: true,
    experience: "12 years",
    hourlyRate: 850,
    mode: ["online"],
    location: "Chennai, India",
    bio: "Former university professor making history come alive through storytelling and primary source analysis. Expert in World History and Indian Politics.",
    qualifications: ["PhD History - JNU", "MA Political Science"],
    availability: ["Sat", "Sun"],
    languages: ["English", "Tamil"],
    totalStudents: 150,
    totalSessions: 940,
    responseTime: "< 12 hours",
    reviewsList: [
      { name: "John D.", rating: 5, text: "Makes historical events feel like a movie!", date: "1 week ago" }
    ]
  },
  {
    id: 8,
    name: "Emilio Romano",
    avatar: "https://i.pravatar.cc/150?u=emilio",
    subjects: ["Spanish", "French"],
    rating: 4.9,
    reviews: 305,
    aiMatchScore: 95,
    verified: true,
    experience: "15 years",
    hourlyRate: 1200,
    mode: ["online", "offline"],
    location: "Delhi, India",
    bio: "Native Spanish speaker with native-level French proficiency. Uses immersive conversational techniques to build fluency fast. Prepares students for DELE/DELF exams.",
    qualifications: ["BA Linguistics", "DELE Examiner Certified"],
    availability: ["Tue", "Wed", "Thu", "Fri"],
    languages: ["Spanish", "French", "English"],
    totalStudents: 520,
    totalSessions: 2100,
    responseTime: "< 1 hour",
    reviewsList: [
      { name: "Anita K.", rating: 5, text: "Passed my DELF B2 thanks to Emilio!", date: "3 days ago" }
    ]
  },
  {
    id: 9,
    name: "Neha Gupta",
    avatar: "https://i.pravatar.cc/150?u=neha",
    subjects: ["SAT Prep", "GRE Prep"],
    rating: 4.7,
    reviews: 210,
    aiMatchScore: 92,
    verified: false,
    experience: "5 years",
    hourlyRate: 1500,
    mode: ["online"],
    location: "Mumbai, India",
    bio: "Scored 1580 on SAT and 335 on GRE. Specializes in test-taking strategies, time management, and algorithmic approaches to cracking standardized tests.",
    qualifications: ["B.Tech - IIT Bombay", "MBA - Stanford"],
    availability: ["Mon", "Wed", "Fri", "Sat", "Sun"],
    languages: ["English", "Hindi"],
    totalStudents: 280,
    totalSessions: 1150,
    responseTime: "< 30 min",
    reviewsList: [
      { name: "Sam S.", rating: 5, text: "My SAT math score jumped 120 points.", date: "1 month ago" }
    ]
  },
  {
    id: 10,
    name: "Meera Deshpande",
    avatar: "https://i.pravatar.cc/150?u=meera",
    subjects: ["Digital Art", "Graphic Design"],
    rating: 5.0,
    reviews: 84,
    aiMatchScore: 81,
    verified: true,
    experience: "3 years",
    hourlyRate: 650,
    mode: ["online"],
    location: "Pune, India",
    bio: "Professional UI/UX designer and illustrator. Teaching Procreate, Photoshop, and Figma to budding creatives with a focus on portfolio building.",
    qualifications: ["BFA Applied Arts", "UX Bootcamp Alum"],
    availability: ["Sat", "Sun"],
    languages: ["English", "Marathi"],
    totalStudents: 90,
    totalSessions: 320,
    responseTime: "< 4 hours",
    reviewsList: [
      { name: "Kavya P.", rating: 5, text: "Got into my dream design school with her portfolio help!", date: "2 weeks ago" }
    ]
  }
];

export const dashboardData = {
  student: {
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?u=alex",
    grade: "Class 12",
    streak: 14,
    totalHours: 156,
    coursesCompleted: 8,
    rank: 23,
    badges: [
      { name: "Quick Learner", icon: "⚡", earned: true },
      { name: "100 Hours", icon: "🏆", earned: true },
      { name: "Perfect Score", icon: "💯", earned: true },
      { name: "Night Owl", icon: "🦉", earned: true },
      { name: "Social Star", icon: "⭐", earned: false },
      { name: "Master Mind", icon: "🧠", earned: false }
    ]
  },
  progressData: [
    { month: "Sep", math: 65, science: 58, english: 72 },
    { month: "Oct", math: 70, science: 65, english: 75 },
    { month: "Nov", math: 75, science: 72, english: 78 },
    { month: "Dec", math: 82, science: 78, english: 80 },
    { month: "Jan", math: 88, science: 85, english: 84 },
    { month: "Feb", math: 92, science: 89, english: 88 },
    { month: "Mar", math: 95, science: 92, english: 91 }
  ],
  skillsData: [
    { skill: "Problem Solving", score: 92 },
    { skill: "Conceptual Understanding", score: 88 },
    { skill: "Application", score: 85 },
    { skill: "Speed & Accuracy", score: 78 },
    { skill: "Critical Thinking", score: 90 },
    { skill: "Communication", score: 82 }
  ],
  recentSessions: [
    { tutor: "Dr. Priya Sharma", subject: "Mathematics", date: "Mar 12, 2026", duration: "1.5 hrs", mode: "online", rating: 5 },
    { tutor: "Arjun Mehta", subject: "AI/ML", date: "Mar 10, 2026", duration: "2 hrs", mode: "online", rating: 5 },
    { tutor: "Ananya Iyer", subject: "English", date: "Mar 8, 2026", duration: "1 hr", mode: "offline", rating: 4 }
  ],
  upcomingSessions: [
    { tutor: "Dr. Priya Sharma", subject: "Calculus", date: "Mar 15, 2026", time: "4:00 PM", mode: "online" },
  ],
  subjectDistribution: [
    { name: "Mathematics", value: 35, color: "#FD7333" },
    { name: "Computer Science", value: 25, color: "#E65A1B" },
    { name: "English", value: 20, color: "#FF8D54" },
    { name: "Physics", value: 15, color: "rgba(253, 115, 51, 0.6)" },
    { name: "Others", value: 5, color: "rgba(253, 115, 51, 0.4)" }
  ]
};

export const stats = {
  totalTutors: 12500,
  totalStudents: 85000,
  totalSessions: 540000,
  avgRating: 4.8,
  citiesCovered: 150,
  subjectsOffered: 200
};

export const features = [
  {
    icon: "🤖",
    title: "AI Smart Matching",
    description: "Our AI analyzes learning style, goals, location, and preferences to find your perfect tutor match with 95%+ accuracy.",
    gradient: "linear-gradient(135deg, var(--primary-500), var(--primary-400))"
  },
  {
    icon: "🔒",
    title: "AI-Verified Credentials",
    description: "Every tutor's credentials are verified through our AI validation pipeline, ensuring 100% authentic qualifications and building unshakable trust.",
    gradient: "linear-gradient(135deg, rgba(253, 115, 51, 0.8), rgba(253, 115, 51, 0.6))"
  },
  {
    icon: "🔄",
    title: "Hybrid Learning",
    description: "Seamlessly switch between online and offline sessions. Learn from home or meet face-to-face — the choice is always yours.",
    gradient: "linear-gradient(135deg, var(--primary-600), var(--primary-500))"
  },
  {
    icon: "📊",
    title: "Real-time Analytics",
    description: "Track progress with AI-powered dashboards. Identify learning gaps, monitor improvement, and get data-driven insights.",
    gradient: "linear-gradient(135deg, #FD7333, #E65A1B)"
  },
  {
    icon: "🎮",
    title: "Gamified Learning",
    description: "Earn badges, maintain streaks, climb leaderboards, and stay motivated with our engaging gamification system.",
    gradient: "linear-gradient(135deg, #FF8D54, #FD7333)"
  },
  {
    icon: "🚨",
    title: "Emergency Doubt Clearing",
    description: "Stuck on a problem? Get instant help from available tutors with our real-time emergency doubt clearing feature.",
    gradient: "linear-gradient(135deg, #E65A1B, #FF8D54)"
  }
];

export const techStack = [
  { name: "React & React Native", category: "Frontend", icon: "⚛️", desc: "Modern responsive web & mobile apps" },
  { name: "Tailwind CSS", category: "Frontend", icon: "🎨", desc: "Fast, consistent cross-device UI" },
  { name: "Node.js & Express", category: "Backend", icon: "🟢", desc: "Scalable server-side logic" },
  { name: "Python", category: "AI/ML", icon: "🐍", desc: "AI matching engine & analytics" },
  { name: "TensorFlow / Scikit-Learn", category: "AI/ML", icon: "🧠", desc: "ML models for compatibility scoring" },
  { name: "MongoDB", category: "Database", icon: "🍃", desc: "Flexible document store" },
  { name: "PostgreSQL", category: "Database", icon: "🐘", desc: "Relational data management" },
  { name: "AWS / Azure", category: "Cloud", icon: "☁️", desc: "Scalable cloud infrastructure" },
  { name: "brain.js", category: "AI/ML", icon: "🧠", desc: "Real ML-powered tutor matching & performance prediction" },
  { name: "OAuth & JWT", category: "Security", icon: "🔒", desc: "Secure authentication" }
];
