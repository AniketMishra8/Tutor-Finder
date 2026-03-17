import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentEmail: ''
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page page-enter">
      <div className="login-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', left: '-5%', background: 'rgba(253, 115, 51, 0.1)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-10%', right: '-5%', background: 'rgba(230, 90, 27, 0.08)', animationDelay: '-7s' }} />
        
        <div className="container login-container">
          <div className="login-card glass-card">
            <h1 className="login-title">Create Account</h1>
            <p className="login-subtitle">Join DeepThink Labs as a student, teacher, or parent.</p>
            
            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleRegister} className="login-form">
              
              <div className="form-group role-selector">
                <label>I am a...</label>
                <div className="role-buttons">
                  <button type="button" className={`btn ${formData.role === 'student' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFormData({...formData, role: 'student'})}>Student</button>
                  <button type="button" className={`btn ${formData.role === 'teacher' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFormData({...formData, role: 'teacher'})}>Teacher</button>
                  <button type="button" className={`btn ${formData.role === 'parent' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFormData({...formData, role: 'parent'})}>Parent</button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" className="form-input" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" className="form-input" value={formData.email} onChange={handleChange} required placeholder="name@example.com" />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" className="form-input" value={formData.password} onChange={handleChange} required placeholder="••••••••" minLength="6" />
              </div>

              {formData.role === 'parent' && (
                <div className="form-group parent-link-box">
                  <label htmlFor="studentEmail">Child's Student Email</label>
                  <p className="field-hint">Your child must have an existing student account.</p>
                  <input type="email" id="studentEmail" className="form-input" value={formData.studentEmail} onChange={handleChange} required placeholder="child@student.com" />
                </div>
              )}

              <button type="submit" className="btn btn-primary login-submit-btn" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="login-footer">
              <p>Already have an account? <Link to="/login">Log in here</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
