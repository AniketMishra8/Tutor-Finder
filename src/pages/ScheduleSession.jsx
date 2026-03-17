import React from 'react';
import { HiOutlineCalendar } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ScheduleSession() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="page-enter" style={{ padding: '2rem' }}>
      <div className="container">
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>&larr; Back</button>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <HiOutlineCalendar style={{ fontSize: '4rem', color: 'var(--primary-500)', marginBottom: '1rem' }} />
          <h1>Schedule a Session</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
            Book a new online or offline session with your tutor. Choose the subject, time, and mode of instruction. 
            (This page is currently a placeholder for the booking flow).
          </p>
          <div style={{ marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => alert('Booking feature coming soon!')}>Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  );
}
