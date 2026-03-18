import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineHome, HiOutlineSearch, HiOutlineViewGrid, HiOutlineInformationCircle, HiOutlineLogout, HiOutlineLogin, HiOutlineMoon, HiOutlineSun, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineCalendar, HiOutlineBookOpen, HiOutlineUsers, HiOutlineLightningBolt, HiOutlineLightBulb } from 'react-icons/hi';
import { FaVideo, FaGamepad, FaCompass, FaGem } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';
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

  // ====== BUILD GROUPED NAVIGATION ======
  const navGroups = [];

  // Main group — always shown
  const mainLinks = [{ to: '/', label: 'Home', icon: <HiOutlineHome /> }];
  if (user) {
    mainLinks.push({ to: '/dashboard', label: 'Dashboard', icon: <HiOutlineViewGrid /> });
    if (user.role === 'student' || user.role === 'parent') {
      mainLinks.push({ to: '/find-tutor', label: 'Find Tutor', icon: <HiOutlineSearch /> });
    }
  } else {
    mainLinks.push({ to: '/find-tutor', label: 'Find Tutor', icon: <HiOutlineSearch /> });
  }
  navGroups.push({ label: null, links: mainLinks });

  // Learning group — students only
  if (user && user.role === 'student') {
    navGroups.push({
      label: 'Learning',
      links: [
        { to: '/practice-quiz', label: 'Practice Skills', icon: <HiOutlineAcademicCap /> },
        { to: '/gamified-learning', label: 'Game Zone', icon: <FaGamepad /> },
        { to: '/book-recommendations', label: 'Book Picks', icon: <HiOutlineBookOpen /> },
      ]
    });
  }

  // Teacher — resources
  if (user && user.role === 'teacher') {
    navGroups.push({
      label: 'Resources',
      links: [
        { to: '/book-recommendations', label: 'Book Picks', icon: <HiOutlineBookOpen /> },
      ]
    });
  }

  // Explore group — career & rewards for student, career for teacher
  if (user && (user.role === 'student' || user.role === 'teacher')) {
    const exploreLinks = [
      { to: '/suggestion-portal', label: 'AI Match Portal', icon: <HiOutlineLightBulb /> },
      { to: '/career-consultation', label: 'Career Guidance', icon: <FaCompass /> },
    ];
    if (user.role === 'student') {
      exploreLinks.push({ to: '/rewards-store', label: 'Rewards', icon: <FaGem /> });
    }
    navGroups.push({ label: 'Explore', links: exploreLinks });
  }

  // About — always at the end
  navGroups.push({ label: null, links: [{ to: '/about', label: 'About', icon: <HiOutlineInformationCircle /> }] });

  // ====== QUICK ACTIONS (compact pills) ======
  let quickActions = [];
  if (user) {
    if (user.role === 'student') {
      quickActions = [
        { label: 'Join Session', icon: <FaVideo />, onClick: () => navigate('/schedule-session') },
      ];
    } else if (user.role === 'teacher') {
      quickActions = [
        { label: 'Schedule', icon: <HiOutlineCalendar />, onClick: () => navigate('/schedule-session') },
        { label: 'Students', icon: <HiOutlineUsers />, onClick: () => navigate('/add-student') },
      ];
    } else if (user.role === 'parent') {
      quickActions = [
        { label: 'Schedule', icon: <HiOutlineCalendar />, onClick: () => navigate('/schedule-session') },
        { label: 'Message', icon: <HiOutlineUsers />, onClick: () => navigate('/messages') },
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

        {/* Grouped Navigation */}
        <div className="sidebar-nav-scroll">
          {navGroups.map((group, gi) => (
            <div key={gi} className={`sidebar-group ${group.label ? 'labeled' : ''}`}>
              {group.label && (
                <span className="sidebar-group-title">{group.label}</span>
              )}
              <div className="sidebar-links">
                {group.links.map(item => (
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
            </div>
          ))}

          {/* Quick Actions — compact pill row */}
          {quickActions.length > 0 && (
            <div className="sidebar-group labeled">
              <span className="sidebar-group-title">
                <HiOutlineLightningBolt className="title-icon" /> Quick
              </span>
              <div className="quick-actions-row">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    className="quick-pill"
                    onClick={() => {
                      action.onClick();
                      setMobileOpen(false);
                    }}
                    title={action.label}
                  >
                    <span className="quick-pill-icon">{action.icon}</span>
                    <span className="quick-pill-label">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

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
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      />
    </>
  );
}
