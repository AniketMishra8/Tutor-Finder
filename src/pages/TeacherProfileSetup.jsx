import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlinePlus, HiOutlineX, HiOutlineCheckCircle, HiOutlineAcademicCap } from 'react-icons/hi';
import { FaChalkboardTeacher } from 'react-icons/fa';
import './TeacherProfileSetup.css';

const SUBJECT_SUGGESTIONS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'AI/ML',
  'English', 'Hindi', 'History', 'Geography', 'Economics', 'Business Studies',
  'Music', 'Piano', 'Guitar', 'Art', 'Digital Art', 'Graphic Design',
  'Spanish', 'French', 'German', 'Japanese', 'SAT Prep', 'GRE Prep',
  'IELTS', 'TOEFL', 'Creative Writing', 'Public Speaking', 'Yoga', 'Dance'
];

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Spanish', 'French', 'German'];
const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TeacherProfileSetup() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subjects: [],
    bio: '',
    hourlyRate: '',
    experience: '',
    location: '',
    qualifications: [],
    languages: [],
    mode: [],
    availability: []
  });

  const [currentSubject, setCurrentSubject] = useState('');
  const [currentQualification, setCurrentQualification] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!user) navigate('/login');
    else if (user.role !== 'teacher') navigate('/dashboard');
  }, [user, navigate]);

  // Load existing profile if editing
  useEffect(() => {
    if (user?.isProfileComplete) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const token = localStorage.getItem('tutor_finder_token');
      const res = await fetch('/api/teachers/me/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          subjects: data.subjects || [],
          bio: data.bio || '',
          hourlyRate: data.hourlyRate || '',
          experience: data.experience || '',
          location: data.location || '',
          qualifications: data.qualifications || [],
          languages: data.languages || [],
          mode: data.mode || [],
          availability: data.availability || []
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const addSubject = (subject) => {
    const s = subject.trim();
    if (s && !formData.subjects.includes(s)) {
      setFormData({ ...formData, subjects: [...formData.subjects, s] });
    }
    setCurrentSubject('');
  };

  const removeSubject = (subject) => {
    setFormData({ ...formData, subjects: formData.subjects.filter(s => s !== subject) });
  };

  const addQualification = () => {
    const q = currentQualification.trim();
    if (q && !formData.qualifications.includes(q)) {
      setFormData({ ...formData, qualifications: [...formData.qualifications, q] });
    }
    setCurrentQualification('');
  };

  const removeQualification = (qual) => {
    setFormData({ ...formData, qualifications: formData.qualifications.filter(q => q !== qual) });
  };

  const toggleItem = (field, item) => {
    const arr = formData[field];
    if (arr.includes(item)) {
      setFormData({ ...formData, [field]: arr.filter(i => i !== item) });
    } else {
      setFormData({ ...formData, [field]: [...arr, item] });
    }
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      if (formData.subjects.length === 0) return 'Please add at least one subject.';
      if (!formData.bio || formData.bio.trim().length < 20) return 'Please write a bio of at least 20 characters.';
    }
    if (stepNum === 2) {
      if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) return 'Please set a valid hourly rate.';
      if (!formData.location.trim()) return 'Please enter your location.';
    }
    return '';
  };

  const nextStep = () => {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('tutor_finder_token');
      const response = await fetch('/api/teachers/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          hourlyRate: Number(formData.hourlyRate)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save profile.');
      }

      // Update user context
      updateUser({ ...user, isProfileComplete: true });
      navigate('/dashboard');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSuggestions = SUBJECT_SUGGESTIONS.filter(
    s => s.toLowerCase().includes(currentSubject.toLowerCase()) && !formData.subjects.includes(s)
  );

  if (!user) return null;

  return (
    <div className="teacher-setup-page page-enter">
      <div className="teacher-setup-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', left: '-5%', background: 'rgba(253, 115, 51, 0.1)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-10%', right: '-5%', background: 'rgba(230, 90, 27, 0.08)', animationDelay: '-7s' }} />

        <div className="container teacher-setup-container">
          <div className="setup-header">
            <FaChalkboardTeacher className="setup-header-icon" />
            <h1 className="setup-title">{user.isProfileComplete ? 'Edit Your Profile' : 'Complete Your Teacher Profile'}</h1>
            <p className="setup-subtitle">Set up your teaching profile so students can discover and connect with you.</p>
          </div>

          {/* Progress Steps */}
          <div className="setup-progress">
            {[1, 2, 3].map(s => (
              <div key={s} className={`progress-step ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                <div className="step-number">{step > s ? <HiOutlineCheckCircle /> : s}</div>
                <span className="step-label">{s === 1 ? 'Skills & Bio' : s === 2 ? 'Details' : 'Preferences'}</span>
              </div>
            ))}
          </div>

          {error && <div className="setup-error">{error}</div>}

          <form onSubmit={handleSubmit} className="setup-form glass-card">
            {/* Step 1: Subjects & Bio */}
            {step === 1 && (
              <div className="setup-step">
                <h2 className="step-title"><HiOutlineAcademicCap /> Subjects & Bio</h2>

                <div className="form-group">
                  <label>Subjects You Teach</label>
                  <div className="tags-container">
                    {formData.subjects.map(s => (
                      <span key={s} className="tag">
                        {s}
                        <button type="button" onClick={() => removeSubject(s)} className="tag-remove"><HiOutlineX /></button>
                      </span>
                    ))}
                  </div>
                  <div className="subject-input-wrap">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Type a subject or select below..."
                      value={currentSubject}
                      onChange={e => setCurrentSubject(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubject(currentSubject); } }}
                    />
                    <button type="button" className="btn-add-tag" onClick={() => addSubject(currentSubject)} disabled={!currentSubject.trim()}>
                      <HiOutlinePlus />
                    </button>
                  </div>
                  {currentSubject && filteredSuggestions.length > 0 && (
                    <div className="subject-suggestions">
                      {filteredSuggestions.slice(0, 6).map(s => (
                        <button key={s} type="button" className="suggestion-chip" onClick={() => addSubject(s)}>{s}</button>
                      ))}
                    </div>
                  )}
                  {!currentSubject && formData.subjects.length === 0 && (
                    <div className="subject-suggestions">
                      {SUBJECT_SUGGESTIONS.slice(0, 8).map(s => (
                        <button key={s} type="button" className="suggestion-chip" onClick={() => addSubject(s)}>{s}</button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Professional Bio</label>
                  <textarea
                    id="bio"
                    className="form-input form-textarea"
                    placeholder="Tell students about your teaching experience, approach, and what makes you unique..."
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                  />
                  <span className="char-count">{formData.bio.length} / 500</span>
                </div>

                <div className="step-actions">
                  <div></div>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>Next →</button>
                </div>
              </div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <div className="setup-step">
                <h2 className="step-title">📋 Details & Qualifications</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="hourlyRate">Hourly Rate (₹)</label>
                    <input type="number" id="hourlyRate" className="form-input" placeholder="e.g. 800" value={formData.hourlyRate} onChange={e => setFormData({ ...formData, hourlyRate: e.target.value })} min="0" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience">Experience</label>
                    <input type="text" id="experience" className="form-input" placeholder="e.g. 5 years" value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input type="text" id="location" className="form-input" placeholder="e.g. Delhi, India" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Qualifications</label>
                  <div className="tags-container">
                    {formData.qualifications.map(q => (
                      <span key={q} className="tag tag-secondary">
                        {q}
                        <button type="button" onClick={() => removeQualification(q)} className="tag-remove"><HiOutlineX /></button>
                      </span>
                    ))}
                  </div>
                  <div className="subject-input-wrap">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. PhD Mathematics - IIT Delhi"
                      value={currentQualification}
                      onChange={e => setCurrentQualification(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addQualification(); } }}
                    />
                    <button type="button" className="btn-add-tag" onClick={addQualification} disabled={!currentQualification.trim()}>
                      <HiOutlinePlus />
                    </button>
                  </div>
                </div>

                <div className="step-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button type="button" className="btn btn-primary" onClick={nextStep}>Next →</button>
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <div className="setup-step">
                <h2 className="step-title">⚙️ Preferences</h2>

                <div className="form-group">
                  <label>Teaching Mode</label>
                  <div className="toggle-chips">
                    <button type="button" className={`chip ${formData.mode.includes('online') ? 'chip-active' : ''}`} onClick={() => toggleItem('mode', 'online')}>💻 Online</button>
                    <button type="button" className={`chip ${formData.mode.includes('offline') ? 'chip-active' : ''}`} onClick={() => toggleItem('mode', 'offline')}>📍 Offline</button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Languages</label>
                  <div className="toggle-chips">
                    {LANGUAGE_OPTIONS.map(lang => (
                      <button key={lang} type="button" className={`chip ${formData.languages.includes(lang) ? 'chip-active' : ''}`} onClick={() => toggleItem('languages', lang)}>{lang}</button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Availability</label>
                  <div className="toggle-chips day-chips">
                    {DAY_OPTIONS.map(day => (
                      <button key={day} type="button" className={`chip chip-day ${formData.availability.includes(day) ? 'chip-active' : ''}`} onClick={() => toggleItem('availability', day)}>{day}</button>
                    ))}
                  </div>
                </div>

                <div className="step-actions">
                  <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                    {isLoading ? 'Saving Profile...' : '✨ Save & Go Live'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
