import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { HiOutlineAcademicCap, HiOutlineClock, HiOutlineFire, HiOutlineTrendingUp, HiOutlineStar } from 'react-icons/hi';
import { FaVideo, FaMapMarkerAlt, FaTrophy, FaMedal } from 'react-icons/fa';
import { dashboardData, tutors } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { student, progressData, skillsData, recentSessions, upcomingSessions, subjectDistribution } = dashboardData;
  const [chartView, setChartView] = useState('progress');
  const { user } = useAuth();

  const suggestedTutors = tutors.slice(0, 3);

  // Customize greeting based on role
  const getGreeting = () => {
    if (!user) return `Welcome back, ${student.name}! 🎓`;
    if (user.role === 'student') return `Welcome back, ${user.name}! 🎓`;
    if (user.role === 'teacher') return `Welcome to your Teacher Dashboard, ${user.name}! 📚`;
    if (user.role === 'parent') return `Welcome back, ${user.name}! Here is ${user.studentName}'s progress. 📈`;
    return `Welcome back! 🎓`;
  };

  const getSubtext = () => {
    if (user?.role === 'teacher') return `Managing 12 active students • 4 sessions today 🗓️`;
    return `${student.grade} • ${student.streak} day streak 🔥`; // Default for student/parent looking at student
  };

  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(139,92,246,0.1)' }} />
        <div className="container">
          <div className="dashboard-welcome">
            <div className="avatar avatar-lg">{user?.role === 'teacher' ? 'PS' : user?.role === 'parent' ? 'MJ' : student.avatar}</div>
            <div>
              <h1 className="dashboard-greeting">{getGreeting()}</h1>
              <p className="dashboard-subtext">{getSubtext()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container dashboard-content">
        {/* Quick stats */}
        <div className="quick-stats">
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.12)', color: '#a78bfa' }}>
              <HiOutlineClock />
            </div>
            <div>
              <span className="stat-value">{student.totalHours}</span>
              <span className="stat-label">Hours Learned</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399' }}>
              <HiOutlineAcademicCap />
            </div>
            <div>
              <span className="stat-value">{student.coursesCompleted}</span>
              <span className="stat-label">Courses Done</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24' }}>
              <HiOutlineFire />
            </div>
            <div>
              <span className="stat-value">{student.streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
          </div>
          <div className="stat-card glass-card">
            <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee' }}>
              <FaTrophy />
            </div>
            <div>
              <span className="stat-value">#{student.rank}</span>
              <span className="stat-label">Leaderboard</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Left: Charts */}
          <div className="dashboard-main">
            {/* Progress Chart */}
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
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(26,26,36,0.95)',
                          border: '1px solid rgba(139,92,246,0.3)',
                          borderRadius: '12px',
                          color: '#f4f4f5'
                        }}
                      />
                      <Line type="monotone" dataKey="math" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} name="Mathematics" />
                      <Line type="monotone" dataKey="science" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4', r: 4 }} name="Science" />
                      <Line type="monotone" dataKey="english" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} name="English" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={60}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`}
                      >
                        {subjectDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(26,26,36,0.95)',
                          border: '1px solid rgba(139,92,246,0.3)',
                          borderRadius: '12px',
                          color: '#f4f4f5'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="skills-card glass-card">
              <h3 className="chart-title">📊 Skill Assessment</h3>
              <div className="skills-list">
                {skillsData.map((skill, i) => (
                  <div key={i} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.skill}</span>
                      <span className="skill-score">{skill.score}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${skill.score}%`,
                          background: skill.score >= 90
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : skill.score >= 80
                            ? 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
                            : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="dashboard-sidebar">
            {/* Upcoming sessions */}
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">📅 Upcoming Sessions</h3>
              <div className="sessions-list">
                {upcomingSessions.map((session, i) => (
                  <div key={i} className="session-item">
                    <div className="session-info">
                      <span className="session-tutor">{session.tutor}</span>
                      <span className="session-subject">{session.subject}</span>
                      <span className="session-time">{session.date} • {session.time}</span>
                    </div>
                    <span className={`mode-tag mode-${session.mode}`}>
                      {session.mode === 'online' ? <FaVideo /> : <FaMapMarkerAlt />} {session.mode}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent sessions */}
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">📝 Recent Sessions</h3>
              <div className="sessions-list">
                {recentSessions.map((session, i) => (
                  <div key={i} className="session-item">
                    <div className="session-info">
                      <span className="session-tutor">{session.tutor}</span>
                      <span className="session-subject">{session.subject} • {session.duration}</span>
                    </div>
                    <div className="session-rating">
                      {'★'.repeat(session.rating)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gamification */}
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title"><FaMedal /> Badges & Achievements</h3>
              <div className="badges-grid">
                {student.badges.map((badge, i) => (
                  <div key={i} className={`badge-item ${badge.earned ? 'badge-earned' : 'badge-locked'}`}>
                    <span className="badge-icon">{badge.icon}</span>
                    <span className="badge-name">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggested tutors */}
            <div className="sidebar-card glass-card">
              <h3 className="sidebar-title">🤖 AI Suggested Tutors</h3>
              <div className="suggested-list">
                {suggestedTutors.map(t => (
                  <Link to={`/tutor/${t.id}`} key={t.id} className="suggested-item">
                    <div className="avatar">{t.avatar}</div>
                    <div className="suggested-info">
                      <span className="suggested-name">{t.name}</span>
                      <span className="suggested-subject">{t.subjects[0]}</span>
                    </div>
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
