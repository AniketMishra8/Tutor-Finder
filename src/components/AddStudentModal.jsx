import { useState, useEffect } from 'react';
import { HiOutlineUserAdd, HiOutlineMail, HiOutlineBookOpen, HiX, HiCheckCircle } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './AddStudentModal.css';

export default function AddStudentModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
      setIsSuccess(false);
      setErrorMessage('');
      setPreviewUrl(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !subject) return;

    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('http://localhost:5000/api/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          subject,
          message,
          teacherName: user?.name
        })
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend server is not running. Please start your backend server (node server.js in the server folder).');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send invitation');
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }
      
      // Auto close after success (longer if there's a preview URL)
      setTimeout(() => {
        onClose();
      }, data.previewUrl ? 8000 : 3000);
      
    } catch (error) {
      console.error('Error sending invite:', error);
      setIsSubmitting(false);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setErrorMessage('Cannot connect to server. Please make sure the backend is running on port 5000.');
      } else {
        setErrorMessage(error.message || 'Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container page-enter">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <HiX />
        </button>
        
        {isSuccess ? (
          <div className="modal-success-content">
            <div className="success-icon-wrapper fade-in">
              <HiCheckCircle className="success-icon" />
            </div>
            <h2 className="modal-title">Invitation Sent!</h2>
            <p className="modal-subtitle">
              We've sent an invitation email to <br/>
              <strong>{email}</strong>
            </p>
            {previewUrl && (
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" 
                 style={{ color: '#FD7333', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                📧 View Email Preview (Test Mode)
              </a>
            )}
          </div>
        ) : (
          <>
            <div className="modal-header">
              <div className="modal-icon-wrapper">
                <HiOutlineUserAdd className="modal-header-icon" />
              </div>
              <div>
                <h2 className="modal-title">Add New Student</h2>
                <p className="modal-subtitle">Invite a student to join your sessions</p>
              </div>
            </div>

            {errorMessage && (
              <div className="modal-error" style={{ padding: '0 2rem', color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>
                {errorMessage}
              </div>
            )}

            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="student-email" className="form-label">Student Email <span>*</span></label>
                <div className="input-group">
                  <div className="input-icon">
                    <HiOutlineMail />
                  </div>
                  <input
                    type="email"
                    id="student-email"
                    className="form-input"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Subject <span>*</span></label>
                <div className="input-group">
                  <div className="input-icon">
                    <HiOutlineBookOpen />
                  </div>
                  <select
                    id="subject"
                    className="form-input form-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select a subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="English">English</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Personal Message (Optional)</label>
                <textarea
                  id="message"
                  className="form-input form-textarea"
                  placeholder="Hello! I'm inviting you to join my class..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={isSubmitting || !email || !subject}>
                  {isSubmitting ? 'Sending...' : 'Send Invitation'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}