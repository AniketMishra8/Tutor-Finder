import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineStar, HiOutlineBadgeCheck } from 'react-icons/hi';
import { FaRobot, FaVideo, FaMapMarkerAlt } from 'react-icons/fa';
import { tutors } from '../data/mockData';
import './FindTutor.css';

export default function FindTutor() {
  const [search, setSearch] = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('match');

  const filtered = tutors
    .filter(t => {
      const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchMode = modeFilter === 'all' || t.mode.includes(modeFilter);
      return matchSearch && matchMode;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.aiMatchScore - a.aiMatchScore;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.hourlyRate - b.hourlyRate;
      return 0;
    });

  return (
    <div className="find-tutor-page page-enter">
      <div className="find-tutor-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-15%', right: '-5%', background: 'rgba(253, 115, 51, 0.1)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-10%', left: '-5%', background: 'rgba(230, 90, 27, 0.08)', animationDelay: '-7s' }} />

        <div className="container">
          <h1 className="section-title" style={{ fontSize: '2.2rem' }}>
            <FaRobot style={{ marginRight: 8 }} /> AI-Powered Tutor Search
          </h1>
          <p className="section-subtitle">
            Our intelligent matching algorithm finds the best tutor for your unique learning profile.
          </p>

          <div className="search-bar glass-card">
            <div className="search-input-wrap">
              <HiOutlineSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by subject, tutor name, or skill..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="search-filters">
              <div className="toggle-group">
                {['all', 'online', 'offline'].map(m => (
                  <button
                    key={m}
                    className={`toggle-option ${modeFilter === m ? 'active' : ''}`}
                    onClick={() => setModeFilter(m)}
                  >
                    {m === 'all' ? '🌐 All' : m === 'online' ? '💻 Online' : '📍 Offline'}
                  </button>
                ))}
              </div>

              <select
                className="input-field sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="match">Sort: AI Match</option>
                <option value="rating">Sort: Rating</option>
                <option value="price">Sort: Price</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container tutor-results">
        <p className="results-count">{filtered.length} tutors found</p>

        <div className="tutor-grid">
          {filtered.map((tutor, i) => (
            <Link
              to={`/tutor/${tutor.id}`}
              key={tutor.id}
              className="tutor-card glass-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="tutor-card-header">
                <div className="avatar avatar-lg">
                  {tutor.avatar.startsWith('http') ? <img src={tutor.avatar} alt={tutor.name} /> : tutor.avatar}
                </div>
                <div className={`ai-score ${tutor.aiMatchScore >= 90 ? 'ai-score-high' : 'ai-score-mid'}`}>
                  {tutor.aiMatchScore}
                </div>
              </div>

              <div className="tutor-card-body">
                <div className="tutor-name-row">
                  <h3 className="tutor-name">{tutor.name}</h3>
                  {tutor.verified && (
                    <span className="verified-badge">
                      <HiOutlineBadgeCheck /> Verified
                    </span>
                  )}
                </div>

                <div className="tutor-subjects">
                  {tutor.subjects.map(s => (
                    <span key={s} className="badge badge-primary">{s}</span>
                  ))}
                </div>

                <div className="tutor-meta">
                  <span className="tutor-rating">
                    <HiOutlineStar className="star-icon" /> {tutor.rating}
                    <span className="review-count">({tutor.reviews})</span>
                  </span>
                  <span className="tutor-location">
                    <HiOutlineLocationMarker /> {tutor.location}
                  </span>
                </div>

                <div className="tutor-modes">
                  {tutor.mode.map(m => (
                    <span key={m} className={`mode-tag mode-${m}`}>
                      {m === 'online' ? <FaVideo /> : <FaMapMarkerAlt />} {m}
                    </span>
                  ))}
                </div>

                <div className="tutor-card-footer">
                  <span className="tutor-rate">₹{tutor.hourlyRate}<small>/hr</small></span>
                  <span className="tutor-exp">{tutor.experience}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
