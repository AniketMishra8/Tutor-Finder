# 🎓 DeepThink — AI-Powered Hybrid Tutor Finder

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![brain.js](https://img.shields.io/badge/brain.js-ML_Engine-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

> A full-stack AI-powered education platform that matches students with tutors using trained neural networks, tracks learning progress with ML-driven performance analytics, and supports hybrid (online + offline) learning.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Smart Matching** | brain.js neural network matches students with tutors based on subject, mode, location, budget, and learning style |
| 📊 **ML Performance Prediction** | Trained neural network analyzes quiz history to classify students as weak/average/strong with confidence scores |
| 🎯 **AI Tutor Recommendations** | Performance-aware recommendations combining student level with tutor compatibility |
| 📝 **Practice Quiz System** | 250+ questions across 10 subjects with timed focus mode, tab-switch detection, and score tracking |
| 📅 **Session Booking** | Book sessions with tutors — pick tutor, date, time, mode — saved to MongoDB and shown in dashboard |
| 🎮 **Gamified Learning** | Badges, streaks, leaderboards, rewards store to keep students motivated |
| 👨‍👩‍👧 **Role-Based Dashboards** | Separate dashboards for Students, Teachers, and Parents with relevant analytics |
| 💬 **AI Chatbot** | Google Gemini-powered chatbot for instant assistance |
| 📚 **Book Recommendations** | AI-curated book suggestions based on student interests |
| 🏆 **Career Consultation** | Personalized career guidance based on skills and performance |
| 🔐 **Secure Auth** | JWT-based authentication with password strength validation |
| 🌗 **Dark Mode UI** | Premium glassmorphism design with animations and responsive layout |

---

## 🧠 ML Model Architecture

We use **brain.js** (JavaScript neural networks) — not just API calls — to train **3 real ML models** on custom datasets:

### 1. Tutor Match Model (`matchModel.json`)
- **Input**: Subject match, mode match, location, budget fit, tutor rating, experience, teaching style, language
- **Output**: Compatibility score (0–100%)
- **Use**: Ranks tutors by AI match score when students browse

### 2. Performance Prediction Model (`perfModel.json`)
- **Input**: Average quiz score, attempts, consistency, recent trend, time per question, topics covered
- **Output**: Classification — `weak` / `average` / `strong` with confidence percentages
- **Use**: Dashboard AI Performance Analysis card, personalized study advice

### 3. Recommendation Model (`recommendModel.json`)
- **Input**: Subject match, student performance level, tutor success rate, past interaction, rating, budget fit, availability overlap, review sentiment
- **Output**: Recommendation score (0–100%)
- **Use**: "AI Recommended Tutors" section — performance-aware recommendations

> Training script: `node server/ml/trainModels.js` — trains on 200+ data points in `server/ml/dataset.js`

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- Google Gemini API key (for chatbot)

### 1. Clone & Install

```bash
git clone <repository-url>
cd tutor-finder

# Frontend dependencies
npm install

# Backend dependencies
cd server
npm install
cd ..
```

### 2. Environment Setup

Create `server/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/tutor-finder
JWT_SECRET=your_jwt_secret_here
PORT=5000
```

Create root `.env`:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Train ML Models

```bash
cd server
node ml/trainModels.js
```

### 4. Seed Demo Data

```bash
cd server
node seedDemoAccounts.js
```

### 5. Run

```bash
# Terminal 1 — Backend
cd server
node server.js

# Terminal 2 — Frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | `alex@student.com` | `Demo@1234` |
| Teacher | `priya@teacher.com` | `Demo@1234` |
| Parent | `johnson@parent.com` | `Demo@1234` |

---

## 📁 Project Structure

```
tutor-finder/
├── public/                     # Static assets
├── src/
│   ├── components/             # Sidebar, AIChatbot, Footer, Feedback
│   ├── pages/                  # All page components
│   │   ├── Dashboard.jsx       # Role-based dashboards with ML cards
│   │   ├── PracticeQuiz.jsx    # Quiz system with focus mode
│   │   ├── ScheduleSession.jsx # Session booking form
│   │   ├── FindTutor.jsx       # Tutor browsing with AI matching
│   │   ├── GamifiedLearning.jsx
│   │   ├── CareerConsultation.jsx
│   │   └── ...
│   ├── context/                # AuthContext, ThemeContext
│   └── data/                   # Mock data for tutors, stats
├── server/
│   ├── models/
│   │   ├── User.js             # User schema (student/teacher/parent)
│   │   ├── QuizScore.js        # Quiz results for ML pipeline
│   │   └── Booking.js          # Session bookings
│   ├── routes/
│   │   ├── auth.js             # Register/Login with JWT
│   │   ├── ml.js               # ML endpoints (match/performance/recommend/quiz)
│   │   ├── teacherRoutes.js    # Teacher CRUD
│   │   └── bookingRoutes.js    # Booking CRUD
│   ├── ml/
│   │   ├── dataset.js          # Training data (200+ samples)
│   │   └── trainModels.js      # brain.js model training script
│   ├── seed.js                 # Quick seed script
│   └── seedDemoAccounts.js     # Full seed with teacher profiles
└── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/ml/match` | AI tutor matching |
| POST | `/api/ml/performance` | ML performance prediction |
| POST | `/api/ml/recommend` | AI tutor recommendations |
| POST | `/api/ml/quiz-score` | Save quiz result |
| GET | `/api/ml/quiz-history/:id` | Get student quiz history |
| GET | `/api/ml/status` | ML model status |
| GET | `/api/teachers` | List all teachers |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/my` | Get user's bookings |

---

## 👥 Team — DeepThink Labs

Built with ❤️ for the hackathon.

---

## 📄 License

ISC License
