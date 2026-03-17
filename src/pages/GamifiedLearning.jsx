import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineLightningBolt, HiOutlineClock, HiOutlineCheckCircle,
  HiOutlineXCircle, HiOutlineArrowLeft, HiOutlineStar, HiOutlineFire
} from 'react-icons/hi';
import { FaGamepad, FaBrain, FaBolt, FaPuzzlePiece, FaTrophy, FaMedal, FaRedo } from 'react-icons/fa';
import './GamifiedLearning.css';

// ===== GAME DATA =====

const wordScrambles = [
  { scrambled: 'TPHOOYSNHSIE', answer: 'PHOTOSYNTHESIS', hint: 'How plants make food', category: 'Biology' },
  { scrambled: 'MLCEUOEL', answer: 'MOLECULE', hint: 'Smallest unit of a compound', category: 'Chemistry' },
  { scrambled: 'GAVIRTY', answer: 'GRAVITY', hint: 'Force that pulls objects down', category: 'Physics' },
  { scrambled: 'MEOTGYER', answer: 'GEOMETRY', hint: 'Study of shapes', category: 'Math' },
  { scrambled: 'RONCUDET', answer: 'CONDUCTER', hint: 'Material that allows electricity to flow', category: 'Physics' },
  { scrambled: 'MITOHCODRIAN', answer: 'MITOCHONDRIA', hint: 'Powerhouse of the cell', category: 'Biology' },
  { scrambled: 'CFERATOIN', answer: 'FRACTION', hint: 'Part of a whole number', category: 'Math' },
  { scrambled: 'EXOGYN', answer: 'OXYGEN', hint: 'We breathe this gas', category: 'Chemistry' },
];

const memoryCards = [
  { id: 1, content: 'H₂O', match: 'Water' },
  { id: 2, content: 'Water', match: 'H₂O' },
  { id: 3, content: 'NaCl', match: 'Salt' },
  { id: 4, content: 'Salt', match: 'NaCl' },
  { id: 5, content: 'CO₂', match: 'Carbon Dioxide' },
  { id: 6, content: 'Carbon Dioxide', match: 'CO₂' },
  { id: 7, content: 'O₂', match: 'Oxygen' },
  { id: 8, content: 'Oxygen', match: 'O₂' },
  { id: 9, content: 'Fe', match: 'Iron' },
  { id: 10, content: 'Iron', match: 'Fe' },
  { id: 11, content: 'Au', match: 'Gold' },
  { id: 12, content: 'Gold', match: 'Au' },
];

const speedMathProblems = [
  { q: '12 × 8 = ?', answer: 96 },
  { q: '144 ÷ 12 = ?', answer: 12 },
  { q: '25 + 37 = ?', answer: 62 },
  { q: '100 - 43 = ?', answer: 57 },
  { q: '15 × 6 = ?', answer: 90 },
  { q: '81 ÷ 9 = ?', answer: 9 },
  { q: '56 + 78 = ?', answer: 134 },
  { q: '200 - 87 = ?', answer: 113 },
  { q: '11 × 11 = ?', answer: 121 },
  { q: '225 ÷ 15 = ?', answer: 15 },
  { q: '99 + 88 = ?', answer: 187 },
  { q: '17 × 4 = ?', answer: 68 },
];

const trueFalseQs = [
  { statement: 'The sun is a star.', answer: true, explanation: 'The Sun is a G-type main-sequence star (G2V).' },
  { statement: 'Sound travels faster than light.', answer: false, explanation: 'Light travels at ~3×10⁸ m/s, much faster than sound (~343 m/s).' },
  { statement: 'DNA is a double helix.', answer: true, explanation: 'Watson & Crick discovered the double helix structure of DNA in 1953.' },
  { statement: 'Electrons are larger than protons.', answer: false, explanation: 'Protons are ~1836 times heavier than electrons.' },
  { statement: 'Water boils at 100°C at sea level.', answer: true, explanation: 'At standard atmospheric pressure, water boils at exactly 100°C.' },
  { statement: 'Jupiter is the smallest planet.', answer: false, explanation: 'Jupiter is the largest planet in our solar system.' },
  { statement: 'Mitosis produces two identical cells.', answer: true, explanation: 'Mitosis results in two genetically identical daughter cells.' },
  { statement: 'The chemical formula for glucose is C₆H₁₂O₆.', answer: true, explanation: 'Glucose (a simple sugar) has the formula C₆H₁₂O₆.' },
  { statement: 'Velocity and speed are the same thing.', answer: false, explanation: 'Velocity includes direction; speed is just scalar magnitude.' },
  { statement: 'Photosynthesis occurs in the nucleus.', answer: false, explanation: 'Photosynthesis occurs in the chloroplasts.' },
];

// ===== GAMES CONFIG =====
const games = [
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    description: 'Unscramble the letters to form science & math terms',
    icon: <FaPuzzlePiece />,
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    xp: 50,
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Match chemical formulas with their names',
    icon: <FaBrain />,
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    xp: 75,
  },
  {
    id: 'speed-math',
    title: 'Speed Math',
    description: 'Solve math problems as fast as you can!',
    icon: <FaBolt />,
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    xp: 60,
  },
  {
    id: 'true-false',
    title: 'True or False',
    description: 'Test your knowledge with quick-fire questions',
    icon: <HiOutlineLightningBolt />,
    color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    xp: 40,
  },
];

// ===== SHUFFLE UTILITY =====
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===== MAIN COMPONENT =====
export default function GamifiedLearning() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeGame, setActiveGame] = useState(null);
  const [totalXP, setTotalXP] = useState(() => {
    const saved = localStorage.getItem('gamified_xp');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  useEffect(() => {
    localStorage.setItem('gamified_xp', totalXP.toString());
  }, [totalXP]);

  const addXP = (amount) => setTotalXP(prev => prev + amount);

  const level = Math.floor(totalXP / 200) + 1;
  const xpForNextLevel = level * 200;
  const xpProgress = ((totalXP % 200) / 200) * 100;

  if (!user) return null;

  // ===== GAME SELECTION MENU =====
  if (!activeGame) {
    return (
      <div className="gamified-page page-enter">
        <div className="gamified-hero">
          <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(139, 92, 246, 0.08)' }} />
          <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-15%', left: '10%', background: 'rgba(16, 185, 129, 0.06)', animationDelay: '-8s' }} />
          <div className="container">
            <div className="gamified-welcome">
              <div className="gamified-icon-wrap"><FaGamepad /></div>
              <div>
                <h1 className="gamified-heading">Gamified Learning 🎮</h1>
                <p className="gamified-subtext">Learn through fun interactive games — earn XP, level up, and master concepts!</p>
              </div>
            </div>

            {/* XP / Level Bar */}
            <div className="xp-bar-container glass-card">
              <div className="xp-bar-info">
                <div className="xp-level-badge">
                  <HiOutlineStar /> Level {level}
                </div>
                <span className="xp-text">{totalXP} XP &middot; {xpForNextLevel - (totalXP % 200 === 0 && totalXP > 0 ? 200 : totalXP % 200)} XP to next level</span>
              </div>
              <div className="xp-progress-bar">
                <div className="xp-progress-fill" style={{ width: `${xpProgress}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="container gamified-content">
          <div className="games-grid">
            {games.map(game => (
              <div key={game.id} className="game-card glass-card" onClick={() => setActiveGame(game.id)}>
                <div className="game-card-icon" style={{ background: `${game.color}20`, color: game.color }}>
                  {game.icon}
                </div>
                <h3 className="game-card-title">{game.title}</h3>
                <p className="game-card-desc">{game.description}</p>
                <div className="game-card-footer">
                  <span className="game-xp-badge" style={{ color: game.color }}>
                    <HiOutlineFire /> +{game.xp} XP
                  </span>
                  <button className="game-play-btn" style={{ background: game.gradient }}>Play →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== RENDER ACTIVE GAME =====
  return (
    <div className="gamified-page page-enter">
      <div className="container game-container">
        {activeGame === 'word-scramble' && <WordScrambleGame onBack={() => setActiveGame(null)} onXP={addXP} />}
        {activeGame === 'memory-match' && <MemoryMatchGame onBack={() => setActiveGame(null)} onXP={addXP} />}
        {activeGame === 'speed-math' && <SpeedMathGame onBack={() => setActiveGame(null)} onXP={addXP} />}
        {activeGame === 'true-false' && <TrueFalseGame onBack={() => setActiveGame(null)} onXP={addXP} />}
      </div>
    </div>
  );
}


// =======================================
// GAME 1: WORD SCRAMBLE
// =======================================
function WordScrambleGame({ onBack, onXP }) {
  const [words] = useState(() => shuffle(wordScrambles).slice(0, 5));
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, [current]);

  const checkAnswer = (e) => {
    e.preventDefault();
    const isCorrect = input.trim().toUpperCase() === words[current].answer;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => {
      setFeedback(null);
      setInput('');
      setShowHint(false);
      if (current + 1 >= words.length) {
        const earnedXP = (score + (isCorrect ? 1 : 0)) * 10;
        onXP(earnedXP);
        setFinished(true);
      } else {
        setCurrent(c => c + 1);
      }
    }, 1200);
  };

  if (finished) {
    return (
      <GameResults
        title="Word Scramble"
        color="#8b5cf6"
        score={score}
        total={words.length}
        xpEarned={score * 10}
        onBack={onBack}
        onRetry={() => { setCurrent(0); setScore(0); setFinished(false); setInput(''); }}
      />
    );
  }

  const word = words[current];
  return (
    <div className="game-active glass-card">
      <GameHeader title="Word Scramble" icon={<FaPuzzlePiece />} color="#8b5cf6" current={current + 1} total={words.length} onBack={onBack} />
      <div className="scramble-category">{word.category}</div>
      <div className={`scramble-letters ${feedback === 'correct' ? 'shake-correct' : feedback === 'wrong' ? 'shake-wrong' : ''}`}>
        {word.scrambled.split('').map((letter, i) => (
          <span key={i} className="scramble-letter" style={{ animationDelay: `${i * 0.05}s` }}>{letter}</span>
        ))}
      </div>
      {showHint && <div className="scramble-hint">💡 Hint: {word.hint}</div>}
      <form onSubmit={checkAnswer} className="scramble-form">
        <input
          ref={inputRef}
          type="text"
          className="scramble-input"
          placeholder="Type your answer..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={feedback !== null}
        />
        <div className="scramble-actions">
          <button type="button" className="hint-btn" onClick={() => setShowHint(true)} disabled={showHint}>
            💡 Hint
          </button>
          <button type="submit" className="submit-answer-btn" style={{ background: '#8b5cf6' }} disabled={!input.trim() || feedback !== null}>
            Check Answer
          </button>
        </div>
      </form>
      {feedback && (
        <div className={`feedback-toast ${feedback}`}>
          {feedback === 'correct' ? <><HiOutlineCheckCircle /> Correct! 🎉</> : <><HiOutlineXCircle /> Wrong! Answer: {word.answer}</>}
        </div>
      )}
    </div>
  );
}


// =======================================
// GAME 2: MEMORY MATCH
// =======================================
function MemoryMatchGame({ onBack, onXP }) {
  const [cards, setCards] = useState(() => shuffle(memoryCards).map((c, i) => ({ ...c, uid: i, flipped: false, matched: false })));
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [finished, setFinished] = useState(false);
  const totalPairs = memoryCards.length / 2;

  const handleFlip = (uid) => {
    if (flippedCards.length >= 2) return;
    const card = cards.find(c => c.uid === uid);
    if (card.flipped || card.matched) return;

    const updated = cards.map(c => c.uid === uid ? { ...c, flipped: true } : c);
    setCards(updated);
    const newFlipped = [...flippedCards, card];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = newFlipped;
      if (a.content === b.match) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            (c.uid === a.uid || c.uid === b.uid) ? { ...c, matched: true } : c
          ));
          setMatchedPairs(p => {
            const newP = p + 1;
            if (newP >= totalPairs) {
              const earnedXP = Math.max(75 - moves, 20);
              onXP(earnedXP);
              setFinished(true);
            }
            return newP;
          });
          setFlippedCards([]);
        }, 600);
      } else {
        // No match, flip back
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            (c.uid === a.uid || c.uid === b.uid) ? { ...c, flipped: false } : c
          ));
          setFlippedCards([]);
        }, 800);
      }
    }
  };

  if (finished) {
    return (
      <GameResults
        title="Memory Match"
        color="#10b981"
        score={totalPairs}
        total={totalPairs}
        xpEarned={Math.max(75 - moves, 20)}
        extraStat={`${moves} moves`}
        onBack={onBack}
        onRetry={() => {
          setCards(shuffle(memoryCards).map((c, i) => ({ ...c, uid: i, flipped: false, matched: false })));
          setFlippedCards([]);
          setMoves(0);
          setMatchedPairs(0);
          setFinished(false);
        }}
      />
    );
  }

  return (
    <div className="game-active glass-card">
      <GameHeader title="Memory Match" icon={<FaBrain />} color="#10b981" current={matchedPairs} total={totalPairs} onBack={onBack} label="Pairs" />
      <div className="memory-stats">
        <span>Moves: <strong>{moves}</strong></span>
        <span>Pairs: <strong>{matchedPairs}/{totalPairs}</strong></span>
      </div>
      <div className="memory-grid">
        {cards.map(card => (
          <div
            key={card.uid}
            className={`memory-card ${card.flipped || card.matched ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
            onClick={() => handleFlip(card.uid)}
          >
            <div className="memory-card-inner">
              <div className="memory-card-front">?</div>
              <div className="memory-card-back">{card.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// =======================================
// GAME 3: SPEED MATH
// =======================================
function SpeedMathGame({ onBack, onXP }) {
  const [problems] = useState(() => shuffle(speedMathProblems).slice(0, 8));
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, [current]);

  useEffect(() => {
    if (finished || feedback) return;
    if (timer <= 0) {
      handleTimeout();
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, finished, feedback]);

  const handleTimeout = () => {
    setFeedback('wrong');
    setTimeout(() => moveNext(), 1000);
  };

  const moveNext = () => {
    setFeedback(null);
    setInput('');
    setTimer(10);
    if (current + 1 >= problems.length) {
      const earnedXP = score * 8;
      onXP(earnedXP);
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
    }
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    const isCorrect = parseInt(input) === problems[current].answer;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => moveNext(), 1000);
  };

  if (finished) {
    return (
      <GameResults
        title="Speed Math"
        color="#f59e0b"
        score={score}
        total={problems.length}
        xpEarned={score * 8}
        onBack={onBack}
        onRetry={() => { setCurrent(0); setScore(0); setTimer(10); setFinished(false); setInput(''); }}
      />
    );
  }

  const problem = problems[current];
  return (
    <div className="game-active glass-card">
      <GameHeader title="Speed Math" icon={<FaBolt />} color="#f59e0b" current={current + 1} total={problems.length} onBack={onBack} />
      <div className={`speed-timer ${timer <= 3 ? 'timer-danger' : ''}`}>
        <HiOutlineClock /> {timer}s
      </div>
      <div className={`speed-problem ${feedback === 'correct' ? 'shake-correct' : feedback === 'wrong' ? 'shake-wrong' : ''}`}>
        {problem.q}
      </div>
      <form onSubmit={checkAnswer} className="speed-form">
        <input
          ref={inputRef}
          type="number"
          className="speed-input"
          placeholder="Your answer"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={feedback !== null}
        />
        <button type="submit" className="submit-answer-btn" style={{ background: '#f59e0b' }} disabled={!input.trim() || feedback !== null}>
          Submit
        </button>
      </form>
      {feedback && (
        <div className={`feedback-toast ${feedback}`}>
          {feedback === 'correct' ? <><HiOutlineCheckCircle /> Correct! ⚡</> : <><HiOutlineXCircle /> Answer: {problem.answer}</>}
        </div>
      )}
    </div>
  );
}


// =======================================
// GAME 4: TRUE OR FALSE
// =======================================
function TrueFalseGame({ onBack, onXP }) {
  const [questions] = useState(() => shuffle(trueFalseQs).slice(0, 6));
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswer = (ans) => {
    if (feedback) return;
    setSelectedAnswer(ans);
    const isCorrect = ans === questions[current].answer;
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      setSelectedAnswer(null);
      if (current + 1 >= questions.length) {
        const earnedXP = (score + (isCorrect ? 1 : 0)) * 7;
        onXP(earnedXP);
        setFinished(true);
      } else {
        setCurrent(c => c + 1);
      }
    }, 1800);
  };

  if (finished) {
    return (
      <GameResults
        title="True or False"
        color="#ef4444"
        score={score}
        total={questions.length}
        xpEarned={score * 7}
        onBack={onBack}
        onRetry={() => { setCurrent(0); setScore(0); setFinished(false); setSelectedAnswer(null); }}
      />
    );
  }

  const q = questions[current];
  return (
    <div className="game-active glass-card">
      <GameHeader title="True or False" icon={<HiOutlineLightningBolt />} color="#ef4444" current={current + 1} total={questions.length} onBack={onBack} />
      <div className="tf-statement">{q.statement}</div>
      <div className="tf-buttons">
        <button
          className={`tf-btn tf-true ${selectedAnswer === true ? (feedback === 'correct' ? 'btn-correct' : 'btn-wrong') : ''} ${feedback && q.answer === true ? 'btn-correct' : ''}`}
          onClick={() => handleAnswer(true)}
          disabled={feedback !== null}
        >
          <HiOutlineCheckCircle /> True
        </button>
        <button
          className={`tf-btn tf-false ${selectedAnswer === false ? (feedback === 'correct' ? 'btn-correct' : 'btn-wrong') : ''} ${feedback && q.answer === false ? 'btn-correct' : ''}`}
          onClick={() => handleAnswer(false)}
          disabled={feedback !== null}
        >
          <HiOutlineXCircle /> False
        </button>
      </div>
      {feedback && (
        <div className={`feedback-toast ${feedback}`}>
          {feedback === 'correct' ? '✅ Correct!' : '❌ Wrong!'} — {q.explanation}
        </div>
      )}
    </div>
  );
}


// =======================================
// SHARED COMPONENTS
// =======================================

function GameHeader({ title, icon, color, current, total, onBack, label = 'Question' }) {
  const progress = (current / total) * 100;
  return (
    <div className="game-header-section">
      <div className="game-header-row">
        <button className="game-back-btn" onClick={onBack}><HiOutlineArrowLeft /> Back</button>
        <span className="game-title-badge" style={{ background: `${color}20`, color }}>{icon} {title}</span>
        <span className="game-counter">{label} {current}/{total}</span>
      </div>
      <div className="game-progress-bar">
        <div className="game-progress-fill" style={{ width: `${progress}%`, background: color }} />
      </div>
    </div>
  );
}

function GameResults({ title, color, score, total, xpEarned, extraStat, onBack, onRetry }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="game-results glass-card">
      <div className="game-results-trophy">
        {pct >= 70 ? <FaTrophy style={{ color: '#fbbf24' }} /> : <FaMedal style={{ color: '#a78bfa' }} />}
      </div>
      <h2 className="game-results-title">Game Over!</h2>
      <p className="game-results-subtitle" style={{ color }}>{title}</p>

      <div className="game-results-ring" style={{ borderColor: color }}>
        <span className="game-results-pct">{pct}%</span>
      </div>

      <div className="game-results-stats">
        <div className="game-results-stat">
          <HiOutlineCheckCircle style={{ color: '#10b981' }} /> {score} Correct
        </div>
        <div className="game-results-stat">
          <HiOutlineXCircle style={{ color: '#ef4444' }} /> {total - score} Wrong
        </div>
        {extraStat && (
          <div className="game-results-stat">
            <HiOutlineClock style={{ color: '#f59e0b' }} /> {extraStat}
          </div>
        )}
      </div>

      <div className="game-results-xp">
        <HiOutlineFire style={{ color: '#f59e0b' }} /> +{xpEarned} XP Earned!
      </div>

      <div className="game-results-actions">
        <button className="game-retry-btn" style={{ borderColor: color, color }} onClick={onRetry}>
          <FaRedo /> Play Again
        </button>
        <button className="game-menu-btn" onClick={onBack}>
          All Games
        </button>
      </div>
    </div>
  );
}
