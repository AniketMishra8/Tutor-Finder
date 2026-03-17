import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUpload } from 'react-icons/hi';
import { tutors } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './ScheduleSession.css';

export default function ScheduleSession() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Sort tutors by rating for the dropdown, or just use as-is
  const tutorOptions = tutors.map(t => ({
    id: t.id,
    label: `${t.name} (★ ${t.rating})`,
    subjects: t.subjects
  }));

  const [formData, setFormData] = useState({
    tutorId: tutorOptions[2]?.id || '', // Defaulting to Ananya Iyer as per screenshot
    subject: 'Creative Writing',
    date: '',
    time: '',
    mode: 'Online (Video Call)',
    notes: ''
  });

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
      // Auto-update subject to the newly selected tutor's first subject
      subject: selectedTutor ? selectedTutor.subjects[0] : ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Session Scheduled Successfully!');
    navigate('/dashboard');
  };

  return (
    <div className="schedule-page page-enter">
      <div className="container schedule-container">
        
        <div className="schedule-header">
          <h1 className="section-title" style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>Schedule Session</h1>
          <p className="schedule-subtitle">Book a new learning session with your preferred tutor.</p>
        </div>

        <div className="schedule-card">
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
                  {/* Find currently selected tutor and map their subjects */}
                  {tutorOptions.find(t => t.id.toString() === formData.tutorId.toString())?.subjects.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                  {/* Fallback if no tutor selected */}
                  {!formData.tutorId && <option value="Creative Writing">Creative Writing</option>}
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
              <button type="submit" className="btn btn-primary schedule-submit-btn">
                Confirm Booking
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
