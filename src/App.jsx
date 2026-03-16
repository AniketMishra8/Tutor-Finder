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
import { useAuth } from './context/AuthContext';

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
              <Route path="/find-tutor" element={<FindTutor />} />
              <Route path="/tutor/:id" element={<TutorProfile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
        </div>
        <AIChatbotWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
