import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineAcademicCap, HiOutlineLightBulb, HiOutlineChatAlt2,
  HiOutlinePaperAirplane, HiOutlineTag, HiOutlineClock,
  HiOutlineCheckCircle, HiOutlineReply, HiOutlineSparkles
} from 'react-icons/hi';
import { FaCompass, FaRocket, FaGraduationCap, FaLaptopCode, FaPalette, FaStethoscope, FaChartLine, FaFlask } from 'react-icons/fa';
import './CareerConsultation.css';

// ===== CAREER INTERESTS =====
const careerFields = [
  { id: 'tech', label: 'Technology & CS', icon: <FaLaptopCode />, color: '#8b5cf6' },
  { id: 'medical', label: 'Medical & Health', icon: <FaStethoscope />, color: '#10b981' },
  { id: 'business', label: 'Business & Finance', icon: <FaChartLine />, color: '#f59e0b' },
  { id: 'science', label: 'Research & Science', icon: <FaFlask />, color: '#06b6d4' },
  { id: 'creative', label: 'Creative & Design', icon: <FaPalette />, color: '#ec4899' },
  { id: 'engineering', label: 'Engineering', icon: <FaRocket />, color: '#FD7333' },
];

const STORAGE_KEY = 'career_consultations';

function getConsultations() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

function saveConsultations(consultations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consultations));
}

export default function CareerConsultation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState(getConsultations());
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'history'
  const [selectedFields, setSelectedFields] = useState([]);
  const [question, setQuestion] = useState('');
  const [studentGoals, setStudentGoals] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Teacher states
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    saveConsultations(consultations);
  }, [consultations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConsultation, consultations]);

  if (!user) return null;

  const toggleField = (id) => {
    setSelectedFields(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // ====== STUDENT: Submit consultation ======
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || selectedFields.length === 0) return;

    const newConsultation = {
      id: Date.now(),
      studentName: user.name,
      studentEmail: user.email,
      fields: selectedFields,
      goals: studentGoals,
      question: question,
      status: 'pending', // pending | answered
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: Date.now(),
          sender: 'student',
          senderName: user.name,
          text: question,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString()
        }
      ]
    };

    setConsultations(prev => [newConsultation, ...prev]);
    setQuestion('');
    setStudentGoals('');
    setSelectedFields([]);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  // ====== TEACHER: Reply to consultation ======
  const handleReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConsultation) return;

    const newMessage = {
      id: Date.now(),
      sender: 'teacher',
      senderName: user.name,
      text: replyText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };

    setConsultations(prev => prev.map(c => {
      if (c.id === selectedConsultation.id) {
        const updated = {
          ...c,
          status: 'answered',
          messages: [...c.messages, newMessage]
        };
        setSelectedConsultation(updated);
        return updated;
      }
      return c;
    }));

    setReplyText('');
  };

  const myConsultations = consultations.filter(c =>
    user.role === 'student' ? c.studentEmail === user.email : true
  );

  const pendingCount = consultations.filter(c => c.status === 'pending').length;

  // ====== TEACHER VIEW ======
  if (user.role === 'teacher') {
    return (
      <div className="career-page page-enter">
        <div className="career-hero">
          <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(6, 182, 212, 0.08)' }} />
          <div className="container">
            <div className="career-welcome">
              <div className="career-icon-wrap"><FaCompass /></div>
              <div>
                <h1 className="career-heading">Career Consultations 🧭</h1>
                <p className="career-subtext">Guide students on their career path — {pendingCount} pending request{pendingCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container career-content">
          <div className="consultation-layout">
            {/* Consultation List */}
            <div className="consultation-list-panel glass-card">
              <div className="panel-header">
                <h3><HiOutlineChatAlt2 /> Student Requests</h3>
                <span className="pending-badge">{pendingCount} pending</span>
              </div>
              {consultations.length === 0 ? (
                <div className="empty-state">
                  <HiOutlineChatAlt2 style={{ fontSize: '3rem', opacity: 0.3 }} />
                  <p>No consultation requests yet</p>
                </div>
              ) : (
                <div className="consultation-items">
                  {consultations.map(c => (
                    <div
                      key={c.id}
                      className={`consultation-item ${selectedConsultation?.id === c.id ? 'active' : ''} ${c.status}`}
                      onClick={() => setSelectedConsultation(c)}
                    >
                      <div className="consultation-item-header">
                        <span className="consultation-student-name">{c.studentName}</span>
                        <span className={`status-dot status-${c.status}`}>{c.status === 'pending' ? '● New' : '✓ Replied'}</span>
                      </div>
                      <div className="consultation-item-fields">
                        {c.fields.map(f => {
                          const field = careerFields.find(cf => cf.id === f);
                          return field ? <span key={f} className="mini-field-tag" style={{ color: field.color }}>{field.icon}</span> : null;
                        })}
                      </div>
                      <p className="consultation-item-preview">{c.question.substring(0, 80)}...</p>
                      <span className="consultation-item-time">{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat / Detail Panel */}
            <div className="consultation-chat-panel glass-card">
              {selectedConsultation ? (
                <>
                  <div className="chat-panel-header">
                    <div>
                      <h3>{selectedConsultation.studentName}</h3>
                      <div className="chat-panel-fields">
                        {selectedConsultation.fields.map(f => {
                          const field = careerFields.find(cf => cf.id === f);
                          return field ? (
                            <span key={f} className="field-chip" style={{ background: `${field.color}15`, color: field.color, borderColor: `${field.color}30` }}>
                              {field.icon} {field.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                    {selectedConsultation.goals && (
                      <div className="student-goals-box">
                        <HiOutlineLightBulb /> <strong>Goals:</strong> {selectedConsultation.goals}
                      </div>
                    )}
                  </div>
                  <div className="chat-messages">
                    {selectedConsultation.messages.map(msg => (
                      <div key={msg.id} className={`chat-msg ${msg.sender}`}>
                        <div className="chat-msg-bubble">
                          <span className="chat-msg-sender">{msg.senderName}</span>
                          <p className="chat-msg-text">{msg.text}</p>
                          <span className="chat-msg-time">{msg.time} · {msg.date}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <form className="chat-reply-form" onSubmit={handleReply}>
                    <input
                      type="text"
                      className="chat-reply-input"
                      placeholder="Type your career advice..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                    />
                    <button type="submit" className="chat-reply-btn" disabled={!replyText.trim()}>
                      <HiOutlinePaperAirplane />
                    </button>
                  </form>
                </>
              ) : (
                <div className="empty-state">
                  <FaCompass style={{ fontSize: '4rem', opacity: 0.2 }} />
                  <h3>Select a consultation</h3>
                  <p>Click on a student request to view details and respond</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====== STUDENT VIEW ======
  return (
    <div className="career-page page-enter">
      <div className="career-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(6, 182, 212, 0.08)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-15%', left: '10%', background: 'rgba(139, 92, 246, 0.06)', animationDelay: '-8s' }} />
        <div className="container">
          <div className="career-welcome">
            <div className="career-icon-wrap"><FaCompass /></div>
            <div>
              <h1 className="career-heading">Career Path Guidance 🧭</h1>
              <p className="career-subtext">Get personalized career advice from experienced teachers based on your interests</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container career-content">
        {/* Tabs */}
        <div className="career-tabs">
          <button className={`career-tab ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
            <HiOutlineSparkles /> Ask for Guidance
          </button>
          <button className={`career-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <HiOutlineChatAlt2 /> My Consultations
            {myConsultations.length > 0 && <span className="tab-count">{myConsultations.length}</span>}
          </button>
        </div>

        {activeTab === 'new' ? (
          <div className="career-form-section">
            {submitSuccess && (
              <div className="submit-success-banner">
                <HiOutlineCheckCircle /> Your consultation request has been submitted! A teacher will respond soon.
              </div>
            )}

            <form className="career-form glass-card" onSubmit={handleSubmit}>
              <h2 className="form-section-title"><HiOutlineLightBulb /> What interests you?</h2>
              <p className="form-section-desc">Select the career fields you're curious about</p>
              <div className="career-fields-grid">
                {careerFields.map(field => (
                  <button
                    key={field.id}
                    type="button"
                    className={`career-field-chip ${selectedFields.includes(field.id) ? 'selected' : ''}`}
                    style={{
                      '--field-color': field.color,
                      borderColor: selectedFields.includes(field.id) ? field.color : undefined,
                      background: selectedFields.includes(field.id) ? `${field.color}15` : undefined
                    }}
                    onClick={() => toggleField(field.id)}
                  >
                    <span className="field-chip-icon" style={{ color: field.color }}>{field.icon}</span>
                    {field.label}
                  </button>
                ))}
              </div>

              <h2 className="form-section-title" style={{ marginTop: '2rem' }}><FaGraduationCap /> Your goals (optional)</h2>
              <textarea
                className="career-textarea"
                placeholder="e.g., I want to become a software engineer at a top tech company..."
                value={studentGoals}
                onChange={e => setStudentGoals(e.target.value)}
                rows={3}
              />

              <h2 className="form-section-title" style={{ marginTop: '2rem' }}><HiOutlineChatAlt2 /> Ask your question</h2>
              <textarea
                className="career-textarea"
                placeholder="e.g., What subjects should I focus on to pursue a career in AI research? What skills are in demand?"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                rows={4}
                required
              />

              <button
                type="submit"
                className="career-submit-btn"
                disabled={!question.trim() || selectedFields.length === 0}
              >
                <HiOutlinePaperAirplane /> Submit Consultation Request
              </button>
            </form>
          </div>
        ) : (
          <div className="career-history-section">
            {myConsultations.length === 0 ? (
              <div className="empty-history glass-card">
                <FaCompass style={{ fontSize: '3rem', opacity: 0.3 }} />
                <h3>No consultations yet</h3>
                <p>Submit your first career question to get started!</p>
                <button className="btn-start-consultation" onClick={() => setActiveTab('new')}>
                  Ask for Guidance
                </button>
              </div>
            ) : (
              <div className="history-cards">
                {myConsultations.map(c => (
                  <div key={c.id} className="history-card glass-card">
                    <div className="history-card-header">
                      <div className="history-card-fields">
                        {c.fields.map(f => {
                          const field = careerFields.find(cf => cf.id === f);
                          return field ? (
                            <span key={f} className="field-chip" style={{ background: `${field.color}15`, color: field.color, borderColor: `${field.color}30` }}>
                              {field.icon} {field.label}
                            </span>
                          ) : null;
                        })}
                      </div>
                      <span className={`history-status status-${c.status}`}>
                        {c.status === 'pending' ? '⏳ Awaiting Reply' : '✅ Answered'}
                      </span>
                    </div>

                    {c.goals && (
                      <div className="history-goals">
                        <HiOutlineLightBulb /> {c.goals}
                      </div>
                    )}

                    <div className="history-messages">
                      {c.messages.map(msg => (
                        <div key={msg.id} className={`history-msg ${msg.sender}`}>
                          <div className="history-msg-header">
                            <span className="history-msg-sender">
                              {msg.sender === 'student' ? '🎓 You' : '👨‍🏫 ' + msg.senderName}
                            </span>
                            <span className="history-msg-time">{msg.time} · {msg.date}</span>
                          </div>
                          <p className="history-msg-text">{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="history-card-footer">
                      <HiOutlineClock /> {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
