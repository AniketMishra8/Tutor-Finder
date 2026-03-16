import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaRobot } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <FaRobot className="logo-icon" />
              <span>Tutor Finder</span>
            </Link>
            <p className="footer-desc">
              AI-powered hybrid learning platform connecting you with the perfect tutors to accelerate your educational journey.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" className="social-link" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-links-group">
            <h3>Platform</h3>
            <ul>
              <li><Link to="/find-tutor">Find a Tutor</Link></li>
              <li><Link to="/about">How it Works</Link></li>
              <li><Link to="/login">Student Login</Link></li>
              <li><Link to="/register">Become a Tutor</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h3>Resources</h3>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Study Guides</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Trust & Safety</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Tutor Finder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
