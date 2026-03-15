import { Link } from 'react-router-dom';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <div className="navbar-logo">
                <HiOutlineAcademicCap />
              </div>
              <div>
                <span className="brand-name">DeepThink</span>
                <span className="brand-suffix"> Labs</span>
              </div>
            </div>
            <p className="footer-desc">
              AI-Powered Hybrid Tutor Finder Platform. Connecting students with the best tutors through intelligent matching.
            </p>
            <div className="footer-socials">
              <a href="https://github.com/AniketMishra8" className="social-icon" aria-label="GitHub"><FaGithub /></a>
              <a href="www.linkedin.com/in/aniket-mishra---" className="social-icon" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://x.com/AniketM44094489" className="social-icon" aria-label="Twitter"><FaTwitter /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/find-tutor">Find a Tutor</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/about">About Us</Link>
            <a href="#">Become a Tutor</a>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">API</a>
            <a href="#">Blog</a>
            <a href="#">Support</a>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 DeepThink Labs. Built for <span className="uhack-badge">Learning</span></p>
          <p className="footer-tagline">Smart Education • AI Matching • Blockchain Verified</p>
        </div>
      </div>
    </footer>
  );
}
