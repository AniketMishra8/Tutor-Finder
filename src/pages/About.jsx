import { techStack } from '../data/mockData';
import { HiOutlineShieldCheck, HiOutlineLightningBolt } from 'react-icons/hi';
import { FaEthereum } from 'react-icons/fa';
import './About.css';

export default function About() {
  const categories = ['Frontend', 'Backend', 'AI/ML', 'Database', 'Cloud', 'Blockchain', 'Security'];

  return (
    <div className="about-page page-enter">
      {/* Hero */}
      <section className="about-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-15%', left: '10%', background: 'rgba(139,92,246,0.1)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-10%', right: '5%', background: 'rgba(6,182,212,0.08)', animationDelay: '-8s' }} />

        <div className="container about-hero-content">
          <div className="hero-badge animate-fade-in-up">
            🏆 UHack 4.0 — Team UHK04223
          </div>
          <h1 className="about-title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="hero-gradient">DeepThink Labs</span>
          </h1>
          <p className="about-desc animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Building the future of smart education through AI-powered tutor matching,
            blockchain credential verification, and seamless hybrid learning.
          </p>
          <div className="about-meta animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <span className="badge badge-primary">Problem ID: D12-S01</span>
            <span className="badge badge-cyan">Theme: Smart Education</span>
            <span className="badge badge-success">Category: Software</span>
          </div>
        </div>
      </section>

      {/* System Architecture */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">System Architecture</h2>
            <p className="section-subtitle">
              Scalable, modular microservices architecture designed for reliability and performance.
            </p>
          </div>

          <div className="architecture-diagram glass-card">
            <div className="arch-layer arch-frontend">
              <div className="arch-layer-label">🖥️ Frontend Layer</div>
              <div className="arch-nodes">
                <div className="arch-node">React Web App</div>
                <div className="arch-node">React Native Mobile</div>
                <div className="arch-node">Admin Dashboard</div>
              </div>
            </div>

            <div className="arch-connector">
              <div className="arch-connector-line" />
              <span className="arch-connector-label">REST API / WebSocket</span>
            </div>

            <div className="arch-layer arch-backend">
              <div className="arch-layer-label">⚙️ Backend Layer</div>
              <div className="arch-nodes">
                <div className="arch-node">Node.js API Server</div>
                <div className="arch-node">AI Matching Engine</div>
                <div className="arch-node">Auth Service</div>
              </div>
            </div>

            <div className="arch-connector">
              <div className="arch-connector-line" />
            </div>

            <div className="arch-layer arch-data">
              <div className="arch-layer-label">💾 Data Layer</div>
              <div className="arch-nodes">
                <div className="arch-node">MongoDB</div>
                <div className="arch-node">PostgreSQL</div>
                <div className="arch-node">Redis Cache</div>
              </div>
            </div>

            <div className="arch-connector">
              <div className="arch-connector-line" />
            </div>

            <div className="arch-layer arch-infra">
              <div className="arch-layer-label">☁️ Infrastructure</div>
              <div className="arch-nodes">
                <div className="arch-node">AWS / Azure Cloud</div>
                <div className="arch-node arch-blockchain">
                  <FaEthereum style={{ marginRight: 4 }} /> Ethereum Blockchain
                </div>
                <div className="arch-node">ML Pipeline</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section tech-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Technology Stack</h2>
            <p className="section-subtitle">
              Built with production-grade, scalable technologies.
            </p>
          </div>

          <div className="tech-grid">
            {techStack.map((tech, i) => (
              <div key={i} className="tech-card glass-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="tech-icon">{tech.icon}</div>
                <div className="tech-info">
                  <h4 className="tech-name">{tech.name}</h4>
                  <span className="tech-category badge badge-primary">{tech.category}</span>
                  <p className="tech-desc">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Impact & Benefits</h2>
            <p className="section-subtitle">Creating meaningful change in education at every level.</p>
          </div>

          <div className="impact-grid">
            {[
              { icon: '🌍', title: 'Social Impact', desc: 'Builds access to quality tutoring regardless of location or circumstances.', color: '#8b5cf6' },
              { icon: '💰', title: 'Economic Impact', desc: 'Creates income opportunities for local and remote tutors.', color: '#10b981' },
              { icon: '📚', title: 'Educational Impact', desc: 'Combines flexibility of online with engagement of offline sessions.', color: '#06b6d4' },
              { icon: '🔬', title: 'Technological Impact', desc: 'Empowers adoption of AI, blockchain, and AR/VR for immersive learning.', color: '#f59e0b' }
            ].map((item, i) => (
              <div key={i} className="impact-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="impact-icon" style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                  {item.icon}
                </div>
                <h3 className="impact-title">{item.title}</h3>
                <p className="impact-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feasibility */}
      <section className="section feasibility-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Feasibility & Viability</h2>
          </div>
          <div className="feasibility-grid">
            <div className="feasibility-card glass-card">
              <h3><HiOutlineLightningBolt /> Feasibility</h3>
              <ul>
                <li><strong>Proven Technologies:</strong> Scalable web, AI/ML, blockchain, and cloud tools.</li>
                <li><strong>Low Initial Investment:</strong> Cloud-based deployment minimizes infrastructure cost.</li>
              </ul>
            </div>
            <div className="feasibility-card glass-card">
              <h3><HiOutlineShieldCheck /> Risk Mitigation</h3>
              <ul>
                <li>Compliant encryption & data protection</li>
                <li>Pilot launch + feedback-driven improvement</li>
                <li>Multiple revenue streams: subscription & commission</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
