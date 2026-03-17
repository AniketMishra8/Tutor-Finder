import React from 'react';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function Messages() {
  const navigate = useNavigate();

  return (
    <div className="page-enter" style={{ padding: '2rem' }}>
      <div className="container">
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>&larr; Back</button>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <HiOutlineChatAlt2 style={{ fontSize: '4rem', color: 'var(--primary-500)', marginBottom: '1rem' }} />
          <h1>Direct Messages</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
            Chat directly with tutors and students instantly to clarify doubts and coordinate schedules.
            (This page is currently a placeholder for the chat interface).
          </p>
        </div>
      </div>
    </div>
  );
}
