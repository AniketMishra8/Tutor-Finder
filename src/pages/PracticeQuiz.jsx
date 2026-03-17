import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineAcademicCap, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowLeft, HiOutlineClock, HiOutlineLightningBolt, HiOutlineShieldCheck, HiOutlineExclamation } from 'react-icons/hi';
import { FaFlask, FaDna, FaCalculator, FaAtom, FaMedal, FaTrophy, FaLock } from 'react-icons/fa';
import './PracticeQuiz.css';

// ====== QUIZ DATA ======
const quizzes = {
  math: {
    title: 'Mathematics',
    icon: <FaCalculator />,
    color: '#FD7333',
    description: 'Algebra, Geometry, Calculus & more',
    questions: [
      { q: 'What is the value of x in: 2x + 6 = 18?', options: ['4', '6', '8', '12'], answer: 1 },
      { q: 'What is the derivative of x³?', options: ['x²', '3x²', '3x', '2x³'], answer: 1 },
      { q: 'If a triangle has angles 90° and 45°, what is the third angle?', options: ['30°', '45°', '60°', '90°'], answer: 1 },
      { q: 'What is the value of √144?', options: ['11', '12', '13', '14'], answer: 1 },
      { q: 'What is 15% of 200?', options: ['25', '30', '35', '40'], answer: 1 },
      { q: 'Solve: 5! = ?', options: ['60', '100', '120', '150'], answer: 2 },
      { q: 'What is the area of a circle with radius 7? (use π ≈ 22/7)', options: ['144', '154', '164', '174'], answer: 1 },
      { q: 'What is log₁₀(1000)?', options: ['2', '3', '4', '10'], answer: 1 },
      { q: 'In an arithmetic sequence 2, 5, 8, 11... what is the 10th term?', options: ['26', '29', '32', '35'], answer: 1 },
      { q: 'What is the integral of 2x dx?', options: ['x', 'x²', 'x² + C', '2x² + C'], answer: 2 },
    ]
  },
  biology: {
    title: 'Biology',
    icon: <FaDna />,
    color: '#10b981',
    description: 'Cell Biology, Genetics, Ecology',
    questions: [
      { q: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'], answer: 2 },
      { q: 'DNA stands for?', options: ['DiNucleic Acid', 'DeoxyriboNucleic Acid', 'DiNitro Acid', 'DeNaturized Acid'], answer: 1 },
      { q: 'Which blood cells fight infection?', options: ['Red blood cells', 'Platelets', 'White blood cells', 'Plasma'], answer: 2 },
      { q: 'Photosynthesis takes place in which organelle?', options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Vacuole'], answer: 2 },
      { q: 'How many chromosomes do humans have?', options: ['23', '44', '46', '48'], answer: 2 },
      { q: 'What is the largest organ in the human body?', options: ['Liver', 'Brain', 'Skin', 'Heart'], answer: 2 },
      { q: 'Which vitamin is produced when skin is exposed to sunlight?', options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], answer: 3 },
      { q: 'What is the process by which cells divide?', options: ['Osmosis', 'Mitosis', 'Diffusion', 'Photosynthesis'], answer: 1 },
      { q: 'Which part of the brain controls balance?', options: ['Cerebrum', 'Cerebellum', 'Medulla', 'Hypothalamus'], answer: 1 },
      { q: 'What molecule carries genetic information?', options: ['RNA', 'DNA', 'ATP', 'Protein'], answer: 1 },
    ]
  },
  chemistry: {
    title: 'Chemistry',
    icon: <FaFlask />,
    color: '#8b5cf6',
    description: 'Elements, Reactions, Organic Chemistry',
    questions: [
      { q: 'What is the chemical symbol for Gold?', options: ['Go', 'Gd', 'Au', 'Ag'], answer: 2 },
      { q: 'What is the pH of pure water?', options: ['5', '7', '9', '14'], answer: 1 },
      { q: 'How many elements are in the periodic table (approx)?', options: ['100', '108', '118', '128'], answer: 2 },
      { q: 'What is the chemical formula for table salt?', options: ['NaOH', 'NaCl', 'KCl', 'HCl'], answer: 1 },
      { q: 'Which gas is most abundant in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'], answer: 2 },
      { q: 'What type of bond is formed by sharing electrons?', options: ['Ionic', 'Metallic', 'Covalent', 'Hydrogen'], answer: 2 },
      { q: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], answer: 1 },
      { q: 'Rusting of iron is an example of?', options: ['Physical change', 'Oxidation', 'Reduction', 'Sublimation'], answer: 1 },
      { q: 'Which acid is found in the stomach?', options: ['Sulfuric acid', 'Nitric acid', 'Hydrochloric acid', 'Acetic acid'], answer: 2 },
      { q: 'What is Avogadro\'s number approximately?', options: ['6.02 × 10²³', '6.02 × 10²²', '3.14 × 10²³', '9.8 × 10²³'], answer: 0 },
    ]
  }
};

const MAX_VIOLATIONS = 3;

export default function PracticeQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(30);
  const [quizFinished, setQuizFinished] = useState(false);

  // Screen lock states
  const [showFocusPrompt, setShowFocusPrompt] = useState(false);
  const [pendingQuizKey, setPendingQuizKey] = useState(null);
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const quizActiveRef = useRef(false);
  const violationCountRef = useRef(0);

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!selectedQuiz || showResult || quizFinished) return;
    if (timer <= 0) {
      handleNext();
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, selectedQuiz, showResult, quizFinished]);

  // ====== SCREEN LOCK: Visibility API + beforeunload ======
  useEffect(() => {
    const isQuizActive = selectedQuiz && !quizFinished;
    quizActiveRef.current = isQuizActive;

    if (!isQuizActive) return;

    const handleVisibilityChange = () => {
      if (!quizActiveRef.current) return;
      if (document.hidden) {
        violationCountRef.current += 1;
        setViolationCount(violationCountRef.current);
        setShowViolationWarning(true);

        if (violationCountRef.current >= MAX_VIOLATIONS) {
          setAutoSubmitted(true);
          setQuizFinished(true);
        }
      }
    };

    const handleBeforeUnload = (e) => {
      if (!quizActiveRef.current) return;
      e.preventDefault();
      e.returnValue = 'You have an active quiz! Leaving will count as a violation.';
    };

    // Block keyboard shortcuts for tab switching
    const handleKeyDown = (e) => {
      if (!quizActiveRef.current) return;
      // Block Ctrl+Tab, Ctrl+W, Alt+Tab, Alt+F4
      if ((e.ctrlKey && (e.key === 'Tab' || e.key === 'w' || e.key === 'W')) ||
          (e.altKey && (e.key === 'Tab' || e.key === 'F4'))) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [selectedQuiz, quizFinished]);

  const dismissWarning = () => {
    setShowViolationWarning(false);
  };

  const requestStartQuiz = (key) => {
    setPendingQuizKey(key);
    setShowFocusPrompt(true);
  };

  const confirmFocusAndStart = () => {
    setShowFocusPrompt(false);
    startQuiz(pendingQuizKey);
    setPendingQuizKey(null);
  };

  const cancelFocusPrompt = () => {
    setShowFocusPrompt(false);
    setPendingQuizKey(null);
  };

  const startQuiz = (key) => {
    setSelectedQuiz(key);
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setTimer(30);
    setQuizFinished(false);
    setViolationCount(0);
    violationCountRef.current = 0;
    setAutoSubmitted(false);
    setShowViolationWarning(false);
  };

  const handleAnswer = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    const isCorrect = index === quizzes[selectedQuiz].questions[currentQ].answer;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, { selected: index, correct: quizzes[selectedQuiz].questions[currentQ].answer, isCorrect }]);
  };

  const handleNext = () => {
    const quiz = quizzes[selectedQuiz];
    if (currentQ + 1 >= quiz.questions.length) {
      // If timed out without answering
      if (!showResult) {
        setAnswers(prev => [...prev, { selected: -1, correct: quiz.questions[currentQ].answer, isCorrect: false }]);
      }
      setQuizFinished(true);
    } else {
      if (!showResult) {
        setAnswers(prev => [...prev, { selected: -1, correct: quiz.questions[currentQ].answer, isCorrect: false }]);
      }
      setCurrentQ(q => q + 1);
      setSelected(null);
      setShowResult(false);
      setTimer(30);
    }
  };

  const backToMenu = () => {
    setSelectedQuiz(null);
    setQuizFinished(false);
  };

  if (!user) return null;

  // ====== FOCUS COMMITMENT PROMPT ======
  if (showFocusPrompt) {
    return (
      <div className="practice-page page-enter">
        <div className="screen-lock-overlay">
          <div className="focus-prompt-card glass-card">
            <div className="focus-prompt-icon">
              <FaLock />
            </div>
            <h2 className="focus-prompt-title">🔒 Focus Mode Required</h2>
            <p className="focus-prompt-text">
              This quiz requires your full attention. Once you start:
            </p>
            <ul className="focus-prompt-rules">
              <li><HiOutlineExclamation className="rule-icon warning" /> Switching tabs will be <strong>detected and counted</strong></li>
              <li><HiOutlineExclamation className="rule-icon warning" /> After <strong>{MAX_VIOLATIONS} violations</strong>, the quiz will auto-submit</li>
              <li><HiOutlineShieldCheck className="rule-icon success" /> Stay focused to get the best score!</li>
            </ul>
            <div className="focus-prompt-actions">
              <button className="btn-cancel-focus" onClick={cancelFocusPrompt}>Cancel</button>
              <button className="btn-accept-focus" onClick={confirmFocusAndStart}>
                <FaLock /> I'm Ready — Start Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====== QUIZ SELECTION MENU ======
  if (!selectedQuiz) {
    return (
      <div className="practice-page page-enter">
        <div className="practice-hero">
          <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(253, 115, 51, 0.08)' }} />
          <div className="container">
            <div className="practice-welcome">
              <div className="practice-icon-wrap"><HiOutlineAcademicCap /></div>
              <div>
                <h1 className="practice-heading">Practice & Quizzes 🧠</h1>
                <p className="practice-subtext">Sharpen your skills with interactive quizzes in Math, Biology & Chemistry</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container practice-content">
          <div className="quiz-grid">
            {Object.entries(quizzes).map(([key, quiz]) => (
              <div key={key} className="quiz-card glass-card" onClick={() => requestStartQuiz(key)}>
                <div className="quiz-card-icon" style={{ background: `${quiz.color}20`, color: quiz.color }}>
                  {quiz.icon}
                </div>
                <h3 className="quiz-card-title">{quiz.title}</h3>
                <p className="quiz-card-desc">{quiz.description}</p>
                <div className="quiz-card-meta">
                  <span>{quiz.questions.length} Questions</span>
                  <span>~{quiz.questions.length * 0.5} min</span>
                </div>
                <div className="quiz-card-lock-badge"><FaLock /> Focus Mode</div>
                <button className="quiz-start-btn" style={{ background: quiz.color }}>Start Quiz →</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const quiz = quizzes[selectedQuiz];
  const question = quiz.questions[currentQ];

  // ====== QUIZ FINISHED / RESULTS ======
  if (quizFinished) {
    const pct = Math.round((score / quiz.questions.length) * 100);
    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    return (
      <div className="practice-page page-enter">
        <div className="container quiz-results-container">
          <div className="quiz-results glass-card">
            {autoSubmitted && (
              <div className="auto-submit-banner">
                <HiOutlineExclamation />
                <span>Quiz was auto-submitted due to {MAX_VIOLATIONS} tab-switch violations</span>
              </div>
            )}
            <div className="results-trophy">
              {pct >= 70 ? <FaTrophy style={{ color: '#fbbf24' }} /> : <FaMedal style={{ color: '#a78bfa' }} />}
            </div>
            <h2 className="results-title">{autoSubmitted ? 'Quiz Auto-Submitted!' : 'Quiz Complete!'}</h2>
            <p className="results-subject" style={{ color: quiz.color }}>{quiz.title}</p>
            
            <div className="results-score-ring" style={{ borderColor: autoSubmitted ? '#ef4444' : quiz.color }}>
              <span className="results-score-number">{pct}%</span>
              <span className="results-grade">Grade: {grade}</span>
            </div>

            <div className="results-stats">
              <div className="results-stat">
                <HiOutlineCheckCircle style={{ color: '#10b981' }} />
                <span>{score} Correct</span>
              </div>
              <div className="results-stat">
                <HiOutlineXCircle style={{ color: '#ef4444' }} />
                <span>{quiz.questions.length - score} Wrong</span>
              </div>
              {violationCount > 0 && (
                <div className="results-stat">
                  <HiOutlineExclamation style={{ color: '#f59e0b' }} />
                  <span>{violationCount} Violation{violationCount > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            <div className="results-review">
              <h3>Answer Review</h3>
              {quiz.questions.map((q, i) => (
                <div key={i} className={`review-item ${answers[i]?.isCorrect ? 'review-correct' : 'review-wrong'}`}>
                  <span className="review-num">Q{i + 1}</span>
                  <span className="review-text">{q.q}</span>
                  <span className="review-icon">
                    {answers[i]?.isCorrect ? <HiOutlineCheckCircle /> : <HiOutlineXCircle />}
                  </span>
                </div>
              ))}
            </div>

            <div className="results-actions">
              <button className="btn-retry" style={{ borderColor: quiz.color, color: quiz.color }} onClick={() => startQuiz(selectedQuiz)}>
                Retry Quiz
              </button>
              <button className="btn-back-menu" onClick={backToMenu}>
                All Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ====== ACTIVE QUIZ QUESTION ======
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  return (
    <div className="practice-page page-enter">
      {/* Violation Warning Overlay */}
      {showViolationWarning && (
        <div className="violation-overlay">
          <div className="violation-card glass-card">
            <div className="violation-icon-pulse">
              <HiOutlineExclamation />
            </div>
            <h2 className="violation-title">⚠️ Tab Switch Detected!</h2>
            <p className="violation-text">
              You switched away from the quiz. This has been recorded.
            </p>
            <div className="violation-counter">
              <span className="violation-count">{violationCount}</span>
              <span className="violation-max">/ {MAX_VIOLATIONS}</span>
            </div>
            <p className="violation-warning-text">
              {MAX_VIOLATIONS - violationCount > 0
                ? `${MAX_VIOLATIONS - violationCount} more violation${MAX_VIOLATIONS - violationCount > 1 ? 's' : ''} and the quiz will be auto-submitted!`
                : 'Quiz has been auto-submitted!'}
            </p>
            <button className="btn-dismiss-violation" onClick={dismissWarning}>
              I Understand — Continue Quiz
            </button>
          </div>
        </div>
      )}

      {/* Violation Status Bar */}
      {violationCount > 0 && !showViolationWarning && (
        <div className="violation-status-bar">
          <FaLock /> <span>Focus Mode Active</span>
          <span className="violation-status-count">
            Violations: {violationCount}/{MAX_VIOLATIONS}
          </span>
        </div>
      )}

      <div className="container quiz-active-container">
        <div className="quiz-active glass-card">
          {/* Header */}
          <div className="quiz-header">
            <button className="quiz-back-btn" onClick={backToMenu}><HiOutlineArrowLeft /> Back</button>
            <span className="quiz-title-badge" style={{ background: `${quiz.color}20`, color: quiz.color }}>
              {quiz.icon} {quiz.title}
            </span>
            <div className={`quiz-timer ${timer <= 10 ? 'timer-warning' : ''}`}>
              <HiOutlineClock /> {timer}s
            </div>
          </div>

          {/* Progress */}
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${progress}%`, background: quiz.color }} />
          </div>
          <span className="quiz-progress-label">Question {currentQ + 1} of {quiz.questions.length}</span>

          {/* Question */}
          <div className="quiz-question">
            <h2 className="question-text">{question.q}</h2>
          </div>

          {/* Options */}
          <div className="quiz-options">
            {question.options.map((opt, i) => {
              let cls = 'quiz-option';
              if (showResult) {
                if (i === question.answer) cls += ' option-correct';
                else if (i === selected && i !== question.answer) cls += ' option-wrong';
                else cls += ' option-disabled';
              }
              if (selected === i && !showResult) cls += ' option-selected';
              return (
                <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={showResult}>
                  <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="option-text">{opt}</span>
                  {showResult && i === question.answer && <HiOutlineCheckCircle className="option-result-icon" />}
                  {showResult && i === selected && i !== question.answer && <HiOutlineXCircle className="option-result-icon" />}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          {showResult && (
            <button className="quiz-next-btn" style={{ background: quiz.color }} onClick={handleNext}>
              {currentQ + 1 >= quiz.questions.length ? 'See Results' : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}