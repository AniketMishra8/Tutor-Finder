import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { HiOutlineAcademicCap, HiOutlineClock, HiOutlineFire, HiOutlineTrendingUp, HiOutlineStar, HiOutlineUsers, HiOutlineCalendar, HiOutlineBookOpen, HiOutlineSearch, HiOutlinePencilAlt } from 'react-icons/hi';
import { FaVideo, FaMapMarkerAlt, FaTrophy, FaMedal, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import { dashboardData, tutors } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

// ====== MOCK DATA FOR TEACHER DASHBOARD ======
const teacherData = {
  totalStudents: 24,
  totalSessions: 186,
  totalHours: 312,
  avgRating: 4.8,
  students: [
    { name: 'Alex Johnson', email: 'alex@student.com', subject: 'Mathematics', progress: 92, lastSession: 'Mar 12, 2026', avatar: 'https://i.pravatar.cc/150?u=alex', status: 'active' },
    { name: 'Test Student', email: 'teststudent@school.com', subject: 'Physics', progress: 78, lastSession: 'Mar 11, 2026', avatar: 'https://i.pravatar.cc/150?u=test1', status: 'active' },
    { name: 'Rahul Kumar', email: 'rahul@student.com', subject: 'Mathematics', progress: 85, lastSession: 'Mar 10, 2026', avatar: 'https://i.pravatar.cc/150?u=rahul2', status: 'active' },
    { name: 'Sneha Mishra', email: 'sneha@student.com', subject: 'Physics', progress: 71, lastSession: 'Mar 9, 2026', avatar: 'https://i.pravatar.cc/150?u=sneha3', status: 'inactive' },
    { name: 'Kiran Shah', email: 'kiran@student.com', subject: 'Mathematics', progress: 88, lastSession: 'Mar 8, 2026', avatar: 'https://i.pravatar.cc/150?u=kiran', status: 'active' },
    { name: 'Pooja Rao',  email: 'pooja@student.com',  subject: 'Calculus',    progress: 95, lastSession: 'Mar 7, 2026', avatar: 'https://i.pravatar.cc/150?u=pooja', status: 'active' },
  ],
  upcomingSessions: [
    { student: 'Alex Johnson', subject: 'Calculus', date: 'Mar 15, 2026', time: '4:00 PM', mode: 'online' },
    { student: 'Rahul Kumar', subject: 'Algebra', date: 'Mar 16, 2026', time: '5:30 PM', mode: 'offline' },
    { student: 'Kiran Shah', subject: 'Trigonometry', date: 'Mar 17, 2026', time: '3:00 PM', mode: 'online' },
  ],
  weeklyHours: [
    { day: 'Mon', hours: 4 }, { day: 'Tue', hours: 6 }, { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 5 }, { day: 'Fri', hours: 7 }, { day: 'Sat', hours: 4 }, { day: 'Sun', hours: 2 },
  ],
  earnings: [
    { month: 'Oct', amount: 24000 }, { month: 'Nov', amount: 28000 }, { month: 'Dec', amount: 32000 },
    { month: 'Jan', amount: 30000 }, { month: 'Feb', amount: 35000 }, { month: 'Mar', amount: 38000 },
  ]
};

// ====== MAIN DASHBOARD COMPONENT ======
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  const getInitials = () => {
    if (!user?.name) return '?';
    return user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!user) return null;

  // If teacher hasn't completed their profile, show setup prompt
  if (user.role === 'teacher' && !user.isProfileComplete) {
    return <TeacherProfilePrompt user={user} getInitials={getInitials} />;
  }

  if (user.role === 'teacher') return <TeacherDashboard user={user} getInitials={getInitials} />;
  if (user.role === 'parent') return <ParentDashboard user={user} getInitials={getInitials} />;
  return <StudentDashboard user={user} getInitials={getInitials} />;
}

// ====== TEACHER PROFILE PROMPT ======
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

// ====== STUDENT DASHBOARD ======
function StudentDashboard({ user, getInitials }) {
  const { student, progressData, skillsData, recentSessions, upcomingSessions, subjectDistribution } = dashboardData;
  const [chartView, setChartView] = useState('progress');
  const suggestedTutors = tutors.slice(0, 3);

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
            <div className="stat-icon" style={{ background: 'rgba(253, 115, 51, 0.12)', color: 'var(--primary-500)' }}><HiOutlineClock /></div>
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
                      <Tooltip contentStyle={{ background: 'rgba(26,26,36,0.95)', border: '1px solid rgba(253, 115, 51, 0.3)', borderRadius: '12px', color: '#f4f4f5' }} />
                      <Line type="monotone" dataKey="math" stroke="#FD7333" strokeWidth={3} dot={{ fill: '#FD7333', r: 4 }} name="Mathematics" />
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
                        {subjectDistribution.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
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
                      <div className="progress-bar-fill" style={{ width: `${skill.score}%`, background: skill.score >= 90 ? 'linear-gradient(90deg, #10b981, #34d399)' : skill.score >= 80 ? 'linear-gradient(90deg, #FD7333, #FF8D54)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)', animationDelay: `${i * 0.15}s` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="dashboard-sidebar">
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
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">🤖 AI Suggested Tutors</h3>
              <div className="suggested-list">
                {suggestedTutors.map(t => (
                  <Link to={`/tutor/${t.id}`} key={t.id} className="suggested-item">
                    <div className="avatar">
                      {t.avatar.startsWith('http') ? <img src={t.avatar} alt={t.name} /> : t.avatar}
                    </div>
                    <div className="suggested-info"><span className="suggested-name">{t.name}</span><span className="suggested-subject">{t.subjects[0]}</span></div>
                    <span className="suggested-match">{t.aiMatchScore}%</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====== TEACHER DASHBOARD ======
function TeacherDashboard({ user, getInitials }) {
  const [chartView, setChartView] = useState('hours');

  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-hero teacher-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(253, 115, 51, 0.1)' }} />
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
        {/* Teacher Stats */}
        <div className="quick-stats">
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}><HiOutlineUsers /></div>
            <div><span className="stat-value">{teacherData.totalStudents}</span><span className="stat-label">Active Students</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(253, 115, 51, 0.12)', color: 'var(--primary-500)' }}><HiOutlineCalendar /></div>
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
            {/* My Students Table */}
            <div className="chart-card glass-card">
              <div className="chart-header">
                <h3 className="chart-title"><FaUserGraduate /> My Students</h3>
                <span className="student-count-badge">{teacherData.students.length} enrolled</span>
              </div>
              <div className="student-table">
                <div className="student-table-header">
                  <span>Student</span>
                  <span>Subject</span>
                  <span>Progress</span>
                  <span>Last Session</span>
                  <span>Status</span>
                </div>
                {teacherData.students.map((s, i) => (
                  <div key={i} className="student-table-row">
                    <div className="student-cell-name">
                      <div className="avatar avatar-sm">
                        {s.avatar.startsWith('http') ? <img src={s.avatar} alt={s.name} /> : s.avatar}
                      </div>
                      <div>
                        <span className="student-name-text">{s.name}</span>
                        <span className="student-email-text">{s.email}</span>
                      </div>
                    </div>
                    <span className="student-cell">{s.subject}</span>
                    <div className="student-cell">
                      <div className="mini-progress-bar">
                        <div className="mini-progress-fill" style={{ width: `${s.progress}%`, background: s.progress >= 90 ? '#34d399' : s.progress >= 75 ? '#a78bfa' : '#fbbf24' }} />
                      </div>
                      <span className="mini-progress-text">{s.progress}%</span>
                    </div>
                    <span className="student-cell student-cell-muted">{s.lastSession}</span>
                    <span className={`status-badge status-${s.status}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Teaching Hours Chart */}
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
                      <Tooltip contentStyle={{ background: 'rgba(26,26,36,0.95)', border: '1px solid rgba(253, 115, 51, 0.3)', borderRadius: '12px', color: '#f4f4f5' }} />
                      <Bar dataKey="hours" fill="#FD7333" radius={[6, 6, 0, 0]} name="Hours" />
                    </BarChart>
                  ) : (
                    <LineChart data={teacherData.earnings}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                      <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                      <YAxis stroke="#71717a" fontSize={12} />
                      <Tooltip contentStyle={{ background: 'rgba(26,26,36,0.95)', border: '1px solid rgba(253, 115, 51, 0.3)', borderRadius: '12px', color: '#f4f4f5' }} formatter={(v) => `₹${v.toLocaleString()}`} />
                      <Line type="monotone" dataKey="amount" stroke="#FD7333" strokeWidth={3} dot={{ fill: '#FD7333', r: 5 }} name="Earnings" />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Teacher Sidebar */}
          <div className="dashboard-sidebar">
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">📅 Upcoming Sessions</h3>
              <div className="sessions-list">
                {teacherData.upcomingSessions.map((session, i) => (
                  <div key={i} className="session-item">
                    <div className="session-info">
                      <span className="session-tutor">{session.student}</span>
                      <span className="session-subject">{session.subject}</span>
                      <span className="session-time">{session.date} • {session.time}</span>
                    </div>
                    <span className={`mode-tag mode-${session.mode}`}>{session.mode === 'online' ? <FaVideo /> : <FaMapMarkerAlt />} {session.mode}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">⭐ Recent Reviews</h3>
              <div className="sessions-list">
                <div className="session-item">
                  <div className="session-info"><span className="session-tutor">Alex Johnson</span><span className="session-subject">"Best math tutor! Concepts became so clear."</span></div>
                  <div className="session-rating">★★★★★</div>
                </div>
                <div className="session-item">
                  <div className="session-info"><span className="session-tutor">Rahul Kumar</span><span className="session-subject">"Very patient and thorough explanations."</span></div>
                  <div className="session-rating">★★★★★</div>
                </div>
                <div className="session-item">
                  <div className="session-info"><span className="session-tutor">Kiran Shah</span><span className="session-subject">"Helped me improve my grades significantly."</span></div>
                  <div className="session-rating">★★★★☆</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ====== PARENT DASHBOARD ======
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
        {/* Child's Quick Stats */}
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
            <div className="stat-icon" style={{ background: 'rgba(253, 115, 51, 0.12)', color: 'var(--primary-500)' }}><HiOutlineFire /></div>
            <div><span className="stat-value">{student.streak}</span><span className="stat-label">Day Streak</span></div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}><FaTrophy /></div>
            <div><span className="stat-value">#{student.rank}</span><span className="stat-label">Class Rank</span></div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-main">
            {/* Child's Progress Chart */}
            <div className="chart-card glass-card">
              <div className="chart-header">
                <h3 className="chart-title"><HiOutlineTrendingUp /> {childName}'s Academic Progress</h3>
              </div>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                    <YAxis stroke="#71717a" fontSize={12} />
                    <Tooltip contentStyle={{ background: 'rgba(26,26,36,0.95)', border: '1px solid rgba(253, 115, 51, 0.3)', borderRadius: '12px', color: '#f4f4f5' }} />
                    <Line type="monotone" dataKey="math" stroke="#FD7333" strokeWidth={3} dot={{ fill: '#FD7333', r: 4 }} name="Mathematics" />
                    <Line type="monotone" dataKey="science" stroke="#E65A1B" strokeWidth={3} dot={{ fill: '#E65A1B', r: 4 }} name="Science" />
                    <Line type="monotone" dataKey="english" stroke="#FF8D54" strokeWidth={3} dot={{ fill: '#FF8D54', r: 4 }} name="English" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Child's Skills */}
            <div className="skills-card glass-card">
              <h3 className="chart-title">📊 {childName}'s Skill Report</h3>
              <div className="skills-list">
                {skillsData.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-info"><span className="skill-name">{skill.skill}</span><span className="skill-score">{skill.score}%</span></div>
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${skill.score}%`, background: skill.score >= 90 ? 'linear-gradient(90deg, #10b981, #34d399)' : skill.score >= 80 ? 'linear-gradient(90deg, #8b5cf6, #a78bfa)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)', animationDelay: `${i * 0.15}s` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Parent Sidebar */}
          <div className="dashboard-sidebar">
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">👤 Child's Profile</h3>
              <div className="parent-child-card">
                <div className="avatar avatar-lg">
                  {student.avatar.startsWith('http') ? <img src={student.avatar} alt="Student" /> : student.avatar}
                </div>
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
                    <div className="session-info">
                      <span className="session-tutor">{session.tutor}</span>
                      <span className="session-subject">{session.subject}</span>
                      <span className="session-time">{session.date} • {session.time}</span>
                    </div>
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
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">🔔 Notifications</h3>
              <div className="sessions-list">
                <div className="session-item"><div className="session-info"><span className="session-tutor">Session Completed</span><span className="session-subject">{childName} completed a Math session with Dr. Priya Sharma</span></div></div>
                <div className="session-item"><div className="session-info"><span className="session-tutor">New Badge Earned</span><span className="session-subject">{childName} earned the "100 Hours" badge! 🏆</span></div></div>
                <div className="session-item"><div className="session-info"><span className="session-tutor">Progress Update</span><span className="session-subject">{childName}'s Science score improved by 7% this month</span></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
