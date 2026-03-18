import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { HiOutlineAcademicCap, HiOutlineClock, HiOutlineFire, HiOutlineTrendingUp, HiOutlineStar, HiOutlineUsers, HiOutlineCalendar, HiOutlineBookOpen, HiOutlineSearch, HiOutlinePencilAlt, HiOutlineLightningBolt } from 'react-icons/hi';
import { FaVideo, FaMapMarkerAlt, FaTrophy, FaMedal, FaChalkboardTeacher, FaUserGraduate, FaBrain } from 'react-icons/fa';
import { dashboardData, tutors } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const ML_URL = 'http://localhost:5000/api/ml';

// ── Mock quiz history for demo (replace with real data from your DB later) ──
const mockQuizHistory = [
  { score: 80, topic: 'Algebra',    timePerQuestion: 18 },
  { score: 60, topic: 'Geometry',   timePerQuestion: 25 },
  { score: 90, topic: 'Calculus',   timePerQuestion: 15 },
  { score: 55, topic: 'Physics',    timePerQuestion: 30 },
  { score: 75, topic: 'Chemistry',  timePerQuestion: 20 },
  { score: 85, topic: 'Biology',    timePerQuestion: 17 },
  { score: 40, topic: 'History',    timePerQuestion: 35 },
  { score: 95, topic: 'CS',         timePerQuestion: 12 },
];

const teacherData = {
  totalStudents: 24,
  totalSessions: 186,
  totalHours: 312,
  avgRating: 4.8,
  students: [
    { name: 'Alex Johnson',  email: 'alex@student.com',   subject: 'Mathematics', progress: 92, lastSession: 'Mar 12, 2026', avatar: 'https://i.pravatar.cc/150?u=alex',  status: 'active' },
    { name: 'Rahul Kumar',   email: 'rahul@student.com',  subject: 'Mathematics', progress: 85, lastSession: 'Mar 10, 2026', avatar: 'https://i.pravatar.cc/150?u=rahul2', status: 'active' },
    { name: 'Sneha Mishra',  email: 'sneha@student.com',  subject: 'Physics',     progress: 71, lastSession: 'Mar 9, 2026',  avatar: 'https://i.pravatar.cc/150?u=sneha3', status: 'inactive' },
    { name: 'Kiran Shah',    email: 'kiran@student.com',  subject: 'Mathematics', progress: 88, lastSession: 'Mar 8, 2026',  avatar: 'https://i.pravatar.cc/150?u=kiran',  status: 'active' },
    { name: 'Pooja Rao',     email: 'pooja@student.com',  subject: 'Calculus',    progress: 95, lastSession: 'Mar 7, 2026',  avatar: 'https://i.pravatar.cc/150?u=pooja',  status: 'active' },
  ],
  upcomingSessions: [
    { student: 'Alex Johnson', subject: 'Calculus',     date: 'Mar 15, 2026', time: '4:00 PM', mode: 'online' },
    { student: 'Rahul Kumar',  subject: 'Algebra',      date: 'Mar 16, 2026', time: '5:30 PM', mode: 'offline' },
    { student: 'Kiran Shah',   subject: 'Trigonometry', date: 'Mar 17, 2026', time: '3:00 PM', mode: 'online' },
  ],
  weeklyHours: [
    { day: 'Mon', hours: 4 }, { day: 'Tue', hours: 6 }, { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 5 }, { day: 'Fri', hours: 7 }, { day: 'Sat', hours: 4 }, { day: 'Sun', hours: 2 },
  ],
  earnings: [
    { month: 'Oct', amount: 24000 }, { month: 'Nov', amount: 28000 }, { month: 'Dec', amount: 32000 },
    { month: 'Jan', amount: 30000 }, { month: 'Feb', amount: 35000 }, { month: 'Mar', amount: 38000 },
  ],
};

// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);

  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  if (user.role === 'teacher' && !user.isProfileComplete) {
    return <TeacherProfilePrompt user={user} getInitials={getInitials} />;
  }

  if (user.role === 'teacher') return <TeacherDashboard user={user} getInitials={getInitials} />;
  if (user.role === 'parent')  return <ParentDashboard  user={user} getInitials={getInitials} />;
  return <StudentDashboard user={user} getInitials={getInitials} />;
}

// ══════════════════════════════════════════════════════════════════════════════
function TeacherProfilePrompt({ user, getInitials }) {
  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-hero teacher-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(253, 115, 51, 0.1)' }} />
        <div className="container">
          <div className="dashboard-welcome">
            <div className="avatar avatar-lg teacher-avatar">{getInitials()}</div>
            <div>
              <h1 className="dashboard-greeting">Welcome, {user.name}! 📚</h1>
              <p className="dashboard-subtext">Let's set up your teaching profile to get started.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="container dashboard-content">
        <div className="profile-prompt-card glass-card">
          <div className="prompt-icon"><FaChalkboardTeacher /></div>
          <h2 className="prompt-title">Complete Your Teacher Profile</h2>
          <p className="prompt-text">Add your subjects, qualifications, and teaching preferences so students can discover and book sessions with you.</p>
          <Link to="/teacher-profile-setup" className="btn btn-primary btn-lg">
            <HiOutlinePencilAlt style={{ marginRight: 6 }} /> Set Up My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ML PERFORMANCE CARD COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function MLPerformanceCard({ user }) {
  const [perf, setPerf]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerf() {
      try {
        const res = await fetch(`${ML_URL}/performance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId:   user._id || user.id,
            quizHistory: mockQuizHistory,
          }),
        });
        if (res.ok) setPerf(await res.json());
      } catch (e) {
        console.warn('ML performance offline:', e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPerf();
  }, [user]);

  const levelColor = { weak: '#ef4444', average: '#f59e0b', strong: '#10b981' };
  const levelEmoji = { weak: '📚', average: '👍', strong: '🌟' };

  return (
    <div className="sidebar-card glass-card">
      <h3 className="sidebar-title"><FaBrain /> AI Performance Analysis</h3>
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>🤖 Analysing your quiz history...</p>
      ) : perf ? (
        <div>
          {/* Level badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '12px 16px', borderRadius: 12, background: `${levelColor[perf.level]}15`, border: `1px solid ${levelColor[perf.level]}30` }}>
            <span style={{ fontSize: '1.8rem' }}>{levelEmoji[perf.level]}</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: levelColor[perf.level], textTransform: 'capitalize' }}>{perf.level} Performer</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Based on {perf.stats.attempts} quizzes</div>
            </div>
          </div>

          {/* Confidence bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
            {[['strong', '#10b981'], ['average', '#f59e0b'], ['weak', '#ef4444']].map(([lvl, col]) => (
              <div key={lvl}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 3 }}>
                  <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{lvl}</span>
                  <span style={{ color: col, fontWeight: 700 }}>{perf.confidence[lvl]}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--bg-tertiary)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${perf.confidence[lvl]}%`, background: col, borderRadius: 3, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{perf.stats.avgScore}%</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Avg Score</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{perf.stats.attempts}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Quizzes</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{perf.stats.topicsDone}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Topics</div>
            </div>
          </div>

          {/* Advice */}
          <div style={{ padding: '10px 12px', background: 'rgba(253,115,51,0.07)', border: '1px solid rgba(253,115,51,0.2)', borderRadius: 10, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            💡 {perf.advice}
          </div>
        </div>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>ML model offline. Run: <code>node ml/trainModels.js</code></p>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ML RECOMMENDED TUTORS COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
function MLRecommendedTutors({ user }) {
  const [recs, setRecs]       = useState([]);
  const [perfLevel, setPerfLevel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecs() {
      try {
        // Get tutor IDs from DB
        const teacherRes = await fetch('http://localhost:5000/api/teachers');
        let tutorIds = [];
        if (teacherRes.ok) {
          const teachers = await teacherRes.json();
          tutorIds = teachers.map(t => t._id).filter(Boolean);
        }

        if (tutorIds.length === 0) {
          // Use mock tutors display if no DB tutors
          setRecs(tutors.slice(0, 3).map(t => ({ ...t, recScore: t.aiMatchScore, whyRecommended: 'Great match for your level' })));
          setLoading(false);
          return;
        }

        const studentProfile = {
          subjects:     user?.subjects     || ['Mathematics'],
          preferredMode: 'online',
          location:     user?.location     || 'delhi',
          budget:       user?.budget       || 800,
          availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        };

        const res = await fetch(`${ML_URL}/recommend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentProfile,
            quizHistory: mockQuizHistory,
            tutorIds,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setRecs(data.recommendations.slice(0, 3));
          setPerfLevel(data.studentPerformanceLevel);
        }
      } catch (e) {
        // Fallback to mock
        setRecs(tutors.slice(0, 3).map(t => ({ ...t, recScore: t.aiMatchScore, whyRecommended: 'Great match for your level' })));
        console.warn('ML recommend offline:', e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRecs();
  }, [user]);

  return (
    <div className="sidebar-card glass-card">
      <h3 className="sidebar-title">
        🤖 AI Recommended Tutors
        {perfLevel && (
          <span style={{ marginLeft: 8, fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 10, background: 'rgba(253,115,51,0.1)', color: '#fd7333' }}>
            for {perfLevel} level
          </span>
        )}
      </h3>
      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>🤖 Finding best tutors for you...</p>
      ) : (
        <div className="suggested-list">
          {recs.map((t, i) => (
            <Link to={`/tutor/${t.id || t.tutorId}`} key={i} className="suggested-item">
              <div className="avatar">
                {t.avatar?.startsWith('http') ? <img src={t.avatar} alt={t.name} /> : (t.name?.charAt(0) || '?')}
              </div>
              <div className="suggested-info">
                <span className="suggested-name">{t.name}</span>
                <span className="suggested-subject">{t.subjects?.[0]} • {t.whyRecommended}</span>
              </div>
              <span className="suggested-match">{t.recScore || t.aiMatchScore}%</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// STUDENT DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function StudentDashboard({ user, getInitials }) {
  const navigate = useNavigate();
  const { student, progressData, skillsData, recentSessions, upcomingSessions, subjectDistribution } = dashboardData;
  const [chartView, setChartView] = useState('progress');

  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(253, 115, 51, 0.1)' }} />
        <div className="container">
          <div className="dashboard-welcome">
            <div className="avatar avatar-lg">{getInitials()}</div>
            <div>
              <h1 className="dashboard-greeting">Welcome back, {user.name}! 🎓</h1>
              <p className="dashboard-subtext">{student.grade} • {student.streak} day streak 🔥</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        <div className="quick-stats">
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(253,115,51,0.12)', color: 'var(--primary-500)' }}><HiOutlineClock /></div>
            <div><span className="stat-value">{student.totalHours}</span><span className="stat-label">Hours Learned</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}><HiOutlineAcademicCap /></div>
            <div><span className="stat-value">{student.coursesCompleted}</span><span className="stat-label">Courses Done</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}><HiOutlineFire /></div>
            <div><span className="stat-value">{student.streak}</span><span className="stat-label">Day Streak</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}><FaTrophy /></div>
            <div><span className="stat-value">#{student.rank}</span><span className="stat-label">Leaderboard</span></div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="chart-card glass-card">
              <div className="chart-header">
                <h3 className="chart-title"><HiOutlineTrendingUp /> Learning Progress</h3>
                <div className="toggle-group">
                  <button className={`toggle-option ${chartView === 'progress' ? 'active' : ''}`} onClick={() => setChartView('progress')}>Progress</button>
                  <button className={`toggle-option ${chartView === 'subjects' ? 'active' : ''}`} onClick={() => setChartView('subjects')}>Subjects</button>
                </div>
              </div>
              {chartView === 'progress' ? (
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                      <YAxis stroke="#71717a" fontSize={12} />
                      <Tooltip contentStyle={{ background: 'rgba(26,26,36,0.95)', border: '1px solid rgba(253,115,51,0.3)', borderRadius: '12px', color: '#f4f4f5' }} />
                      <Line type="monotone" dataKey="math"    stroke="#FD7333" strokeWidth={3} dot={{ fill: '#FD7333', r: 4 }} name="Mathematics" />
                      <Line type="monotone" dataKey="science" stroke="#E65A1B" strokeWidth={3} dot={{ fill: '#E65A1B', r: 4 }} name="Science" />
                      <Line type="monotone" dataKey="english" stroke="#FF8D54" strokeWidth={3} dot={{ fill: '#FF8D54', r: 4 }} name="English" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={subjectDistribution} cx="50%" cy="50%" outerRadius={110} innerRadius={60} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                        {subjectDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: 'rgba(26,26,36,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '12px', color: '#f4f4f5' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="skills-card glass-card">
              <h3 className="chart-title">📊 Skill Assessment</h3>
              <div className="skills-list">
                {skillsData.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-info"><span className="skill-name">{skill.skill}</span><span className="skill-score">{skill.score}%</span></div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${skill.score}%`, background: skill.score >= 90 ? 'linear-gradient(90deg,#10b981,#34d399)' : skill.score >= 80 ? 'linear-gradient(90deg,#FD7333,#FF8D54)' : 'linear-gradient(90deg,#f59e0b,#fbbf24)', animationDelay: `${i * 0.15}s` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-sidebar">
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">⚡ Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/find-tutor')}>🔍 Find a Tutor</button>
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: '#f4f4f5', borderColor: 'rgba(255,255,255,0.1)' }} onClick={() => navigate('/practice-quiz')}>🎯 Practice Skills</button>
              </div>
            </div>

            {/* 🔥 ML PERFORMANCE CARD */}
            <MLPerformanceCard user={user} />

            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">📅 Upcoming Sessions</h3>
              <div className="sessions-list">
                {upcomingSessions.map((session, i) => (
                  <div key={i} className="session-item">
                    <div className="session-info"><span className="session-tutor">{session.tutor}</span><span className="session-subject">{session.subject}</span><span className="session-time">{session.date} • {session.time}</span></div>
                    <span className={`mode-tag mode-${session.mode}`}>{session.mode === 'online' ? <FaVideo /> : <FaMapMarkerAlt />} {session.mode}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">📝 Recent Sessions</h3>
              <div className="sessions-list">
                {recentSessions.map((session, i) => (
                  <div key={i} className="session-item">
                    <div className="session-info"><span className="session-tutor">{session.tutor}</span><span className="session-subject">{session.subject} • {session.duration}</span></div>
                    <div className="session-rating">{'★'.repeat(session.rating)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title"><FaMedal /> Badges & Achievements</h3>
              <div className="badges-grid">
                {student.badges.map((badge, i) => (
                  <div key={i} className={`badge-item ${badge.earned ? 'badge-earned' : 'badge-locked'}`}>
                    <span className="badge-icon">{badge.icon}</span><span className="badge-name">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 🔥 ML RECOMMENDED TUTORS */}
            <MLRecommendedTutors user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TEACHER DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function TeacherDashboard({ user, getInitials }) {
  const navigate = useNavigate();
  const [chartView, setChartView] = useState('hours');

  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-hero teacher-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(253,115,51,0.1)' }} />
        <div className="container">
          <div className="dashboard-welcome">
            <div className="avatar avatar-lg teacher-avatar">{getInitials()}</div>
            <div>
              <h1 className="dashboard-greeting">Welcome, {user.name}! 📚</h1>
              <p className="dashboard-subtext">Managing {teacherData.totalStudents} students • {teacherData.upcomingSessions.length} upcoming sessions 🗓️</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        <div className="quick-stats">
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}><HiOutlineUsers /></div>
            <div><span className="stat-value">{teacherData.totalStudents}</span><span className="stat-label">Active Students</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(253,115,51,0.12)', color: 'var(--primary-500)' }}><HiOutlineCalendar /></div>
            <div><span className="stat-value">{teacherData.totalSessions}</span><span className="stat-label">Total Sessions</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}><HiOutlineClock /></div>
            <div><span className="stat-value">{teacherData.totalHours}</span><span className="stat-label">Hours Taught</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}><HiOutlineStar /></div>
            <div><span className="stat-value">{teacherData.avgRating}</span><span className="stat-label">Avg Rating</span></div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="chart-card glass-card">
              <div className="chart-header">
                <h3 className="chart-title"><FaUserGraduate /> My Students</h3>
                <span className="student-count-badge">{teacherData.students.length} enrolled</span>
              </div>
              <div className="student-table">
                <div className="student-table-header">
                  <span>Student</span><span>Subject</span><span>Progress</span><span>Last Session</span><span>Status</span>
                </div>
                {teacherData.students.map((s, i) => (
                  <div key={i} className="student-table-row">
                    <div className="student-cell-name">
                      <div className="avatar avatar-sm">{s.avatar.startsWith('http') ? <img src={s.avatar} alt={s.name} /> : s.avatar}</div>
                      <div><span className="student-name-text">{s.name}</span><span className="student-email-text">{s.email}</span></div>
                    </div>
                    <span className="student-cell">{s.subject}</span>
                    <div className="student-cell">
                      <div className="mini-progress-bar"><div className="mini-progress-fill" style={{ width: `${s.progress}%`, background: s.progress >= 90 ? '#34d399' : s.progress >= 75 ? '#a78bfa' : '#fbbf24' }} /></div>
                      <span className="mini-progress-text">{s.progress}%</span>
                    </div>
                    <span className="student-cell student-cell-muted">{s.lastSession}</span>
                    <span className={`status-badge status-${s.status}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-card glass-card">
              <div className="chart-header">
                <h3 className="chart-title"><HiOutlineTrendingUp /> {chartView === 'hours' ? 'Weekly Teaching Hours' : 'Monthly Earnings'}</h3>
                <div className="toggle-group">
                  <button className={`toggle-option ${chartView === 'hours' ? 'active' : ''}`} onClick={() => setChartView('hours')}>Hours</button>
                  <button className={`toggle-option ${chartView === 'earnings' ? 'active' : ''}`} onClick={() => setChartView('earnings')}>Earnings</button>
                </div>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={280}>
                  {chartView === 'hours' ? (
                    <BarChart data={teacherData.weeklyHours}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                      <YAxis stroke="#71717a" fontSize={12} />
                      <Tooltip contentStyle={{ background: 'rgba(26,26,36,0.95)', border: '1px solid rgba(253,115,51,0.3)', borderRadius: '12px', color: '#f4f4f5' }} />
                      <Bar dataKey="hours" fill="#FD7333" radius={[6, 6, 0, 0]} name="Hours" />
                    </BarChart>
                  ) : (
                    <LineChart data={teacherData.earnings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                      <YAxis stroke="#71717a" fontSize={12} />
                      <Tooltip contentStyle={{ background: 'rgba(26,26,36,0.95)', border: '1px solid rgba(253,115,51,0.3)', borderRadius: '12px', color: '#f4f4f5' }} formatter={(v) => `₹${v.toLocaleString()}`} />
                      <Line type="monotone" dataKey="amount" stroke="#FD7333" strokeWidth={3} dot={{ fill: '#FD7333', r: 5 }} name="Earnings" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="dashboard-sidebar">
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">⚡ Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/schedule-session')}>📅 Schedule Session</button>
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: '#f4f4f5', borderColor: 'rgba(255,255,255,0.1)' }} onClick={() => navigate('/assignments')}>📝 Manage Assignments</button>
              </div>
            </div>
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">📅 Upcoming Sessions</h3>
              <div className="sessions-list">
                {teacherData.upcomingSessions.map((session, i) => (
                  <div key={i} className="session-item">
                    <div className="session-info"><span className="session-tutor">{session.student}</span><span className="session-subject">{session.subject}</span><span className="session-time">{session.date} • {session.time}</span></div>
                    <span className={`mode-tag mode-${session.mode}`}>{session.mode === 'online' ? <FaVideo /> : <FaMapMarkerAlt />} {session.mode}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">⭐ Recent Reviews</h3>
              <div className="sessions-list">
                {[{ n: 'Alex Johnson', t: 'Best math tutor! Concepts became so clear.' }, { n: 'Rahul Kumar', t: 'Very patient and thorough explanations.' }, { n: 'Kiran Shah', t: 'Helped me improve my grades significantly.' }].map((r, i) => (
                  <div key={i} className="session-item">
                    <div className="session-info"><span className="session-tutor">{r.n}</span><span className="session-subject">"{r.t}"</span></div>
                    <div className="session-rating">★★★★★</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PARENT DASHBOARD
// ══════════════════════════════════════════════════════════════════════════════
function ParentDashboard({ user, getInitials }) {
  const { student, progressData, skillsData } = dashboardData;
  const childName = user.studentName || 'Your Child';

  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-hero parent-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(245,158,11,0.1)' }} />
        <div className="container">
          <div className="dashboard-welcome">
            <div className="avatar avatar-lg parent-avatar">{getInitials()}</div>
            <div>
              <h1 className="dashboard-greeting">Welcome, {user.name}! 👨‍👩‍👧</h1>
              <p className="dashboard-subtext">Monitoring {childName}'s academic progress 📈</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        <div className="quick-stats">
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}><HiOutlineClock /></div>
            <div><span className="stat-value">{student.totalHours}</span><span className="stat-label">{childName}'s Hours</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}><HiOutlineAcademicCap /></div>
            <div><span className="stat-value">{student.coursesCompleted}</span><span className="stat-label">Courses Completed</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(253,115,51,0.12)', color: 'var(--primary-500)' }}><HiOutlineFire /></div>
            <div><span className="stat-value">{student.streak}</span><span className="stat-label">Day Streak</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}><FaTrophy /></div>
            <div><span className="stat-value">#{student.rank}</span><span className="stat-label">Class Rank</span></div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="chart-card glass-card">
              <div className="chart-header"><h3 className="chart-title"><HiOutlineTrendingUp /> {childName}'s Academic Progress</h3></div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" fontSize={12} />
                    <Tooltip contentStyle={{ background: 'rgba(26,26,36,0.95)', border: '1px solid rgba(253,115,51,0.3)', borderRadius: '12px', color: '#f4f4f5' }} />
                    <Line type="monotone" dataKey="math"    stroke="#FD7333" strokeWidth={3} dot={{ fill: '#FD7333', r: 4 }} name="Mathematics" />
                    <Line type="monotone" dataKey="science" stroke="#E65A1B" strokeWidth={3} dot={{ fill: '#E65A1B', r: 4 }} name="Science" />
                    <Line type="monotone" dataKey="english" stroke="#FF8D54" strokeWidth={3} dot={{ fill: '#FF8D54', r: 4 }} name="English" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="skills-card glass-card">
              <h3 className="chart-title">📊 {childName}'s Skill Report</h3>
              <div className="skills-list">
                {skillsData.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-info"><span className="skill-name">{skill.skill}</span><span className="skill-score">{skill.score}%</span></div>
                    <div className="progress-bar"><div className="progress-bar-fill" style={{ width: `${skill.score}%`, background: skill.score >= 90 ? 'linear-gradient(90deg,#10b981,#34d399)' : skill.score >= 80 ? 'linear-gradient(90deg,#8b5cf6,#a78bfa)' : 'linear-gradient(90deg,#f59e0b,#fbbf24)', animationDelay: `${i * 0.15}s` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="dashboard-sidebar">
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">👤 Child's Profile</h3>
              <div className="parent-child-card">
                <div className="avatar avatar-lg">{student.avatar.startsWith('http') ? <img src={student.avatar} alt="Student" /> : student.avatar}</div>
                <div className="parent-child-info">
                  <span className="parent-child-name">{childName}</span>
                  <span className="parent-child-detail">{student.grade}</span>
                  <span className="parent-child-detail">{student.streak} day streak 🔥</span>
                </div>
              </div>
            </div>
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">📅 {childName}'s Upcoming Sessions</h3>
              <div className="sessions-list">
                {dashboardData.upcomingSessions.map((session, i) => (
                  <div key={i} className="session-item">
                    <div className="session-info"><span className="session-tutor">{session.tutor}</span><span className="session-subject">{session.subject}</span><span className="session-time">{session.date} • {session.time}</span></div>
                    <span className={`mode-tag mode-${session.mode}`}>{session.mode === 'online' ? <FaVideo /> : <FaMapMarkerAlt />} {session.mode}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title"><FaMedal /> {childName}'s Achievements</h3>
              <div className="badges-grid">
                {student.badges.map((badge, i) => (
                  <div key={i} className={`badge-item ${badge.earned ? 'badge-earned' : 'badge-locked'}`}>
                    <span className="badge-icon">{badge.icon}</span><span className="badge-name">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
