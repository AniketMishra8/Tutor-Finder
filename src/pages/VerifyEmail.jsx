import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineMail, HiOutlineRefresh, HiOutlineCheckCircle } from 'react-icons/hi';
import './Login.css';

export default function VerifyEmail() {
  const { verifyEmail, resendOtp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last char
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) {
      const newOtp = pasteData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const user = await verifyEmail(email, otpString);
      // Redirect based on role
      if (user.role === 'teacher' && !user.isProfileComplete) {
        navigate('/teacher-profile-setup');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      const msg = await resendOtp(email);
      setSuccess(msg);
      setError('');
      setResendCooldown(60);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page page-enter">
      <div className="login-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', left: '-5%', background: 'rgba(253, 115, 51, 0.1)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-10%', right: '-5%', background: 'rgba(230, 90, 27, 0.08)', animationDelay: '-7s' }} />

        <div className="container login-container">
          <div className="login-card glass-card">
            <div className="verify-icon-wrap">
              <HiOutlineMail style={{ fontSize: '3rem', color: 'var(--primary-500)' }} />
            </div>
            <h1 className="login-title">Verify Your Email</h1>
            <p className="login-subtitle">
              We've sent a 6-digit verification code to<br />
              <strong style={{ color: 'var(--primary-500)' }}>{email}</strong>
            </p>

            {error && <div className="login-error">{error}</div>}
            {success && <div className="login-success">{success}</div>}

            <form onSubmit={handleVerify} className="login-form">
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-input"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <HiOutlineRefresh className="spin-icon" /> Verifying...
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle style={{ marginRight: 6 }} /> Verify Email
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Didn't receive the code?{' '}
                <button
                  className="resend-btn"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </p>
              <p style={{ marginTop: 8 }}>
                <Link to="/register">← Back to Registration</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
