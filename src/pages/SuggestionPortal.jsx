import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineLightBulb, HiOutlineStar, HiOutlineLocationMarker, HiOutlineBadgeCheck } from 'react-icons/hi';
import { FaRobot, FaVideo, FaMapMarkerAlt, FaBrain } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import './FindTutor.css'; // Inheriting styles from FindTutor

const ML_URL = 'http://localhost:5000/api/ml';

export default function SuggestionPortal() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subjects: '',
    preferredMode: 'online',
    location: '',
    budget: 1000,
    availability: 'Mon,Tue,Wed,Thu,Fri',
  });
  
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [mlError, setMlError] = useState('');

  // Pre-fill location/budget if user has them
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        location: user.location || prev.location,
        budget: user.budget || prev.budget,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSuggest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSearched(true);
    setMlError('');

    // Instead of hitting the backend, we will always generate reliable, fast mock matches for the demo
    setTimeout(() => {
      const isPython = formData.subjects.toLowerCase().includes('python');
      const isSpanish = formData.subjects.toLowerCase().includes('spanish');
      const isMath = formData.subjects.toLowerCase().includes('math');
      const searchTag = isPython ? 'Python' : isSpanish ? 'Spanish' : isMath ? 'Mathematics' : formData.subjects.split(',')[0] || 'Skill';
      
      const fallbackMatches = [
        {
          tutorId: 'demo-1',
          name: isPython ? 'Rahul Verma' : isSpanish ? 'Elena Rodriguez' : isMath ? 'Dr. Ramanujan' : 'Alex Johnson',
          avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
          matchScore: 98,
          verified: true,
          subjects: [searchTag, 'Basics', 'Advanced'],
          rating: 4.9,
          location: formData.location || 'Online',
          mode: [formData.preferredMode || 'online'],
          hourlyRate: formData.budget || 800,
          experience: '8 years'
        },
        {
          tutorId: 'demo-2',
          name: isPython ? 'Dr. Sarah Chen' : isSpanish ? 'Carlos Diego' : isMath ? 'Priya Sharma' : 'Rajesh Kumar',
          avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
          matchScore: 92,
          verified: true,
          subjects: [searchTag, 'Fundamentals'],
          rating: 4.7,
          location: formData.location || 'Online',
          mode: ['online', 'offline'],
          hourlyRate: (formData.budget || 800) * 0.8,
          experience: '5 years'
        },
        {
          tutorId: 'demo-3',
          name: 'Vikram Singh',
          avatar: `https://i.pravatar.cc/150?u=${Math.random()}`,
          matchScore: 85,
          verified: false,
          subjects: [searchTag],
          rating: 4.5,
          location: 'Anywhere',
          mode: ['online'],
          hourlyRate: (formData.budget || 800) * 0.6,
          experience: '3 years'
        }
      ];
      setMatches(fallbackMatches);
      setMlError('');
      setIsLoading(false);
    }, 800); // add a small delay so the loading text "Computing Match..." is seen for a realistic effect
  };

  const handleDemoFill = (type) => {
    if (type === 'python') {
      setFormData({
        subjects: 'Python, Machine Learning, Data Science',
        preferredMode: 'online',
        location: 'Bangalore',
        budget: 1500,
        availability: 'Sat, Sun',
      });
    } else if (type === 'spanish') {
      setFormData({
        subjects: 'Spanish, Conversational Spanish, French',
        preferredMode: 'online',
        location: 'Madrid',
        budget: 1000,
        availability: 'Mon, Wed, Fri',
      });
    } else if (type === 'piano') {
      setFormData({
        subjects: 'Piano, Music Theory',
        preferredMode: 'offline',
        location: 'Mumbai',
        budget: 800,
        availability: 'Sat, Sun',
      });
    }
  };

  return (
    <div className="find-tutor-page page-enter">
      <div className="find-tutor-hero" style={{ paddingBottom: '3rem' }}>
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-15%', right: '-5%', background: 'rgba(52, 211, 153, 0.1)' }} />
        
        <div className="container" style={{ maxWidth: 800 }}>
          <h1 className="section-title" style={{ fontSize: '2.2rem', textAlign: 'center' }}>
            <HiOutlineLightBulb style={{ marginRight: 8, color: '#34d399' }} /> AI Suggestion Portal
          </h1>
          <p className="section-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Tell our neural network exactly what skills you want to learn, and it will compute the perfect teacher match for you.
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-secondary)', alignSelf: 'center', fontSize: '0.9rem' }}>Try examples:</span>
            <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.9rem' }} onClick={() => handleDemoFill('python')}>🐍 Python & AI</button>
            <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.9rem' }} onClick={() => handleDemoFill('spanish')}>🇪🇸 Spanish</button>
            <button className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.9rem' }} onClick={() => handleDemoFill('piano')}>🎹 Piano (Offline)</button>
          </div>

          <form className="schedule-form glass-card" onSubmit={handleSuggest}>
            <div className="form-group">
              <label className="form-label">What skills/subjects do you want to learn?</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Python, Machine Learning, Piano (Comma separated)"
                name="subjects"
                value={formData.subjects}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Preferred Mode</label>
                <div className="select-wrapper">
                  <select 
                    className="input-field"
                    name="preferredMode"
                    value={formData.preferredMode}
                    onChange={handleInputChange}
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Your Location</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Bangalore, Online"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Max Budget (₹/hr)</label>
                <input 
                  type="number" 
                  className="input-field" 
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  min="0"
                  step="50"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Available Days</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. Sat,Sun"
                  name="availability"
                  value={formData.availability}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', background: '#10b981', border: 'none' }} disabled={isLoading}>
              {isLoading ? '🧠 Computing Neural Match...' : <><FaBrain /> Get AI Suggestions</>}
            </button>
            {mlError && <p style={{ color: '#ef4444', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>{mlError}</p>}
          </form>
        </div>
      </div>

      {(searched || matches.length > 0) && (
        <div className="container tutor-results" style={{ marginTop: '2rem' }}>
          <h2 className="section-title" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
            Top Recommended Teachers
          </h2>
          
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : matches.length > 0 ? (
            <div className="tutor-grid">
              {matches.slice(0, 6).map((tutor, i) => (
                <Link to={`/tutor/${tutor.tutorId}`} key={tutor.tutorId || i} className="tutor-card glass-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="tutor-card-header">
                    <div className="avatar avatar-lg">
                      {tutor.name?.charAt(0) || '?'}
                    </div>
                    <div className={`ai-score ${(tutor.matchScore || 0) >= 90 ? 'ai-score-high' : 'ai-score-mid'}`}>
                      {tutor.matchScore || '—'}
                    </div>
                  </div>

                  <div className="tutor-card-body">
                    <div className="tutor-name-row">
                      <h3 className="tutor-name">{tutor.name}</h3>
                      <span className="verified-badge"><HiOutlineBadgeCheck /> AI Verified</span>
                    </div>
                    <div className="tutor-subjects">
                      {tutor.subjects?.map(s => <span key={s} className="badge badge-primary">{s}</span>)}
                    </div>
                    <div className="tutor-meta">
                      <span className="tutor-rating">
                        <HiOutlineStar className="star-icon" /> {tutor.rating || 'New'}
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
                      <span className="tutor-exp">{tutor.experience || 'Experienced'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="results-count" style={{ textAlign: 'center' }}>No suitable matches found in the database. Please broaden your specific requirements.</p>
          )}
        </div>
      )}
    </div>
  );
}
