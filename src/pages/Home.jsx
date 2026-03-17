import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineChartBar } from 'react-icons/hi';
import { FaRobot, FaChalkboardTeacher, FaUserGraduate, FaGlobeAsia } from 'react-icons/fa';
import { features, stats } from '../data/mockData';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';
import './Home.css';

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);

  return (
    <span ref={ref} className="counter-value">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

/* ---- Typewriter: reveals text character-by-character ---- */
function TypewriterText({ text, speed = 40, delay = 0, className = '', tag: Tag = 'span' }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const ref = useRef(null);

  // Only start when the element scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(timer);
          setIsComplete(true);
        }
      }, speed);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [started, text, speed, delay]);

  return (
    <Tag ref={ref} className={`${className} typewriter-text`}>
      {displayed}
      {!isComplete && <span className="typewriter-cursor">|</span>}
    </Tag>
  );
}

/* ---- 3D Flip Card for Features ---- */
function FlipCard({ feature, index }) {
  return (
    <div className="flip-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="flip-card-inner">
        {/* Front Face */}
        <div className="flip-card-front glass-card">
          <div className="feature-icon" style={{ background: feature.gradient }}>
            {feature.icon}
          </div>
          <h3 className="feature-title">{feature.title}</h3>
          <p className="flip-hint">Hover to learn more →</p>
        </div>
        {/* Back Face */}
        <div className="flip-card-back glass-card" style={{ borderColor: `${feature.gradient ? '' : 'var(--border-accent)'}` }}>
          <div className="flip-back-icon" style={{ background: feature.gradient }}>
            {feature.icon}
          </div>
          <h3 className="feature-title">{feature.title}</h3>
          <p className="feature-desc">{feature.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="home-page page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="bg-orb" style={{ width: 500, height: 500, top: '-10%', left: '-5%', background: 'rgba(253, 115, 51, 0.15)' }} />
          <div className="bg-orb" style={{ width: 400, height: 400, bottom: '-10%', right: '-5%', background: 'rgba(253, 115, 51, 0.08)', animationDelay: '-7s' }} />
          <div className="bg-orb" style={{ width: 300, height: 300, top: '40%', left: '50%', background: 'rgba(230, 90, 27, 0.08)', animationDelay: '-13s' }} />
          <div className="hero-grid-lines" />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-text-col">
              <div className="hero-badge animate-fade-in-up">
                <HiOutlineSparkles /> Smart Education Platform For Learning
              </div>
              <h1 className="hero-title animate-fade-in-up animate-delay-1">
                <TypewriterText text="AI-Powered" speed={60} delay={400} /><br />
                <span className="hero-gradient">
                  <TypewriterText text="Hybrid Tutor" speed={60} delay={1200} />
                </span><br />
                <TypewriterText text="Finder Platform" speed={60} delay={2200} />
              </h1>
              <p className="hero-desc animate-fade-in-up animate-delay-2">
                <TypewriterText
                  text="Connect with verified tutors matched by AI to your learning style, goals, and location. Online or offline — the future of education is hybrid."
                  speed={20}
                  delay={3200}
                />
              </p>
              <div className="hero-actions animate-fade-in-up animate-delay-3">
                <Link to="/find-tutor" className="btn btn-primary btn-lg">
                  <HiOutlineSearch /> Find Your Tutor
                </Link>
                <Link to="/about" className="btn btn-secondary btn-lg">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="hero-image-col animate-fade-in-up animate-delay-3">
              <div className="hero-3d-wrapper">
                <img src="/hero_illustration.png" alt="DeepThink Hero" className="hero-illustration continuous-3d-float" />
              </div>
            </div>
          </div>

          <div className="hero-stats animate-fade-in-up animate-delay-4">
            <div className="hero-stat">
              <span className="hero-stat-icon"><FaChalkboardTeacher /></span>
              <div>
                <AnimatedCounter end={stats.totalTutors} suffix="+" />
                <span className="hero-stat-label">Verified Tutors</span>
              </div>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon"><FaUserGraduate /></span>
              <div>
                <AnimatedCounter end={stats.totalStudents} suffix="+" />
                <span className="hero-stat-label">Students</span>
              </div>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon"><FaGlobeAsia /></span>
              <div>
                <AnimatedCounter end={stats.citiesCovered} suffix="+" />
                <span className="hero-stat-label">Cities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us?</h2>
            <p className="section-subtitle">
              Powered by cutting-edge AI and blockchain technology to deliver the best learning experience.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, i) => (
              <FlipCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Get started in 3 simple steps.</p>
          </div>
          <div className="steps-grid">
            {[
              { step: '01', title: 'Tell Us Your Needs', desc: 'Share your subject, learning style, schedule, and preferred mode — online, offline, or hybrid.', icon: '📝' },
              { step: '02', title: 'AI Matches You', desc: 'Our AI engine analyzes your profile and finds the best-fit tutors with compatibility scores.', icon: '🤖' },
              { step: '03', title: 'Start Learning', desc: 'Book sessions, track progress with analytics, and switch between online & offline seamlessly.', icon: '🚀' }
            ].map((item, i) => (
              <div key={i} className="step-card">
                <div className="step-number">{item.step}</div>
                <div className="step-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {i < 2 && <div className="step-connector" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card glass-card">
            <div className="cta-bg">
              <div className="bg-orb" style={{ width: 300, height: 300, top: '-20%', right: '-5%', background: 'rgba(253, 115, 51, 0.15)' }} />
              <div className="bg-orb" style={{ width: 200, height: 200, bottom: '-15%', left: '10%', background: 'rgba(230, 90, 27, 0.1)', animationDelay: '-5s' }} />
            </div>
            <h2 className="cta-title">Ready to Transform Your Learning?</h2>
            <p className="cta-desc">Join thousands of students who found their perfect tutor through AI-powered matching.</p>
            <Link to="/find-tutor" className="btn btn-primary btn-lg">
              <FaRobot /> Get Matched Now
            </Link>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <Feedback />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}
