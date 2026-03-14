import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const autofill = (role) => {
    if (role === 'student') { setEmail('alex@student.com'); setPassword('password'); }
    if (role === 'teacher') { setEmail('priya@teacher.com'); setPassword('password'); }
    if (role === 'parent') { setEmail('johnson@parent.com'); setPassword('password'); }
  };

  return (
    <div className="login-page page-enter">
      <div className="login-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', left: '-5%', background: 'rgba(139,92,246,0.1)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-10%', right: '-5%', background: 'rgba(6,182,212,0.08)', animationDelay: '-7s' }} />
        
        <div className="container login-container">
          <div className="login-card glass-card">
            <h1 className="login-title">Welcome Back</h1>
            <p className="login-subtitle">Enter your credentials to access the platform.</p>
            
            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="name@example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <div className="login-divider"><span>OR TRY A DEMO</span></div>

            <div className="demo-accounts">
              <p>Quick login with a demo account:</p>
              <div className="demo-buttons">
                <button type="button" onClick={() => autofill('student')} className="btn btn-outline btn-sm">🎓 Student</button>
                <button type="button" onClick={() => autofill('teacher')} className="btn btn-outline btn-sm">📚 Teacher</button>
                <button type="button" onClick={() => autofill('parent')} className="btn btn-outline btn-sm">👨‍👩‍👧 Parent</button>
              </div>
            </div>
            
            <div className="login-footer">
              <p>New to DeepThink Labs? <Link to="/register">Create an account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
