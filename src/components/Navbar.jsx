import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { HiOutlineAcademicCap, HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine which links to show based on Role
  let links = [{ to: '/', label: 'Home' }];

  if (user) {
    if (user.role === 'student') {
      links.push({ to: '/find-tutor', label: 'Find Tutor' });
      links.push({ to: '/dashboard', label: 'Dashboard' });
    } else if (user.role === 'teacher') {
      links.push({ to: '/dashboard', label: 'My Dashboard' });
      links.push({ to: '/students', label: 'My Students' }); // Placeholder link
    } else if (user.role === 'parent') {
      links.push({ to: '/dashboard', label: 'Child Progress' });
      links.push({ to: '/find-tutor', label: 'Find Tutor' });
    }
  } else {
    links.push({ to: '/find-tutor', label: 'Find Tutor' });
  }

  links.push({ to: '/about', label: 'About' });

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">
            <HiOutlineAcademicCap />
          </div>
          <div className="navbar-brand-text">
            <span className="brand-name">DeepThink</span>
            <span className="brand-suffix">Labs</span>
          </div>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'navbar-links-open' : ''}`}>
          {links.map(link => (
            <Link
              key={link.to + link.label} // Handle identical 'to' with different labels
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? 'nav-link-active' : ''}`}
            >
              {link.label}
              {location.pathname === link.to && <span className="nav-link-indicator" />}
            </Link>
          ))}
          
          {user ? (
            <div className="nav-user-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
              <span className="nav-greeting" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Hi, {user.name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm nav-cta">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm nav-cta">
              Login
            </Link>
          )}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </div>
    </nav>
  );
}
