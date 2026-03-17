import React from 'react';
import { HiOutlineUsers } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function AddStudent() {
  const navigate = useNavigate();

  return (
    <div className="page-enter" style={{ padding: '2rem' }}>
      <div className="container">
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>&larr; Back</button>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <HiOutlineUsers style={{ fontSize: '4rem', color: 'var(--primary-500)', marginBottom: '1rem' }} />
          <h1>Add a Student</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
            Invite a new student to your class via email or manage your existing enrollment requests.
            (This page is currently a placeholder).
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '10px', justifyContent: 'center' }}>
             <input type="email" placeholder="student@example.com" className="form-input" style={{ width: '300px' }} />
             <button className="btn btn-primary" onClick={() => alert('Invite Sent!')}>Send Invite</button>
          </div>
        </div>
      </div>
    </div>
  );
}
