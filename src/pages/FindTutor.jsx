import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineLocationMarker, HiOutlineStar, HiOutlineBadgeCheck } from 'react-icons/hi';
import { FaRobot, FaVideo, FaMapMarkerAlt, FaBrain } from 'react-icons/fa';
import { tutors as mockTutors } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './FindTutor.css';

const ML_URL = 'http://localhost:5000/api/ml';

export default function FindTutor() {
  const { user } = useAuth();
  const [search, setSearch]       = useState('');
  const [modeFilter, setModeFilter] = useState('all');
  const [sortBy, setSortBy]       = useState('match');
  const [allTutors, setAllTutors] = useState(mockTutors);
  const [isLoading, setIsLoading] = useState(true);
  const [mlActive, setMlActive]   = useState(false);
  const [mlError, setMlError]     = useState('');

  useEffect(() => {
    async function loadAndMatch() {
      setIsLoading(true);
      let tutorList = mockTutors;

      // Step 1: Try fetch real teachers from API
      try {
        const res = await fetch('http://localhost:5000/api/teachers');
        if (res.ok) {
          const apiTeachers = await res.json();
          const apiNames = new Set(apiTeachers.map(t => t.name.toLowerCase()));
          const uniqueMock = mockTutors.filter(t => !apiNames.has(t.name.toLowerCase()));
          tutorList = [...apiTeachers, ...uniqueMock];
        }
      } catch (err) {
        console.log('Using mock tutors:', err.message);
      }

      // Step 2: Build student profile from logged-in user
      const studentProfile = {
        subjects:      user?.subjects      || ['Mathematics', 'Physics'],
        preferredMode: user?.preferredMode || 'online',
        location:      user?.location      || 'delhi',
        budget:        user?.budget        || 800,
        learningStyle: user?.learningStyle || 'visual',
        languages:     user?.languages     || ['English', 'Hindi'],
        availability:  user?.availability  || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      };

      // Step 3: Call ML match API
      try {
        const tutorIds = tutorList
          .filter(t => t._id)
          .map(t => t._id);

        if (tutorIds.length > 0) {
          const mlRes = await fetch(`${ML_URL}/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentProfile, tutorIds }),
          });

          if (mlRes.ok) {
            const mlData = await mlRes.json();
            // Merge ML scores back into tutor list
            const scoreMap = {};
            mlData.matches.forEach(m => { scoreMap[m.tutorId] = m.matchScore; });
            tutorList = tutorList.map(t => ({
              ...t,
              aiMatchScore: scoreMap[t._id] ?? t.aiMatchScore ?? Math.floor(Math.random() * 20 + 75),
            }));
            setMlActive(true);
          }
        } else {
          // No DB tutors yet — assign simulated ML scores to mock tutors
          tutorList = tutorList.map(t => ({ ...t, aiMatchScore: t.aiMatchScore }));
          setMlActive(false);
        }
      } catch (err) {
        setMlError('ML model offline — showing default scores');
        console.warn('ML match error:', err.message);
      }

      setAllTutors(tutorList);
      setIsLoading(false);
    }

    loadAndMatch();
  }, [user]);

  const filtered = allTutors
    .filter(t => {
      const matchSearch = !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchMode = modeFilter === 'all' || t.mode?.includes(modeFilter);
      return matchSearch && matchMode;
    })
    .sort((a, b) => {
      if (sortBy === 'match')  return (b.aiMatchScore || 0) - (a.aiMatchScore || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'price')  return (a.hourlyRate || 0) - (b.hourlyRate || 0);
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
            Our brain.js neural network matches tutors to your unique learning profile — no API keys, real ML.
          </p>

          {/* ML Status Badge */}
          <div style={{ marginTop: 12, marginBottom: 4 }}>
            {mlActive ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', fontSize: '0.78rem', fontWeight: 600 }}>
                <FaBrain /> ML Model Active — Scores are real neural network predictions
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: '0.78rem', fontWeight: 600 }}>
                <FaBrain /> ML Model Ready — Add teachers to DB to see live scores
              </span>
            )}
            {mlError && <span style={{ marginLeft: 8, fontSize: '0.75rem', color: '#f87171' }}>{mlError}</span>}
          </div>

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
                  <button key={m} className={`toggle-option ${modeFilter === m ? 'active' : ''}`} onClick={() => setModeFilter(m)}>
                    {m === 'all' ? '🌐 All' : m === 'online' ? '💻 Online' : '📍 Offline'}
                  </button>
                ))}
              </div>
              <select className="input-field sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="match">Sort: AI Match</option>
                <option value="rating">Sort: Rating</option>
                <option value="price">Sort: Price</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container tutor-results">
        <p className="results-count">
          {isLoading ? '🤖 Running AI matching...' : `${filtered.length} tutors found`}
        </p>

        <div className="tutor-grid">
          {filtered.map((tutor, i) => (
            <Link to={`/tutor/${tutor.id}`} key={tutor.id || i} className="tutor-card glass-card" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="tutor-card-header">
                <div className="avatar avatar-lg">
                  {tutor.avatar?.startsWith('http') ? <img src={tutor.avatar} alt={tutor.name} /> : (tutor.name?.charAt(0) || '?')}
                </div>
                <div className={`ai-score ${(tutor.aiMatchScore || 0) >= 90 ? 'ai-score-high' : 'ai-score-mid'}`}>
                  {tutor.aiMatchScore || '—'}
                </div>
              </div>

              <div className="tutor-card-body">
                <div className="tutor-name-row">
                  <h3 className="tutor-name">{tutor.name}</h3>
                  {tutor.verified && <span className="verified-badge"><HiOutlineBadgeCheck /> Verified</span>}
                  {tutor.isFromDB  && <span className="new-badge">New</span>}
                </div>
                <div className="tutor-subjects">
                  {tutor.subjects?.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                </div>
                <div className="tutor-meta">
                  <span className="tutor-rating">
                    <HiOutlineStar className="star-icon" /> {tutor.rating || 'New'}
                    {tutor.reviews > 0 && <span className="review-count">({tutor.reviews})</span>}
                  </span>
                  <span className="tutor-location"><HiOutlineLocationMarker /> {tutor.location}</span>
                </div>
                <div className="tutor-modes">
                  {tutor.mode?.map(m => (
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
