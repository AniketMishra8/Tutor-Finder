import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineStar, HiOutlineFire, HiOutlineShoppingCart,
  HiOutlineCheckCircle, HiOutlineGift, HiOutlineTrendingUp,
  HiOutlineSparkles, HiOutlineBadgeCheck
} from 'react-icons/hi';
import { FaTrophy, FaMedal, FaGem, FaCrown, FaCertificate, FaGamepad, FaGift, FaAward, FaTshirt, FaPen, FaBook, FaBookOpen, FaStar } from 'react-icons/fa';
import { HiOutlinePencil, HiOutlineBookOpen, HiOutlineColorSwatch } from 'react-icons/hi';
import './RewardsStore.css';

// ===== GOODIES CATALOG =====
const goodiesCatalog = [
  {
    id: 1,
    name: 'Gold Star Certificate',
    description: 'A beautiful printable certificate recognizing your academic excellence',
    icon: <FaCertificate />,
    image: '/img/rewards/gold_certificate.png',
    xpCost: 200,
    color: '#fbbf24',
    category: 'certificates',
    rarity: 'common'
  },
  {
    id: 2,
    name: 'Premium Badge Pack',
    description: '5 exclusive animated profile badges to show off your achievements',
    icon: <FaMedal />,
    image: '/img/rewards/premium_badges.png',
    xpCost: 350,
    color: '#8b5cf6',
    category: 'badges',
    rarity: 'rare'
  },
  {
    id: 3,
    name: 'DeepThink T-Shirt',
    description: 'Exclusive branded t-shirt shipped to your address (virtual claim)',
    icon: <FaGift />,
    image: '/img/rewards/deepthink_tshirt_orange.png',
    xpCost: 800,
    color: '#FD7333',
    category: 'merchandise',
    rarity: 'epic'
  },
  {
    id: 4,
    name: 'Study Toolkit',
    description: 'Premium stationery set including notebooks, pens, and highlighters',
    icon: <HiOutlineSparkles />,
    image: '/img/rewards/study_toolkit.png',
    xpCost: 500,
    color: '#10b981',
    category: 'merchandise',
    rarity: 'rare'
  },
  {
    id: 5,
    name: 'Diamond Crown',
    description: 'The ultimate profile decoration — visible to all tutors and students!',
    icon: <FaCrown />,
    image: '/img/rewards/diamond_crown.png',
    xpCost: 1500,
    color: '#06b6d4',
    category: 'badges',
    rarity: 'legendary'
  },
  {
    id: 6,
    name: '1-on-1 Bonus Session',
    description: 'Free 30-minute session with any top-rated tutor of your choice',
    icon: <FaGamepad />,
    image: '/img/rewards/bonus_session.png',
    xpCost: 1000,
    color: '#ec4899',
    category: 'sessions',
    rarity: 'epic'
  },
  {
    id: 7,
    name: 'Honor Roll Badge',
    description: 'Showcase your commitment with this special honor roll badge',
    icon: <FaAward />,
    image: '/img/rewards/honor_roll_badge.png',
    xpCost: 300,
    color: '#f59e0b',
    category: 'badges',
    rarity: 'common'
  },
  {
    id: 8,
    name: 'Genius Gem',
    description: 'A rare collectible gem that sparkles on your profile',
    icon: <FaGem />,
    image: '/img/rewards/genius_gem.png',
    xpCost: 600,
    color: '#a78bfa',
    category: 'badges',
    rarity: 'rare'
  },
  {
    id: 9,
    name: 'Premium Diary',
    description: 'A beautifully designed hardcover diary with 200 pages for notes and journaling',
    icon: <FaBook />,
    image: '/img/rewards/premium_diary.png',
    xpCost: 400,
    color: '#d946ef',
    category: 'merchandise',
    rarity: 'rare'
  },
  {
    id: 10,
    name: 'Gel Pen Set (12 Colors)',
    description: 'Smooth-writing premium gel pens in 12 vibrant colors for note-taking',
    icon: <FaPen />,
    image: '/img/rewards/gel_pens_set.png',
    xpCost: 250,
    color: '#3b82f6',
    category: 'merchandise',
    rarity: 'common'
  },
  {
    id: 11,
    name: 'Graphic T-Shirt — "Code & Learn"',
    description: 'Cool graphic tee with a developer-inspired design. Available in all sizes',
    icon: <FaTshirt />,
    image: '/img/rewards/graphic_tshirt.png',
    xpCost: 900,
    color: '#14b8a6',
    category: 'merchandise',
    rarity: 'epic'
  },
  {
    id: 12,
    name: 'Study Notes Bundle',
    description: 'Curated notes for Math, Science & English — handwritten-style PDFs',
    icon: <FaBookOpen />,
    image: '/img/rewards/study_notes.png',
    xpCost: 350,
    color: '#f97316',
    category: 'study',
    rarity: 'rare'
  },
  {
    id: 13,
    name: 'DeepThink Hoodie',
    description: 'Cozy premium hoodie with the DeepThink logo — perfect for late-night study sessions',
    icon: <FaTshirt />,
    image: '/img/rewards/deepthink_hoodie.png',
    xpCost: 1200,
    color: '#6366f1',
    category: 'merchandise',
    rarity: 'legendary'
  },
  {
    id: 14,
    name: 'Student Backpack',
    description: 'Durable, stylish backpack with laptop compartment and the DeepThink emblem',
    icon: <FaGift />,
    image: '/img/rewards/student_backpack.png',
    xpCost: 1800,
    color: '#0ea5e9',
    category: 'merchandise',
    rarity: 'legendary'
  },
  {
    id: 15,
    name: 'Highlighter Pack (6 Neon)',
    description: 'Bright neon highlighters for marking important notes and textbooks',
    icon: <HiOutlineColorSwatch />,
    image: '/img/rewards/neon_highlighters.png',
    xpCost: 180,
    color: '#84cc16',
    category: 'merchandise',
    rarity: 'common'
  },
  {
    id: 16,
    name: 'Math Formula Poster',
    description: 'Large wall poster with all essential math formulas from algebra to calculus',
    icon: <HiOutlinePencil />,
    image: '/img/rewards/math_poster.png',
    xpCost: 280,
    color: '#e11d48',
    category: 'study',
    rarity: 'common'
  },
  {
    id: 17,
    name: 'Flash Cards Set (200 cards)',
    description: 'Pre-made flash cards covering key concepts in Math, Physics, Chemistry & Biology',
    icon: <HiOutlineBookOpen />,
    xpCost: 450,
    color: '#8b5cf6',
    category: 'study',
    rarity: 'rare'
  },
  {
    id: 18,
    name: 'DeepThink Water Bottle',
    description: 'Insulated stainless steel water bottle with motivational quotes — stays cold 24hrs',
    icon: <FaStar />,
    image: '/img/rewards/water_bottle.png',
    xpCost: 550,
    color: '#0d9488',
    category: 'merchandise',
    rarity: 'rare'
  }
];

// ===== PERFORMANCE REWARDS =====
const performanceRewards = [
  { id: 'p1', name: 'Quiz Master', description: 'Score 90%+ on any 3 quizzes', icon: '🏆', threshold: 'quiz_master', color: '#fbbf24' },
  { id: 'p2', name: 'Weekly Champion', description: 'Earn the most XP in a week', icon: '🥇', threshold: 'weekly_champ', color: '#FD7333' },
  { id: 'p3', name: 'Streak Legend', description: 'Maintain a 7-day learning streak', icon: '🔥', threshold: 'streak_7', color: '#ef4444' },
  { id: 'p4', name: 'XP Milestone: 500', description: 'Accumulate 500 total XP', icon: '⭐', threshold: 'xp_500', color: '#8b5cf6' },
  { id: 'p5', name: 'XP Milestone: 1000', description: 'Accumulate 1000 total XP', icon: '💎', threshold: 'xp_1000', color: '#06b6d4' },
  { id: 'p6', name: 'Game Conqueror', description: 'Complete all 4 learning games', icon: '🎮', threshold: 'all_games', color: '#10b981' },
];

const PURCHASED_KEY = 'rewards_purchased';
const EARNED_KEY = 'rewards_earned';

function getPurchased() {
  try { return JSON.parse(localStorage.getItem(PURCHASED_KEY)) || []; } catch { return []; }
}
function getEarned() {
  try { return JSON.parse(localStorage.getItem(EARNED_KEY)) || []; } catch { return []; }
}

export default function RewardsStore() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('gamified_xp');
    return saved ? parseInt(saved) : 0;
  });
  const [purchased, setPurchased] = useState(getPurchased());
  const [earned, setEarned] = useState(getEarned());
  const [activeTab, setActiveTab] = useState('store'); // 'store' | 'my-rewards' | 'performance'
  const [showPurchaseModal, setShowPurchaseModal] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    localStorage.setItem(PURCHASED_KEY, JSON.stringify(purchased));
  }, [purchased]);

  useEffect(() => {
    // Auto-earn performance rewards based on XP thresholds
    const newEarned = [...earned];
    let changed = false;
    if (totalXP >= 500 && !earned.includes('xp_500')) { newEarned.push('xp_500'); changed = true; }
    if (totalXP >= 1000 && !earned.includes('xp_1000')) { newEarned.push('xp_1000'); changed = true; }
    if (changed) {
      setEarned(newEarned);
      localStorage.setItem(EARNED_KEY, JSON.stringify(newEarned));
    }
  }, [totalXP]);

  if (!user) return null;

  const handlePurchase = (item) => {
    if (totalXP < item.xpCost || purchased.includes(item.id)) return;

    const newXP = totalXP - item.xpCost;
    setTotalXP(newXP);
    localStorage.setItem('gamified_xp', newXP.toString());

    setPurchased(prev => [...prev, item.id]);
    setShowPurchaseModal(null);
    setPurchaseSuccess(true);
    setTimeout(() => setPurchaseSuccess(false), 3000);
  };

  const level = Math.floor(totalXP / 200) + 1;
  const xpProgress = ((totalXP % 200) / 200) * 100;
  const xpForNextLevel = level * 200;

  const filteredGoodies = filterCategory === 'all'
    ? goodiesCatalog
    : goodiesCatalog.filter(g => g.category === filterCategory);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'badges', label: 'Badges' },
    { id: 'certificates', label: 'Certificates' },
    { id: 'merchandise', label: 'Merch' },
    { id: 'study', label: 'Study Materials' },
    { id: 'sessions', label: 'Sessions' },
  ];

  const rarityColors = {
    common: '#71717a',
    rare: '#8b5cf6',
    epic: '#FD7333',
    legendary: '#06b6d4'
  };

  return (
    <div className="rewards-page page-enter">
      <div className="rewards-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(253, 115, 51, 0.08)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-15%', left: '10%', background: 'rgba(139, 92, 246, 0.06)', animationDelay: '-8s' }} />
        <div className="container">
          <div className="rewards-welcome">
            <div className="rewards-icon-wrap"><FaGem /></div>
            <div>
              <h1 className="rewards-heading">Rewards & Goodies 🎁</h1>
              <p className="rewards-subtext">Redeem your hard-earned XP for exclusive goodies and rewards!</p>
            </div>
          </div>

          {/* XP Balance Card */}
          <div className="xp-balance-card glass-card">
            <div className="xp-balance-left">
              <div className="xp-balance-icon"><HiOutlineFire /></div>
              <div>
                <span className="xp-balance-label">Your XP Balance</span>
                <span className="xp-balance-value">{totalXP} XP</span>
              </div>
            </div>
            <div className="xp-balance-right">
              <div className="xp-level-info">
                <HiOutlineStar /> Level {level}
              </div>
              <div className="xp-mini-bar">
                <div className="xp-mini-fill" style={{ width: `${xpProgress}%` }} />
              </div>
              <span className="xp-mini-text">{xpForNextLevel - (totalXP % 200 === 0 && totalXP > 0 ? 200 : totalXP % 200)} XP to next level</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container rewards-content">
        {/* Success Banner */}
        {purchaseSuccess && (
          <div className="purchase-success-banner">
            <HiOutlineCheckCircle /> 🎉 Item redeemed successfully! Check "My Rewards" to see it.
          </div>
        )}

        {/* Tabs */}
        <div className="rewards-tabs">
          <button className={`rewards-tab ${activeTab === 'store' ? 'active' : ''}`} onClick={() => setActiveTab('store')}>
            <HiOutlineShoppingCart /> Store
          </button>
          <button className={`rewards-tab ${activeTab === 'my-rewards' ? 'active' : ''}`} onClick={() => setActiveTab('my-rewards')}>
            <HiOutlineGift /> My Rewards
            {purchased.length > 0 && <span className="tab-badge">{purchased.length}</span>}
          </button>
          <button className={`rewards-tab ${activeTab === 'performance' ? 'active' : ''}`} onClick={() => setActiveTab('performance')}>
            <FaTrophy /> Performance Rewards
          </button>
        </div>

        {/* ====== STORE TAB ====== */}
        {activeTab === 'store' && (
          <div className="store-section">
            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-btn ${filterCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="goodies-grid">
              {filteredGoodies.map(item => {
                const isPurchased = purchased.includes(item.id);
                const canAfford = totalXP >= item.xpCost;
                return (
                  <div key={item.id} className={`goodie-card glass-card ${isPurchased ? 'purchased' : ''}`}>
                    <div className="goodie-media">
                      <span className="rarity-badge" style={{ color: rarityColors[item.rarity], borderColor: `${rarityColors[item.rarity]}40`, background: item.image ? `${rarityColors[item.rarity]}20` : `${rarityColors[item.rarity]}10` }}>
                        {item.rarity}
                      </span>
                      {item.image ? (
                        <div className="goodie-image-wrap">
                          <img src={item.image} alt={item.name} />
                        </div>
                      ) : (
                        <div className="goodie-icon-wrap" style={{ background: `${item.color}08` }}>
                          <div className="goodie-icon" style={{ background: `${item.color}15`, color: item.color }}>
                            {item.icon}
                          </div>
                        </div>
                      )}
                    </div>
                    <h3 className="goodie-name">{item.name}</h3>
                    <p className="goodie-desc">{item.description}</p>
                    <div className="goodie-footer">
                      <span className="goodie-price" style={{ color: item.color }}>
                        <HiOutlineFire /> {item.xpCost} XP
                      </span>
                      {isPurchased ? (
                        <span className="goodie-owned"><HiOutlineCheckCircle /> Owned</span>
                      ) : (
                        <button
                          className="goodie-buy-btn"
                          style={{ background: canAfford ? `linear-gradient(135deg, ${item.color}, ${item.color}cc)` : undefined }}
                          disabled={!canAfford}
                          onClick={() => setShowPurchaseModal(item)}
                        >
                          {canAfford ? 'Redeem' : 'Not Enough XP'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====== MY REWARDS TAB ====== */}
        {activeTab === 'my-rewards' && (
          <div className="my-rewards-section">
            {purchased.length === 0 && earned.length === 0 ? (
              <div className="empty-rewards glass-card">
                <HiOutlineGift style={{ fontSize: '3rem', opacity: 0.3 }} />
                <h3>No rewards yet</h3>
                <p>Visit the store to redeem your XP for goodies!</p>
                <button className="btn-go-store" onClick={() => setActiveTab('store')}>Browse Store</button>
              </div>
            ) : (
              <div className="owned-items-grid">
                {purchased.map(id => {
                  const item = goodiesCatalog.find(g => g.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="owned-item glass-card">
                      <div className="owned-item-icon" style={{ background: `${item.color}15`, color: item.color }}>
                        {item.icon}
                      </div>
                      <div className="owned-item-info">
                        <h4 className="owned-item-name">{item.name}</h4>
                        <p className="owned-item-desc">{item.description}</p>
                        <span className="owned-item-badge"><HiOutlineCheckCircle /> Redeemed</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ====== PERFORMANCE REWARDS TAB ====== */}
        {activeTab === 'performance' && (
          <div className="performance-section">
            <p className="performance-intro">
              These rewards are automatically earned based on your learning performance. Keep playing, learning, and achieving! 🚀
            </p>
            <div className="performance-grid">
              {performanceRewards.map(pr => {
                const isEarned = earned.includes(pr.threshold);
                return (
                  <div key={pr.id} className={`performance-card glass-card ${isEarned ? 'earned' : 'locked'}`}>
                    <div className="performance-card-icon" style={isEarned ? { background: `${pr.color}15` } : {}}>
                      <span style={{ fontSize: '2rem' }}>{pr.icon}</span>
                    </div>
                    <div className="performance-card-info">
                      <h4 className="performance-card-name">{pr.name}</h4>
                      <p className="performance-card-desc">{pr.description}</p>
                    </div>
                    <div className="performance-card-status">
                      {isEarned ? (
                        <span className="performance-earned"><HiOutlineBadgeCheck /> Earned!</span>
                      ) : (
                        <span className="performance-locked">🔒 Locked</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ====== PURCHASE CONFIRMATION MODAL ====== */}
      {showPurchaseModal && (
        <div className="purchase-overlay" onClick={() => setShowPurchaseModal(null)}>
          <div className="purchase-modal glass-card" onClick={e => e.stopPropagation()}>
            {showPurchaseModal.image ? (
              <div className="purchase-modal-image-wrap">
                <img src={showPurchaseModal.image} alt={showPurchaseModal.name} />
              </div>
            ) : (
              <div className="purchase-modal-icon" style={{ background: `${showPurchaseModal.color}15`, color: showPurchaseModal.color }}>
                {showPurchaseModal.icon}
              </div>
            )}
            <h2 className="purchase-modal-title">Confirm Redemption</h2>
            <p className="purchase-modal-item">{showPurchaseModal.name}</p>
            <div className="purchase-modal-cost">
              <span>Cost:</span>
              <span className="purchase-modal-xp" style={{ color: showPurchaseModal.color }}>
                <HiOutlineFire /> {showPurchaseModal.xpCost} XP
              </span>
            </div>
            <div className="purchase-modal-balance">
              <span>Your Balance:</span>
              <span>{totalXP} XP</span>
            </div>
            <div className="purchase-modal-remaining">
              <span>After Purchase:</span>
              <span>{totalXP - showPurchaseModal.xpCost} XP</span>
            </div>
            <div className="purchase-modal-actions">
              <button className="btn-cancel-purchase" onClick={() => setShowPurchaseModal(null)}>Cancel</button>
              <button
                className="btn-confirm-purchase"
                style={{ background: `linear-gradient(135deg, ${showPurchaseModal.color}, ${showPurchaseModal.color}cc)` }}
                onClick={() => handlePurchase(showPurchaseModal)}
              >
                <HiOutlineShoppingCart /> Confirm & Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
