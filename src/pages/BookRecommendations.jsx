import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSparkles, HiOutlineBookOpen } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import './BookRecommendations.css';

// ====== PRE-LOADED BOOK DATA PER SUBJECT ======
const MOCK_BOOKS = {
  'Mathematics': [
    { title: 'Calculus Made Easy', author: 'Silvanus P. Thompson', description: 'A classic introduction to calculus that simplifies derivatives and integrals with intuitive explanations. Perfect for beginners who find math intimidating.', tags: ['Calculus', 'Beginner', 'Classic'] },
    { title: 'The Joy of X', author: 'Steven Strogatz', description: 'A guided tour of math from negative numbers to calculus, written with humor and clarity. Great for understanding why math matters.', tags: ['Algebra', 'Popular Science', 'Engaging'] },
    { title: 'How to Solve It', author: 'George Pólya', description: 'A timeless guide to mathematical problem-solving strategies. Teaches you HOW to think, not just what to memorize.', tags: ['Problem Solving', 'Logic', 'Strategies'] },
    { title: 'Linear Algebra Done Right', author: 'Sheldon Axler', description: 'A elegant approach to linear algebra that emphasizes concepts over computation. Ideal for students wanting deeper understanding.', tags: ['Linear Algebra', 'University', 'Theory'] },
    { title: 'Discrete Mathematics and Its Applications', author: 'Kenneth Rosen', description: 'Comprehensive textbook covering logic, sets, graphs, and combinatorics with real-world CS applications throughout.', tags: ['Discrete Math', 'CS Foundation', 'Textbook'] },
    { title: 'Fermat\'s Enigma', author: 'Simon Singh', description: 'The thrilling story of the quest to prove Fermat\'s Last Theorem. A page-turner that makes number theory exciting.', tags: ['Number Theory', 'History', 'Storytelling'] },
  ],
  'Physics': [
    { title: 'Feynman Lectures on Physics', author: 'Richard Feynman', description: 'The gold standard of physics education, delivered with Feynman\'s legendary wit and insight. Covers mechanics, electromagnetism, and quantum mechanics.', tags: ['Comprehensive', 'Classic', 'University'] },
    { title: 'Six Easy Pieces', author: 'Richard Feynman', description: 'A compact introduction to the most fundamental concepts in physics, extracted from the famous Feynman Lectures.', tags: ['Beginner', 'Fundamentals', 'Accessible'] },
    { title: 'A Brief History of Time', author: 'Stephen Hawking', description: 'Explores the nature of time, black holes, and the origin of the universe in a way anyone can appreciate.', tags: ['Cosmology', 'Popular Science', 'Inspiring'] },
    { title: 'University Physics', author: 'Young & Freedman', description: 'The most widely adopted physics textbook worldwide, with clear explanations, worked examples, and practice problems.', tags: ['Textbook', 'Comprehensive', 'Problems'] },
    { title: 'The Elegant Universe', author: 'Brian Greene', description: 'A fascinating journey into string theory and the hidden dimensions of the universe, explained with brilliant analogies.', tags: ['String Theory', 'Advanced', 'Engaging'] },
    { title: 'Thinking Physics', author: 'Lewis Carroll Epstein', description: 'Hundreds of physics puzzles that build genuine intuition. No math required — just clear thinking and curiosity.', tags: ['Puzzles', 'Intuition', 'Fun'] },
  ],
  'Programming': [
    { title: 'Clean Code', author: 'Robert C. Martin', description: 'The definitive guide to writing readable, maintainable code. A must-read for any developer who wants to write professional-quality software.', tags: ['Best Practices', 'Software Engineering', 'Essential'] },
    { title: 'The Pragmatic Programmer', author: 'David Thomas & Andrew Hunt', description: 'Practical advice on everything from career development to architecture. Full of tips that make you a better developer overnight.', tags: ['Career', 'Practical', 'Timeless'] },
    { title: 'Eloquent JavaScript', author: 'Marijn Haverbeke', description: 'A modern introduction to programming through JavaScript. Covers fundamentals, DOM manipulation, Node.js, and more.', tags: ['JavaScript', 'Web Dev', 'Free Online'] },
    { title: 'Introduction to Algorithms (CLRS)', author: 'Cormen, Leiserson, Rivest, Stein', description: 'The most comprehensive algorithms textbook. Essential for interview prep and deep understanding of data structures.', tags: ['Algorithms', 'DSA', 'Interview Prep'] },
    { title: 'You Don\'t Know JS', author: 'Kyle Simpson', description: 'A deep dive into the core mechanisms of JavaScript. Goes beyond syntax to explain closures, prototypes, and async patterns.', tags: ['JavaScript', 'Advanced', 'Deep Dive'] },
    { title: 'Design Patterns', author: 'Gang of Four', description: 'The seminal work on reusable object-oriented design patterns. Teaches you to think in terms of proven architectural solutions.', tags: ['Patterns', 'OOP', 'Architecture'] },
  ],
  'English Literature': [
    { title: 'How to Read Literature Like a Professor', author: 'Thomas C. Foster', description: 'Teaches you to recognize symbols, themes, and patterns in literature. Makes reading novels, poems, and plays infinitely richer.', tags: ['Literary Analysis', 'Guide', 'Accessible'] },
    { title: 'The Elements of Style', author: 'Strunk & White', description: 'The timeless guide to clear, concise English writing. Every student and writer should own a copy.', tags: ['Writing', 'Grammar', 'Classic'] },
    { title: 'On Writing', author: 'Stephen King', description: 'Part memoir, part masterclass. Stephen King shares his experiences and practical advice on the craft of writing.', tags: ['Creative Writing', 'Memoir', 'Inspiring'] },
    { title: 'The Norton Anthology of English Literature', author: 'Stephen Greenblatt (ed.)', description: 'The definitive collection of English literature from Beowulf to the modern era, with scholarly introductions and annotations.', tags: ['Anthology', 'Comprehensive', 'Reference'] },
    { title: 'Bird by Bird', author: 'Anne Lamott', description: 'Warm, funny instructions on writing and life. Covers getting started, drafts, and finding your voice as a writer.', tags: ['Writing', 'Humor', 'Practical'] },
    { title: 'The Great Gatsby Study Guide', author: 'SparkNotes / F. Scott Fitzgerald', description: 'Essential analysis of themes, characters, and symbols in one of America\'s greatest novels.', tags: ['Novel Study', 'American Lit', 'Analysis'] },
  ],
  'Biology': [
    { title: 'Campbell Biology', author: 'Lisa Urry et al.', description: 'The most widely used college biology textbook. Covers molecular biology, genetics, ecology, and evolution with stunning visuals.', tags: ['Textbook', 'Comprehensive', 'Visual'] },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', description: 'A revolutionary look at evolution from the gene\'s perspective. Changed how we think about natural selection and altruism.', tags: ['Evolution', 'Popular Science', 'Landmark'] },
    { title: 'The Gene: An Intimate History', author: 'Siddhartha Mukherjee', description: 'A sweeping narrative of genetics from Mendel to CRISPR, told with the depth of a scientist and the skill of a storyteller.', tags: ['Genetics', 'History', 'Narrative'] },
    { title: 'Molecular Biology of the Cell', author: 'Bruce Alberts et al.', description: 'The go-to reference for cell biology. Detailed yet accessible, covering everything from DNA replication to cell signaling.', tags: ['Cell Biology', 'Advanced', 'Reference'] },
    { title: 'The Origin of Species', author: 'Charles Darwin', description: 'The foundational text of evolutionary biology. Still remarkably readable and insightful over 160 years later.', tags: ['Evolution', 'Classic', 'Foundational'] },
    { title: 'I Contain Multitudes', author: 'Ed Yong', description: 'A fascinating exploration of the microbial world inside and around us. Redefines what it means to be an organism.', tags: ['Microbiology', 'Popular Science', 'Fascinating'] },
  ],
  'Chemistry': [
    { title: 'Chemistry: The Central Science', author: 'Brown, LeMay, Bursten', description: 'The bestselling general chemistry textbook with clear explanations, excellent diagrams, and graduated problem sets.', tags: ['Textbook', 'General', 'Comprehensive'] },
    { title: 'Organic Chemistry As a Second Language', author: 'David Klein', description: 'Makes organic chemistry approachable by breaking complex mechanisms into simple, logical steps. A lifesaver for students.', tags: ['Organic', 'Study Aid', 'Simplified'] },
    { title: 'The Disappearing Spoon', author: 'Sam Kean', description: 'Entertaining stories behind every element on the periodic table. Brings chemistry to life through history and human stories.', tags: ['Elements', 'Popular Science', 'Fun'] },
    { title: 'Atkins\' Physical Chemistry', author: 'Peter Atkins', description: 'The standard physical chemistry textbook covering thermodynamics, kinetics, and quantum chemistry with mathematical rigor.', tags: ['Physical Chemistry', 'Advanced', 'Rigorous'] },
    { title: 'Napoleon\'s Buttons', author: 'Penny Le Couteur & Jay Burreson', description: 'How 17 molecules changed history — from explosives to caffeine. Shows how chemistry shapes the world we live in.', tags: ['History', 'Molecules', 'Engaging'] },
    { title: 'Chemical Principles', author: 'Peter Atkins & Loretta Jones', description: 'An insightful approach to general chemistry that emphasizes understanding over memorization.', tags: ['General', 'Conceptual', 'Modern'] },
  ],
  'History': [
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', description: 'A sweeping narrative of human history from the Stone Age to the Silicon Age. Thought-provoking and brilliantly written.', tags: ['World History', 'Anthropology', 'Bestseller'] },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', description: 'Why did history unfold differently on different continents? A groundbreaking analysis of geography, technology, and civilization.', tags: ['Civilization', 'Geography', 'Pulitzer Prize'] },
    { title: 'A People\'s History of the United States', author: 'Howard Zinn', description: 'American history told from the perspective of ordinary people — workers, women, minorities. A powerful counter-narrative.', tags: ['US History', 'Social', 'Alternative'] },
    { title: 'The Silk Roads', author: 'Peter Frankopan', description: 'Recenters world history around Central Asia and the ancient trade routes. A fresh perspective on global connections.', tags: ['Trade', 'Global', 'Fresh Perspective'] },
    { title: 'SPQR: A History of Ancient Rome', author: 'Mary Beard', description: 'Witty, scholarly account of Roman civilization from its founding myths to citizenship and empire. Accessible and authoritative.', tags: ['Ancient Rome', 'Classical', 'Authoritative'] },
    { title: 'The History Book (DK)', author: 'DK Publishing', description: 'A beautifully illustrated reference covering major events, civilizations, and turning points in world history.', tags: ['Reference', 'Visual', 'Overview'] },
  ],
  'Computer Science': [
    { title: 'Structure and Interpretation of Computer Programs', author: 'Abelson & Sussman', description: 'The legendary MIT textbook that teaches fundamental principles of computation. Challenging but transformative.', tags: ['Fundamentals', 'MIT', 'Classic'] },
    { title: 'Computer Networking: A Top-Down Approach', author: 'Kurose & Ross', description: 'Explains networking from applications down to the physical layer. Clear writing with hands-on labs and exercises.', tags: ['Networking', 'Textbook', 'Hands-On'] },
    { title: 'Operating System Concepts', author: 'Silberschatz, Galvin, Gagne', description: 'The "Dinosaur Book" — the standard OS textbook covering processes, memory, file systems, and security.', tags: ['Operating Systems', 'Core CS', 'Standard'] },
    { title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell & Peter Norvig', description: 'The definitive AI textbook used in universities worldwide. Covers search, logic, learning, and modern AI techniques.', tags: ['AI', 'Comprehensive', 'University'] },
    { title: 'Code: The Hidden Language', author: 'Charles Petzold', description: 'Explains how computers work from first principles — Morse code to microprocessors. No prior knowledge needed.', tags: ['How Computers Work', 'Beginner', 'Brilliant'] },
    { title: 'Cracking the Coding Interview', author: 'Gayle Laakmann McDowell', description: '189 programming questions and solutions, plus strategies for acing technical interviews at top tech companies.', tags: ['Interview Prep', 'Practice', 'Career'] },
  ],
  'Effective Teaching': [
    { title: 'Teach Like a Champion 3.0', author: 'Doug Lemov', description: '63 techniques that put students on the path to college. Practical, field-tested strategies used by the best teachers.', tags: ['Techniques', 'Practical', 'K-12'] },
    { title: 'The First Days of School', author: 'Harry & Rosemary Wong', description: 'The most widely read book on classroom management. Covers procedures, routines, and creating a positive environment.', tags: ['Classroom Setup', 'New Teachers', 'Essential'] },
    { title: 'Make It Stick', author: 'Peter C. Brown', description: 'Based on cognitive science research, reveals the most effective learning strategies: retrieval practice, spacing, and interleaving.', tags: ['Learning Science', 'Evidence-Based', 'Research'] },
    { title: 'Visible Learning', author: 'John Hattie', description: 'A synthesis of 800+ meta-analyses on what works in education. Data-driven insights on effective teaching practices.', tags: ['Research', 'Data-Driven', 'Comprehensive'] },
    { title: 'Understanding by Design', author: 'Grant Wiggins & Jay McTighe', description: 'The "backward design" framework for curriculum planning. Start with desired outcomes, then plan instruction accordingly.', tags: ['Curriculum', 'Planning', 'Framework'] },
    { title: 'Culturally Responsive Teaching', author: 'Geneva Gay', description: 'Essential reading on how to teach effectively in diverse classrooms by connecting curriculum to students\' cultural backgrounds.', tags: ['Diversity', 'Inclusion', 'Cultural'] },
  ],
  'Classroom Management': [
    { title: 'Setting Limits in the Classroom', author: 'Robert J. MacKenzie', description: 'A step-by-step program for effective classroom management. Focuses on clear limits, natural consequences, and mutual respect.', tags: ['Discipline', 'Boundaries', 'Practical'] },
    { title: 'Lost at School', author: 'Ross W. Greene', description: 'A compassionate approach to working with challenging students. Teaches collaborative problem-solving instead of punishment.', tags: ['Behavioral', 'Compassionate', 'Solutions'] },
    { title: 'Classroom Management That Works', author: 'Robert Marzano', description: 'Research-based strategies for creating an orderly and productive classroom environment.', tags: ['Research-Based', 'Strategies', 'Organized'] },
    { title: 'No More Shaming', author: 'Jim Fay & David Funk', description: 'Love and Logic techniques for teachers. Shows how to set enforceable limits with empathy rather than anger.', tags: ['Love and Logic', 'Empathy', 'Techniques'] },
    { title: 'The Classroom Management Book', author: 'Harry & Rosemary Wong', description: 'Over 50 step-by-step procedures for every situation, from entering the classroom to dismissal.', tags: ['Procedures', 'Step-by-Step', 'Complete'] },
    { title: 'Conscious Discipline', author: 'Becky A. Bailey', description: 'Integrates social-emotional learning with discipline. Transforms conflicts into learning opportunities.', tags: ['SEL', 'Mindful', 'Transformative'] },
  ],
  'Educational Psychology': [
    { title: 'How People Learn II', author: 'National Academies of Sciences', description: 'The authoritative review of learning science research. Covers motivation, transfer, technology, and cultural contexts.', tags: ['Research', 'Authoritative', 'Comprehensive'] },
    { title: 'Mindset: The New Psychology of Success', author: 'Carol Dweck', description: 'Growth vs. fixed mindset — how beliefs about intelligence shape learning outcomes. Essential for every educator.', tags: ['Growth Mindset', 'Motivation', 'Essential'] },
    { title: 'Drive: The Surprising Truth About Motivation', author: 'Daniel Pink', description: 'Reveals the three elements of true motivation: autonomy, mastery, and purpose. Transforms how you think about engagement.', tags: ['Motivation', 'Psychology', 'Engaging'] },
    { title: 'Why Don\'t Students Like School?', author: 'Daniel T. Willingham', description: 'A cognitive scientist explains how the mind works and what it means for the classroom. Practical and evidence-based.', tags: ['Cognitive Science', 'Practical', 'Insightful'] },
    { title: 'Educational Psychology', author: 'Anita Woolfolk', description: 'The standard university textbook covering development, learning theory, motivation, assessment, and diversity.', tags: ['Textbook', 'University', 'Standard'] },
    { title: 'Peak: Secrets from the Science of Expertise', author: 'Anders Ericsson', description: 'The science behind deliberate practice and how anyone can develop expertise in any domain.', tags: ['Deliberate Practice', 'Expertise', 'Science'] },
  ],
};

const STUDENT_TOPICS = [
  'Mathematics', 'Physics', 'Programming', 'English Literature',
  'Biology', 'Chemistry', 'History', 'Computer Science',
];

const TEACHER_TOPICS = [
  'Effective Teaching', 'Classroom Management', 'Educational Psychology',
  'Curriculum Design', 'Student Engagement', 'EdTech Tools',
  'Assessment Strategies', 'Inclusive Education',
];

export default function BookRecommendations() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedQuery, setSearchedQuery] = useState('');

  const role = user?.role || 'student';
  const topics = role === 'teacher' ? TEACHER_TOPICS : STUDENT_TOPICS;

  const bookEmojis = ['📘', '📗', '📕', '📙', '📓', '📔', '📒', '📚'];

  const fetchRecommendations = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setHasSearched(true);
    setSearchedQuery(searchQuery);

    // Check if we have pre-loaded books for this topic
    const mockKey = Object.keys(MOCK_BOOKS).find(
      key => key.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (mockKey) {
      // Use pre-loaded data instantly
      setTimeout(() => {
        setBooks(MOCK_BOOKS[mockKey]);
        setLoading(false);
      }, 600); // Small delay for visual feedback
      return;
    }

    // Otherwise, call Gemini AI for custom topic
    const roleContext = role === 'teacher'
      ? 'a teacher looking to improve their teaching skills and knowledge'
      : 'a student looking to learn and improve academically';

    const prompt = `You are a book recommendation AI. The user is ${roleContext}. 
Based on the topic "${searchQuery}", recommend exactly 6 books. 
For each book, provide this JSON (and ONLY valid JSON array, no markdown, no code fences):
[
  {
    "title": "Book Title",
    "author": "Author Name",
    "description": "2-3 sentence description of why this book is great for the topic.",
    "tags": ["tag1", "tag2", "tag3"]
  }
]
Return ONLY the JSON array. No explanation before or after.`;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not configured.');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      let text = data.candidates[0].content.parts[0].text;

      // Strip markdown code fences if present
      text = text.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();

      const parsed = JSON.parse(text);
      setBooks(parsed);
    } catch (err) {
      console.error('Book recommendation error:', err);
      setError('Could not fetch AI recommendations. Please try one of the pre-loaded topics above.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecommendations(query);
  };

  const handleTopicClick = (topic) => {
    setQuery(topic);
    fetchRecommendations(topic);
  };

  return (
    <div className="books-page page-enter">
      <div className="books-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-20%', right: '-5%', background: 'rgba(253, 115, 51, 0.1)' }} />
        <div className="bg-orb" style={{ width: 300, height: 300, bottom: '-15%', left: '5%', background: 'rgba(230, 90, 27, 0.08)', animationDelay: '-8s' }} />
        <div className="container">
          <div className="books-welcome">
            <div>
              <h1>📚 AI Book Recommendations</h1>
              <p>
                {role === 'teacher'
                  ? 'Discover books to sharpen your teaching skills and inspire your students.'
                  : 'Find the best books to master any subject and boost your knowledge.'}
              </p>
            </div>
          </div>

          <div className="books-prompt-area">
            <form className="books-prompt-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="books-prompt-input"
                placeholder={role === 'teacher' ? 'e.g. "Classroom management strategies"' : 'e.g. "Learn calculus from scratch"'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="books-generate-btn" disabled={loading || !query.trim()}>
                <HiOutlineSparkles /> {loading ? 'Thinking...' : 'Get Recommendations'}
              </button>
            </form>

            <div className="quick-topics">
              {topics.map((topic) => (
                <button key={topic} className="topic-chip" onClick={() => handleTopicClick(topic)}>
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Loading */}
        {loading && (
          <div className="books-loading">
            <div className="loading-spinner-books" />
            <p>AI is curating the best books for you...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="books-error">
            <p>⚠️ {error}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && books.length > 0 && (
          <div className="books-results">
            <h2 className="books-results-title">
              <HiOutlineBookOpen /> Recommended for "{searchedQuery}"
            </h2>
            <div className="books-grid">
              {books.map((book, i) => (
                <div key={i} className="book-card">
                  <div className="book-card-header">
                    <div className="book-icon">{bookEmojis[i % bookEmojis.length]}</div>
                    <div>
                      <div className="book-title">{book.title}</div>
                      <div className="book-author">by {book.author}</div>
                    </div>
                  </div>
                  <p className="book-description">{book.description}</p>
                  {book.tags && (
                    <div className="book-tags">
                      {book.tags.map((tag, j) => (
                        <span key={j} className="book-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !hasSearched && (
          <div className="books-empty">
            <div className="books-empty-icon">📖</div>
            <h3>What would you like to read?</h3>
            <p>Enter a subject or click a topic above. Our AI will recommend the best books for your learning journey.</p>
          </div>
        )}
      </div>
    </div>
  );
}
