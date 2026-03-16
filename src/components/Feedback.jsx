import { useState } from 'react';
import { FaStar, FaPaperPlane } from 'react-icons/fa';
import './Feedback.css';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    alert('Thank you for your feedback!');
    setRating(0);
    e.target.reset();
  };

  return (
    <section className="section feedback-section">
      <div className="container">
        <div className="feedback-wrapper">
          <div className="feedback-content">
            <h2 className="section-title">We Value Your Feedback</h2>
            <p className="section-subtitle">
              Help us improve your learning experience by sharing your thoughts and suggestions with us.
            </p>
            
            <div className="feedback-features">
              <div className="feedback-feature">
                <div className="feature-dot"></div>
                <span>Improve matching algorithm</span>
              </div>
              <div className="feedback-feature">
                <div className="feature-dot"></div>
                <span>Enhance platform features</span>
              </div>
              <div className="feedback-feature">
                <div className="feature-dot"></div>
                <span>Better tutor quality</span>
              </div>
            </div>
          </div>

          <div className="feedback-form-container glass-card">
            <form className="feedback-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" placeholder="John Doe" required />
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" required />
              </div>

              <div className="form-group rating-group">
                <label>Rate your experience</label>
                <div className="star-rating">
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <button
                        type="button"
                        key={index}
                        className={index <= (hover || rating) ? "star on" : "star off"}
                        onClick={() => setRating(index)}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating)}
                      >
                        <FaStar />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea rows="4" placeholder="Tell us what you think..." required></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                <FaPaperPlane /> Send Feedback
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
