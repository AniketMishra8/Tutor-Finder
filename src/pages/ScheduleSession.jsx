import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUpload } from 'react-icons/hi';
import { tutors } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './ScheduleSession.css';

const API_URL = 'http://localhost:5000';

export default function ScheduleSession() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dbTutors, setDbTutors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch real tutors from DB and merge with mock
  useEffect(() => {
    fetch(`${API_URL}/api/teachers`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setDbTutors(data);
      })
      .catch(() => {});
  }, []);

  // Combine DB tutors + mock tutors (DB first)
  const allTutors = [
    ...dbTutors.map(t => ({
      id: t.id || t._id,
      name: t.name,
      subjects: t.subjects || [],
      rating: t.rating || 0,
      isFromDB: true
    })),
    ...tutors.map(t => ({
      id: t.id,
      name: t.name,
      subjects: t.subjects || [],
      rating: t.rating,
      isFromDB: false
    }))
  ];

  const tutorOptions = allTutors.map(t => ({
    id: t.id,
    label: `${t.name}${t.rating ? ` (★ ${t.rating})` : ''}`,
    name: t.name,
    subjects: t.subjects
  }));

  const [formData, setFormData] = useState({
    tutorId: '',
    subject: '',
    date: '',
    time: '',
    mode: 'Online (Video Call)',
    notes: ''
  });

  // Auto-select first tutor when options load
  useEffect(() => {
    if (tutorOptions.length > 0 && !formData.tutorId) {
      const first = tutorOptions[0];
      setFormData(prev => ({
        ...prev,
        tutorId: first.id.toString(),
        subject: first.subjects[0] || ''
      }));
    }
  }, [dbTutors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTutorChange = (e) => {
    const newTutorId = e.target.value;
    const selectedTutor = tutorOptions.find(t => t.id.toString() === newTutorId);
    setFormData(prev => ({
      ...prev,
      tutorId: newTutorId,
      subject: selectedTutor ? selectedTutor.subjects[0] : ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const selectedTutor = tutorOptions.find(t => t.id.toString() === formData.tutorId.toString());

    try {
      const token = localStorage.getItem('tutor_finder_token');
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tutorId: formData.tutorId,
          tutorName: selectedTutor?.name || 'Tutor',
          studentName: user?.name || 'Student',
          subject: formData.subject,
          date: formData.date,
          time: formData.time,
          mode: formData.mode,
          notes: formData.notes
        })
      });

      if (res.ok) {
        navigate('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to book session. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to server. Please ensure the backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="schedule-page page-enter">
      <div className="container schedule-container">
        
        <div className="schedule-header">
          <h1 className="section-title" style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Schedule Session</h1>
          <p className="schedule-subtitle">Book a new learning session with your preferred tutor.</p>
        </div>

        <div className="schedule-card">
          {error && (
            <div style={{ padding: '12px 16px', marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', fontSize: '0.85rem' }}>
              ❌ {error}
            </div>
          )}
          <form className="schedule-form" onSubmit={handleSubmit}>
            
            {/* Tutor Selection */}
            <div className="form-group">
              <label className="form-label">Select Tutor</label>
              <div className="select-wrapper">
                <select 
                  className="input-field schedule-select"
                  name="tutorId"
                  value={formData.tutorId}
                  onChange={handleTutorChange}
                  required
                >
                  <option value="" disabled>Select a tutor...</option>
                  {tutorOptions.map(tutor => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Subject Selection */}
            <div className="form-group">
              <label className="form-label">Subject</label>
              <div className="select-wrapper">
                <select 
                  className="input-field schedule-select"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select a subject...</option>
                  {tutorOptions.find(t => t.id.toString() === formData.tutorId.toString())?.subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Time Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input 
                  type="date" 
                  className="input-field" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time</label>
                <input 
                  type="time" 
                  className="input-field" 
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* Teaching Mode */}
            <div className="form-group">
              <label className="form-label">Teaching Mode</label>
              <div className="select-wrapper">
                <select 
                  className="input-field schedule-select"
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Online (Video Call)">Online (Video Call)</option>
                  <option value="Offline (In-person)">Offline (In-person)</option>
                </select>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="form-group">
              <label className="form-label">Additional Notes (Optional)</label>
              <textarea 
                className="input-field schedule-textarea" 
                placeholder="Any specific topics you'd like to cover?"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
              ></textarea>
            </div>

            {/* Attachment (Optional) */}
            <div className="form-group">
              <label className="form-label">Study Materials (Optional)</label>
              <div 
                className="schedule-upload"
                onClick={() => document.getElementById('study-material-upload').click()}
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="file"
                  id="study-material-upload"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleInputChange({
                        target: { name: 'file', value: e.target.files[0] }
                      });
                    }
                  }}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <HiOutlineUpload className="upload-icon" />
                <span>
                  {formData.file ? formData.file.name : 'Upload files or click here'}
                </span>
                {!formData.file && <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>PDF, JPG, PNG up to 10MB</span>}
              </div>
            </div>

            <div className="schedule-submit-container">
              <button type="submit" className="btn btn-primary schedule-submit-btn" disabled={submitting}>
                {submitting ? '⏳ Booking...' : 'Confirm Booking'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
