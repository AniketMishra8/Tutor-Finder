import React from 'react';
import { HiOutlineBookOpen } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

export default function Assignments() {
  const navigate = useNavigate();

  return (
    <div className="page-enter" style={{ padding: '2rem' }}>
      <div className="container">
        <button className="btn btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: '2rem' }}>&larr; Back</button>
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <HiOutlineBookOpen style={{ fontSize: '4rem', color: 'var(--primary-500)', marginBottom: '1rem' }} />
          <h1>Assignments Manager</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto' }}>
            View, grade, and organize assignments for your students or submit your homework. 
            (This page is currently a placeholder for the assignment tracking module).
          </p>
        </div>
      </div>
    </div>
  );
}
