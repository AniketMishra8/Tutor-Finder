import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineHome, HiOutlineSearch, HiOutlineViewGrid, HiOutlineInformationCircle, HiOutlineLogout, HiOutlineLogin, HiOutlineMoon, HiOutlineSun, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineCalendar, HiOutlineBookOpen, HiOutlineUsers } from 'react-icons/hi';
import { FaVideo, FaGamepad } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';
import AddSutdentModal from './AddStudentModal'
import AddStudent from '../pages/AddStudent';
import AddStudentModal from './AddStudentModal';

export default function Sidebar({ isCollapsed, toggleCollapse }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  // Determine which links to show based on Role
  let navigation = [{ to: '/', label: 'Home', icon: <HiOutlineHome /> }];

  if (user) {
    if (user.role === 'student') {
      navigation.push({ to: '/find-tutor', label: 'Find Tutor', icon: <HiOutlineSearch /> });
      navigation.push({ to: '/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> });
      navigation.push({ to: '/book-recommendations', label: 'Book Picks', icon: <HiOutlineBookOpen /> });
    } else if (user.role === 'teacher') {
      navigation.push({ to: '/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> });
      navigation.push({ to: '/book-recommendations', label: 'Book Picks', icon: <HiOutlineBookOpen /> });
    } else if (user.role === 'parent') {
      navigation.push({ to: '/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> });
      navigation.push({ to: '/find-tutor', label: 'Find Tutor', icon: <HiOutlineSearch /> });
    }
  } else {
    navigation.push({ to: '/find-tutor', label: 'Find Tutor', icon: <HiOutlineSearch /> });
  }

  navigation.push({ to: '/about', label: 'About', icon: <HiOutlineInformationCircle /> });

  let quickActions = [];
  if (user) {
    if (user.role === 'student') {
      quickActions = [
        { label: 'Join Session', icon: <FaVideo />, onClick: () => navigate('/schedule-session') },
        { label: 'Find a Tutor', icon: <HiOutlineSearch />, onClick: () => navigate('/find-tutor') },
        { label: 'Practice Skills', icon: <HiOutlineAcademicCap />, onClick: () => navigate('/practice-quiz') },
        { label: 'Game Zone', icon: <FaGamepad />, onClick: () => navigate('/gamified-learning') },
      ];
    } else if (user.role === 'teacher') {
      quickActions = [
        { label: 'Schedule Session', icon: <HiOutlineCalendar />, onClick: () => navigate('/schedule-session') },
        { label: 'Manage Assignments', icon: <HiOutlineBookOpen />, onClick: () => navigate('/assignments') },
        { label: 'Add Student', icon: <HiOutlineUsers />, onClick: () => navigate('/add-student') },
      ];
    } else if (user.role === 'parent') {
      quickActions = [
        { label: 'Schedule Session', icon: <HiOutlineCalendar />, onClick: () => navigate('/schedule-session') },
        { label: 'View Report Card', icon: <HiOutlineBookOpen />, onClick: () => navigate('/assignments') },
        { label: 'Message Tutor', icon: <HiOutlineUsers />, onClick: () => navigate('/messages') },
      ];
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-sidebar-toggle" 
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle Navigation"
      >
        <HiOutlineAcademicCap />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <nav className={`sidebar ${mobileOpen ? 'sidebar-open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" onClick={() => setMobileOpen(false)}>
            <div className="sidebar-logo">
              <HiOutlineAcademicCap />
            </div>
            <div className="sidebar-brand-text">
              <span className="brand-name">DeepThink</span>
            </div>
          </Link>
          {/* Desktop Collapse Toggle */}
          <button className="collapse-btn" onClick={toggleCollapse} aria-label="Toggle Sidebar">
            {isCollapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
          </button>
        </div>

        <div className="sidebar-links">
          {navigation.map(item => (
            <Link
              key={item.to + item.label}
              to={item.to}
              className={`sidebar-link ${location.pathname === item.to ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <div className="sidebar-link-icon">{item.icon}</div>
              <span className="sidebar-link-label">{item.label}</span>
            </Link>
          ))}
        </div>

        {quickActions.length > 0 && (
          <div className="sidebar-section">
            <span className="sidebar-section-title">Quick Actions</span>
            <div className="sidebar-links">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  className="sidebar-link quick-action-btn"
                  onClick={() => {
                    action.onClick();
                    setMobileOpen(false);
                  }}
                >
                  <div className="sidebar-link-icon">{action.icon}</div>
                  <span className="sidebar-link-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="sidebar-footer">
          {user ? (
            <div className="sidebar-user">
              <div className="sidebar-user-info">
                <div className="avatar avatar-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                  <span className="user-role">{user.role}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="sidebar-action-btn" title="Logout">
                <HiOutlineLogout />
              </button>
            </div>
          ) : (
            <Link to="/login" className="sidebar-login-btn" onClick={() => setMobileOpen(false)}>
              <HiOutlineLogin className="login-icon" />
              <span>Login / Register</span>
            </Link>
          )}

          <div className="theme-toggle-container">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              <div className={`theme-toggle-icon ${theme === 'dark' ? 'active' : ''}`}>
                <HiOutlineMoon />
              </div>
              <div className={`theme-toggle-icon ${theme === 'light' ? 'active' : ''}`}>
                <HiOutlineSun />
              </div>
            </button>
          </div>
        </div>
      </nav>

      <AddStudentModal 
        isOpen = {isAddStudentModalOpen}
        onClose = {() => setIsAddStudentModalOpen(false)}
      />
    </>
  );
}
