import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiOutlineStar, HiOutlineBadgeCheck, HiOutlineClock, HiOutlineGlobe, HiOutlineCalendar, HiOutlineChatAlt2 } from 'react-icons/hi';
import { FaVideo, FaMapMarkerAlt, FaChevronLeft } from 'react-icons/fa';
import { tutors } from '../data/mockData';
import './TutorProfile.css';

export default function TutorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tutor = tutors.find(t => t.id === parseInt(id)) || tutors[0];
  const [sessionMode, setSessionMode] = useState('online');
  const [selectedDay, setSelectedDay] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="tutor-profile-page page-enter">
      <div className="profile-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', left: '-5%', background: 'rgba(253, 115, 51, 0.12)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-15%', right: '10%', background: 'rgba(230, 90, 27, 0.08)', animationDelay: '-8s' }} />

        <div className="container">
          <Link to="/find-tutor" className="back-link">
            <FaChevronLeft /> Back to Search
          </Link>

          <div className="profile-header">
            <div className="profile-left">
              <div className="avatar avatar-xl">
                {tutor.avatar.startsWith('http') ? <img src={tutor.avatar} alt={tutor.name} /> : tutor.avatar}
              </div>
              <div className="profile-info">
                <div className="profile-name-row">
                  <h1 className="profile-name">{tutor.name}</h1>
                  {tutor.verified && (
                    <div className="blockchain-badge">
                      <HiOutlineBadgeCheck />
                      <span>AI Verified</span>
                    </div>
                  )}
                </div>
                <div className="profile-subjects">
                  {tutor.subjects.map(s => (
                    <span key={s} className="badge badge-primary">{s}</span>
                  ))}
                </div>
                <div className="profile-meta-row">
                  <span><HiOutlineStar className="star-icon" /> {tutor.rating} ({tutor.reviews} reviews)</span>
                  <span><HiOutlineClock /> {tutor.experience}</span>
                  <span><HiOutlineGlobe /> {tutor.location}</span>
                </div>
              </div>
            </div>

            <div className="profile-right">
              <div className={`ai-score ai-score-high`} style={{ width: 80, height: 80, fontSize: '1.5rem' }}>
                {tutor.aiMatchScore}
              </div>
              <span className="ai-score-label">AI Match</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container profile-content">
        <div className="profile-grid">
          {/* Left column */}
          <div className="profile-main">
            {/* Bio */}
            <div className="profile-section glass-card">
              <h2 className="profile-section-title">About</h2>
              <p className="profile-bio">{tutor.bio}</p>
            </div>

            {/* Qualifications */}
            <div className="profile-section glass-card">
              <h2 className="profile-section-title">Qualifications</h2>
              <ul className="qualifications-list">
                {tutor.qualifications.map((q, i) => (
                  <li key={i} className="qualification-item">
                    <HiOutlineBadgeCheck className="qual-icon" />
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="profile-section glass-card">
              <h2 className="profile-section-title">Statistics</h2>
              <div className="profile-stats-grid">
                <div className="profile-stat-item">
                  <span className="profile-stat-value">{tutor.totalStudents}</span>
                  <span className="profile-stat-label">Students Taught</span>
                </div>
                <div className="profile-stat-item">
                  <span className="profile-stat-value">{tutor.totalSessions}</span>
                  <span className="profile-stat-label">Total Sessions</span>
                </div>
                <div className="profile-stat-item">
                  <span className="profile-stat-value">{tutor.responseTime}</span>
                  <span className="profile-stat-label">Response Time</span>
                </div>
                <div className="profile-stat-item">
                  <span className="profile-stat-value">{tutor.languages.length}</span>
                  <span className="profile-stat-label">Languages</span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="profile-section glass-card">
              <h2 className="profile-section-title">
                <HiOutlineChatAlt2 /> Student Reviews
              </h2>
              <div className="reviews-list">
                {tutor.reviewsList.map((review, i) => (
                  <div key={i} className="review-item">
                    <div className="review-header">
                      <div className="review-avatar">{review.name.charAt(0)}</div>
                      <div>
                        <span className="review-name">{review.name}</span>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <div className="review-stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                    </div>
                    <p className="review-text">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Widget */}
          <div className="profile-sidebar">
            <div className="booking-widget glass-card">
              <h3 className="booking-title">Book a Session</h3>

              <div className="booking-price">
                <span className="price-value">₹{tutor.hourlyRate}</span>
                <span className="price-unit">/hour</span>
              </div>

              {/* Mode toggle */}
              <div className="booking-section">
                <label className="booking-label">Session Mode</label>
                <div className="toggle-group" style={{ width: '100%' }}>
                  <button
                    className={`toggle-option ${sessionMode === 'online' ? 'active' : ''}`}
                    onClick={() => setSessionMode('online')}
                    style={{ flex: 1, textAlign: 'center' }}
                  >
                    <FaVideo style={{ marginRight: 4 }} /> Online
                  </button>
                  <button
                    className={`toggle-option ${sessionMode === 'offline' ? 'active' : ''}`}
                    onClick={() => setSessionMode('offline')}
                    style={{ flex: 1, textAlign: 'center' }}
                    disabled={!tutor.mode.includes('offline')}
                  >
                    <FaMapMarkerAlt style={{ marginRight: 4 }} /> Offline
                  </button>
                </div>
              </div>

              {/* Availability */}
              <div className="booking-section">
                <label className="booking-label">Available Days</label>
                <div className="day-grid">
                  {days.map(day => {
                    const available = tutor.availability.includes(day);
                    return (
                      <button
                        key={day}
                        className={`day-btn ${available ? 'day-available' : 'day-unavailable'} ${selectedDay === day ? 'day-selected' : ''}`}
                        onClick={() => available && setSelectedDay(day)}
                        disabled={!available}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Languages */}
              <div className="booking-section">
                <label className="booking-label">Languages</label>
                <div className="lang-tags">
                  {tutor.languages.map(l => (
                    <span key={l} className="badge badge-cyan">{l}</span>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/schedule-session')}>
                <HiOutlineCalendar /> Schedule Session
              </button>

              <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={() => navigate('/messages')}>
                <HiOutlineChatAlt2 /> Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
