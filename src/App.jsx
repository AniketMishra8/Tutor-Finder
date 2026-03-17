import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import AIChatbot from './components/AIChatbot';
import Home from './pages/Home';
import FindTutor from './pages/FindTutor';
import TutorProfile from './pages/TutorProfile';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherProfileSetup from './pages/TeacherProfileSetup';
import ScheduleSession from './pages/ScheduleSession';
import Assignments from './pages/Assignments';
import AddStudent from './pages/AddStudent';
import Messages from './pages/Messages';
import BookRecommendations from './pages/BookRecommendations';
import { useAuth } from './context/AuthContext';
import PracticeQuiz from './pages/PracticeQuiz';
import GamifiedLearning from './pages/GamifiedLearning';
import CareerConsultation from './pages/CareerConsultation';
import RewardsStore from './pages/RewardsStore';

function AIChatbotWrapper() {
  const { user } = useAuth();
  if (!user) return null;
  return <AIChatbot />;
}

function App() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className={`app-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Sidebar isCollapsed={isSidebarCollapsed} toggleCollapse={() => setSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/teacher-profile-setup" element={<TeacherProfileSetup />} />
              <Route path="/find-tutor" element={<FindTutor />} />
              <Route path="/tutor/:id" element={<TutorProfile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/schedule-session" element={<ScheduleSession />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/add-student" element={<AddStudent />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/book-recommendations" element={<BookRecommendations />} />
              <Route path="/practice-quiz" element={<PracticeQuiz />} />
              <Route path="/gamified-learning" element={<GamifiedLearning />} />
              <Route path="/career-consultation" element={<CareerConsultation />} />
              <Route path="/rewards-store" element={<RewardsStore />} />
            </Routes>
          </main>
        </div>
        <AIChatbotWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
