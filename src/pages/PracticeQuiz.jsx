import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineArrowLeft,
  HiOutlineClock, HiOutlineShieldCheck, HiOutlineExclamation,
  HiOutlineFire, HiOutlineChartBar, HiOutlineLightningBolt
} from 'react-icons/hi';
import { FaLock, FaTrophy, FaMedal, FaChevronRight } from 'react-icons/fa';
import './PracticeQuiz.css';

// ======= DATA =======
const subjects = [
  {
    id: 'math', name: 'Mathematics', icon: '📐', color: '#f97316', bg: 'rgba(249,115,22,0.1)',
    desc: 'Algebra, Calculus, Geometry & more',
    topics: ['Algebra', 'Geometry', 'Calculus', 'Trigonometry', 'Statistics'],
  },
  {
    id: 'physics', name: 'Physics', icon: '⚛️', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',
    desc: 'Mechanics, Optics, Electricity & more',
    topics: ['Mechanics', 'Optics', 'Thermodynamics', 'Electricity', 'Modern Physics'],
  },
  {
    id: 'chemistry', name: 'Chemistry', icon: '🧪', color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    desc: 'Organic, Inorganic, Physical Chemistry',
    topics: ['Organic', 'Inorganic', 'Physical', 'Electrochemistry', 'Equilibrium'],
  },
  {
    id: 'biology', name: 'Biology', icon: '🧬', color: '#a855f7', bg: 'rgba(168,85,247,0.1)',
    desc: 'Cell Biology, Genetics, Ecology & more',
    topics: ['Cell Biology', 'Genetics', 'Ecology', 'Human Body', 'Evolution'],
  },
  {
    id: 'english', name: 'English', icon: '📖', color: '#ec4899', bg: 'rgba(236,72,153,0.1)',
    desc: 'Grammar, Literature, Vocabulary & more',
    topics: ['Grammar', 'Comprehension', 'Writing', 'Literature', 'Vocabulary'],
  },
  {
    id: 'history', name: 'History', icon: '🏛️', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    desc: 'Ancient, Medieval, Modern History',
    topics: ['Ancient', 'Medieval', 'Modern', 'World Wars', 'Indian History'],
  },
  {
    id: 'geography', name: 'Geography', icon: '🌍', color: '#14b8a6', bg: 'rgba(20,184,166,0.1)',
    desc: 'Physical, Human, Climate & Resources',
    topics: ['Physical', 'Human', 'Maps', 'Climate', 'Resources'],
  },
  {
    id: 'cs', name: 'Computer Science', icon: '💻', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',
    desc: 'Programming, DSA, Networking & more',
    topics: ['Programming', 'Data Structures', 'Algorithms', 'Networking', 'Databases'],
  },
  {
    id: 'economics', name: 'Economics', icon: '📊', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    desc: 'Micro, Macro, Market & Trade',
    topics: ['Microeconomics', 'Macroeconomics', 'Market', 'GDP', 'Trade'],
  },
  {
    id: 'hindi', name: 'Hindi', icon: '🇮🇳', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
    desc: 'Grammar, Literature, Poetry & more',
    topics: ['Grammar', 'Comprehension', 'Writing', 'Literature', 'Poetry'],
  },
];

const questionsData = {
  math: {
    Algebra: [
      { q: 'If 2x + 5 = 13, what is x?', options: ['3', '4', '5', '6'], ans: 1 },
      { q: 'Simplify: (x² - 9) / (x - 3)', options: ['x - 3', 'x + 3', 'x² + 3', 'x - 9'], ans: 1 },
      { q: 'Solve: x² - 5x + 6 = 0', options: ['x = 2, 3', 'x = -2, -3', 'x = 1, 6', 'x = -1, -6'], ans: 0 },
      { q: 'If f(x) = 3x² + 2x - 1, what is f(2)?', options: ['13', '14', '15', '11'], ans: 2 },
      { q: 'What is the quadratic formula?', options: ['x = -b ± √(b²-4ac) / 2a', 'x = b ± √(b²+4ac) / 2a', 'x = -b ± √(b²-4ac) / a', 'x = b ± √(b²-4ac) / 2a'], ans: 0 },
    ],
    Geometry: [
      { q: 'Area of a circle with radius 7?', options: ['49π', '14π', '7π', '154'], ans: 0 },
      { q: 'Sum of interior angles of a hexagon?', options: ['540°', '720°', '900°', '360°'], ans: 1 },
      { q: 'A triangle has sides 3, 4, 5. What type?', options: ['Acute', 'Obtuse', 'Right', 'Equilateral'], ans: 2 },
      { q: 'Volume of a cube with side 4cm?', options: ['16 cm³', '64 cm³', '48 cm³', '32 cm³'], ans: 1 },
      { q: 'Pythagorean theorem?', options: ['a + b = c', 'a² + b² = c²', 'a² - b² = c²', '2a + 2b = c'], ans: 1 },
    ],
    Calculus: [
      { q: 'Derivative of x³?', options: ['3x', '3x²', 'x²', '2x³'], ans: 1 },
      { q: 'Integrate: ∫2x dx', options: ['x² + C', '2x² + C', 'x + C', '4x + C'], ans: 0 },
      { q: 'Derivative of sin(x)?', options: ['-cos(x)', 'cos(x)', '-sin(x)', 'tan(x)'], ans: 1 },
      { q: 'Find lim(x→0) sin(x)/x', options: ['0', 'undefined', '1', '∞'], ans: 2 },
      { q: 'Derivative of e^x?', options: ['xe^(x-1)', 'e^(x+1)', 'e^x', '1/e^x'], ans: 2 },
    ],
    Trigonometry: [
      { q: 'sin(90°) = ?', options: ['0', '1', '-1', '√2/2'], ans: 1 },
      { q: 'cos(0°) = ?', options: ['0', '-1', '1', '√3/2'], ans: 2 },
      { q: 'tan(45°) = ?', options: ['0', '1', '√3', '1/√3'], ans: 1 },
      { q: 'sin²θ + cos²θ = ?', options: ['0', '2', '1', 'tanθ'], ans: 2 },
      { q: 'Value of sin(30°)?', options: ['√3/2', '1/2', '1', '√2/2'], ans: 1 },
    ],
    Statistics: [
      { q: 'Mean of 2, 4, 6, 8, 10?', options: ['4', '5', '6', '7'], ans: 2 },
      { q: 'Median of 3, 1, 4, 1, 5, 9, 2?', options: ['3', '4', '1', '5'], ans: 0 },
      { q: 'Mode of 2, 3, 3, 4, 5, 3?', options: ['2', '3', '4', '5'], ans: 1 },
      { q: 'Standard deviation measures?', options: ['Central tendency', 'Spread', 'Frequency', 'Range'], ans: 1 },
      { q: 'P(A) + P(A\') = ?', options: ['0', '2', '1', 'P(A)'], ans: 2 },
    ],
  },
  physics: {
    Mechanics: [
      { q: 'Newton\'s 2nd law: F = ?', options: ['mv', 'ma', 'mv²', 'm/a'], ans: 1 },
      { q: 'SI unit of force?', options: ['Joule', 'Watt', 'Newton', 'Pascal'], ans: 2 },
      { q: 'At max height, velocity of a thrown ball is?', options: ['Maximum', 'Minimum', 'Zero', 'Constant'], ans: 2 },
      { q: 'g on Earth ≈ ?', options: ['8.9 m/s²', '9.8 m/s²', '10.8 m/s²', '9.0 m/s²'], ans: 1 },
      { q: 'Which law explains rocket propulsion?', options: ['1st', '2nd', '3rd', 'Gravitation'], ans: 2 },
    ],
    Optics: [
      { q: 'Speed of light in vacuum?', options: ['2×10⁸ m/s', '3×10⁸ m/s', '4×10⁸ m/s', '1×10⁸ m/s'], ans: 1 },
      { q: 'A concave lens always forms?', options: ['Real, Inverted', 'Virtual, Erect', 'Real, Erect', 'Virtual, Inverted'], ans: 1 },
      { q: 'Rainbow is formed due to?', options: ['Reflection', 'Refraction only', 'Dispersion & Refraction', 'Diffraction'], ans: 2 },
      { q: 'Focal length of a plane mirror?', options: ['Zero', 'Infinity', 'Negative', 'Finite positive'], ans: 1 },
      { q: 'Highest frequency in visible light?', options: ['Red', 'Green', 'Violet', 'Yellow'], ans: 2 },
    ],
    Thermodynamics: [
      { q: 'SI unit of temperature?', options: ['Celsius', 'Fahrenheit', 'Kelvin', 'Rankine'], ans: 2 },
      { q: '0°C = ? Kelvin', options: ['100', '273', '373', '0'], ans: 1 },
      { q: '1st law of thermodynamics is about?', options: ['Entropy', 'Temperature', 'Energy conservation', 'Pressure'], ans: 2 },
      { q: 'Absolute zero in Celsius?', options: ['-100°C', '-273°C', '-373°C', '0°C'], ans: 1 },
      { q: 'Which process has constant temperature?', options: ['Adiabatic', 'Isobaric', 'Isothermal', 'Isochoric'], ans: 2 },
    ],
    Electricity: [
      { q: 'Ohm\'s Law: V = ?', options: ['I/R', 'IR', 'I²R', 'R/I'], ans: 1 },
      { q: 'SI unit of resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], ans: 2 },
      { q: 'SI unit of electric current?', options: ['Volt', 'Ampere', 'Ohm', 'Coulomb'], ans: 1 },
      { q: 'Power formula in electricity?', options: ['P = VI', 'P = V/I', 'P = I/V', 'P = V²I'], ans: 0 },
      { q: 'Resistors in series: total resistance?', options: ['Sum', 'Product', 'Reciprocal sum', 'Difference'], ans: 0 },
    ],
    'Modern Physics': [
      { q: 'E = mc² was given by?', options: ['Newton', 'Bohr', 'Einstein', 'Planck'], ans: 2 },
      { q: 'Photoelectric effect was explained by?', options: ['Newton', 'Einstein', 'Bohr', 'Rutherford'], ans: 1 },
      { q: 'Nucleus of an atom contains?', options: ['Only protons', 'Protons & neutrons', 'Only neutrons', 'Electrons'], ans: 1 },
      { q: 'Smallest particle of matter?', options: ['Atom', 'Molecule', 'Quark', 'Electron'], ans: 2 },
      { q: 'Half-life is the time for radioactive material to?', options: ['Double', 'Triple', 'Halve', 'Disappear'], ans: 2 },
    ],
  },
  chemistry: {
    Organic: [
      { q: 'Functional group of alcohols?', options: ['-COOH', '-OH', '-CHO', '-NH₂'], ans: 1 },
      { q: 'Ethanol molecular formula?', options: ['CH₃OH', 'C₂H₅OH', 'C₃H₇OH', 'CH₄'], ans: 1 },
      { q: 'IUPAC name of CH₃-CH₂-CH₃?', options: ['Propane', 'Ethane', 'Butane', 'Methane'], ans: 0 },
      { q: 'Benzene molecular formula?', options: ['C₆H₁₂', 'C₆H₆', 'C₆H₁₀', 'C₅H₆'], ans: 1 },
      { q: 'Carboxylic acid functional group?', options: ['-OH', '-CHO', '-COOH', '-CO-'], ans: 2 },
    ],
    Inorganic: [
      { q: 'Atomic number of Carbon?', options: ['6', '8', '12', '14'], ans: 0 },
      { q: 'Formula of Sulfuric acid?', options: ['HCl', 'HNO₃', 'H₂SO₄', 'H₃PO₄'], ans: 2 },
      { q: 'Gas produced when Zn reacts with HCl?', options: ['O₂', 'CO₂', 'H₂', 'Cl₂'], ans: 2 },
      { q: 'Valency of Nitrogen?', options: ['2', '3', '4', '5'], ans: 1 },
      { q: 'pH of pure water at 25°C?', options: ['6', '7', '8', '14'], ans: 1 },
    ],
    Physical: [
      { q: 'Avogadro\'s number?', options: ['6.02×10²²', '6.02×10²³', '3.14×10²³', '9.8×10²³'], ans: 1 },
      { q: 'Unit of molar mass?', options: ['g/L', 'g/mol', 'mol/L', 'kg/mol'], ans: 1 },
      { q: 'Rate of reaction depends on?', options: ['Color', 'Concentration', 'Shape', 'Smell'], ans: 1 },
      { q: 'Catalyst in a reaction?', options: ['Is consumed', 'Slows reaction', 'Speeds reaction without being consumed', 'Changes products'], ans: 2 },
      { q: 'Endothermic reaction?', options: ['Releases heat', 'Absorbs heat', 'No heat change', 'Explodes'], ans: 1 },
    ],
    Electrochemistry: [
      { q: 'Electrolysis uses?', options: ['Heat', 'Electric current', 'Pressure', 'Light'], ans: 1 },
      { q: 'Cathode in electrolysis?', options: ['Positive electrode', 'Negative electrode', 'Neutral electrode', 'Carbon rod'], ans: 1 },
      { q: 'EMF stands for?', options: ['Electromagnetic Force', 'Electromotive Force', 'Electric Magnetic Flux', 'None'], ans: 1 },
      { q: 'Oxidation is?', options: ['Gain of electrons', 'Loss of electrons', 'Gain of protons', 'Loss of neutrons'], ans: 1 },
      { q: 'Reduction is?', options: ['Loss of electrons', 'Gain of electrons', 'Loss of protons', 'Gain of neutrons'], ans: 1 },
    ],
    Equilibrium: [
      { q: 'Le Chatelier\'s principle relates to?', options: ['Reaction rate', 'Chemical equilibrium', 'Atomic structure', 'Bonding'], ans: 1 },
      { q: 'At equilibrium, rate of forward and reverse reactions is?', options: ['Forward > Reverse', 'Reverse > Forward', 'Equal', 'Zero'], ans: 2 },
      { q: 'Kc is the?', options: ['Rate constant', 'Equilibrium constant', 'Activation energy', 'None'], ans: 1 },
      { q: 'Increasing temperature in exothermic reaction shifts equilibrium?', options: ['Forward', 'Backward', 'No change', 'Stops'], ans: 1 },
      { q: 'pH < 7 means solution is?', options: ['Neutral', 'Basic', 'Acidic', 'Salt'], ans: 2 },
    ],
  },
  biology: {
    'Cell Biology': [
      { q: 'Powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'], ans: 2 },
      { q: 'Cell wall is absent in?', options: ['Plant cells', 'Bacteria', 'Animal cells', 'Fungi'], ans: 2 },
      { q: 'Which organelle contains DNA?', options: ['Ribosome', 'Nucleus', 'Vacuole', 'Lysosome'], ans: 1 },
      { q: 'Cell division process?', options: ['Osmosis', 'Mitosis', 'Diffusion', 'Respiration'], ans: 1 },
      { q: 'Photosynthesis occurs in?', options: ['Mitochondria', 'Ribosome', 'Chloroplast', 'Nucleus'], ans: 2 },
    ],
    Genetics: [
      { q: 'DNA stands for?', options: ['Deoxyribonucleic Acid', 'Diribose Nucleic Acid', 'Deoxyribose Nitrogen Acid', 'None'], ans: 0 },
      { q: 'Human chromosomes count?', options: ['23', '44', '46', '48'], ans: 2 },
      { q: 'Father of Genetics?', options: ['Darwin', 'Mendel', 'Watson', 'Crick'], ans: 1 },
      { q: 'Adenine pairs with in DNA?', options: ['Guanine', 'Cytosine', 'Thymine', 'Uracil'], ans: 2 },
      { q: 'mRNA is produced during?', options: ['Translation', 'Transcription', 'Replication', 'Mutation'], ans: 1 },
    ],
    Ecology: [
      { q: 'Producers in a food chain are?', options: ['Animals', 'Plants', 'Fungi', 'Bacteria'], ans: 1 },
      { q: 'Decomposers break down?', options: ['Sunlight', 'Dead organisms', 'Water', 'Rocks'], ans: 1 },
      { q: 'The base of ecological pyramid has?', options: ['Least energy', 'Most energy', 'No energy', 'Equal energy'], ans: 1 },
      { q: 'Symbiosis means?', options: ['Competition', 'Mutualism', 'Living together', 'Predation'], ans: 2 },
      { q: 'Greenhouse gases cause?', options: ['Ozone depletion', 'Global warming', 'Acid rain', 'Deforestation'], ans: 1 },
    ],
    'Human Body': [
      { q: 'Largest organ of human body?', options: ['Liver', 'Brain', 'Skin', 'Heart'], ans: 2 },
      { q: 'Normal human body temperature?', options: ['36°C', '37°C', '38°C', '39°C'], ans: 1 },
      { q: 'Blood is filtered by?', options: ['Liver', 'Lungs', 'Heart', 'Kidneys'], ans: 3 },
      { q: 'Which vitamin from sunlight?', options: ['A', 'B', 'C', 'D'], ans: 3 },
      { q: 'Number of bones in adult human?', options: ['196', '206', '216', '226'], ans: 1 },
    ],
    Evolution: [
      { q: 'Theory of evolution by natural selection was given by?', options: ['Mendel', 'Lamarck', 'Darwin', 'Wallace'], ans: 2 },
      { q: 'Survival of the fittest means?', options: ['Strongest survives', 'Best adapted survives', 'Fastest survives', 'Largest survives'], ans: 1 },
      { q: 'Fossils are found in which rock?', options: ['Igneous', 'Metamorphic', 'Sedimentary', 'All types'], ans: 2 },
      { q: 'Homologous organs have?', options: ['Same function, different structure', 'Same structure, different function', 'Same origin, different function', 'None'], ans: 2 },
      { q: 'Human and chimpanzee share about what % DNA?', options: ['50%', '75%', '98%', '100%'], ans: 2 },
    ],
  },
  english: {
    Grammar: [
      { q: 'Which is a proper noun?', options: ['city', 'Delhi', 'river', 'mountain'], ans: 1 },
      { q: '"She runs fast." — "fast" is a?', options: ['Adjective', 'Noun', 'Adverb', 'Verb'], ans: 2 },
      { q: 'Plural of "child"?', options: ['Childs', 'Childrens', 'Children', 'Childes'], ans: 2 },
      { q: 'Passive voice of "He wrote a letter"?', options: ['A letter was written by him', 'A letter is written by him', 'He is writing a letter', 'A letter has been written'], ans: 0 },
      { q: 'Antonym of "ancient"?', options: ['Old', 'Modern', 'Historic', 'Classic'], ans: 1 },
    ],
    Vocabulary: [
      { q: '"Ubiquitous" means?', options: ['Rare', 'Present everywhere', 'Beautiful', 'Ancient'], ans: 1 },
      { q: '"Benevolent" means?', options: ['Cruel', 'Kind-hearted', 'Lazy', 'Angry'], ans: 1 },
      { q: 'Synonym of "ephemeral"?', options: ['Eternal', 'Temporary', 'Large', 'Bright'], ans: 1 },
      { q: '"Loquacious" means?', options: ['Silent', 'Talkative', 'Shy', 'Brave'], ans: 1 },
      { q: 'Antonym of "verbose"?', options: ['Concise', 'Lengthy', 'Detailed', 'Complex'], ans: 0 },
    ],
    Comprehension: [
      { q: 'A "protagonist" in a story is the?', options: ['Villain', 'Main character', 'Narrator', 'Author'], ans: 1 },
      { q: '"Inference" means?', options: ['Direct statement', 'Conclusion from evidence', 'Summary', 'Title'], ans: 1 },
      { q: '"Theme" of a story is?', options: ['The plot', 'The central idea', 'The setting', 'The conflict'], ans: 1 },
      { q: 'Simile uses?', options: ['Metaphor', 'Like or As', 'Personification', 'Irony'], ans: 1 },
      { q: '"Alliteration" is?', options: ['Repeating vowel sounds', 'Repeating consonant sounds', 'Rhyming words', 'Onomatopoeia'], ans: 1 },
    ],
    Literature: [
      { q: 'Who wrote "Romeo and Juliet"?', options: ['Dickens', 'Shakespeare', 'Keats', 'Austen'], ans: 1 },
      { q: '"Pride and Prejudice" was written by?', options: ['Emily Bronte', 'Charlotte Bronte', 'Jane Austen', 'Virginia Woolf'], ans: 2 },
      { q: '"To Kill a Mockingbird" author?', options: ['Hemingway', 'Harper Lee', 'Twain', 'Steinbeck'], ans: 1 },
      { q: 'Haiku is a form of poetry from?', options: ['China', 'Korea', 'Japan', 'India'], ans: 2 },
      { q: '"1984" dystopian novel was written by?', options: ['Huxley', 'Orwell', 'Kafka', 'Tolkien'], ans: 1 },
    ],
    Writing: [
      { q: 'A thesis statement is found in?', options: ['Conclusion', 'Introduction', 'Body paragraph', 'Bibliography'], ans: 1 },
      { q: 'A paragraph should have?', options: ['One main idea', 'Many main ideas', 'No structure', 'Only examples'], ans: 0 },
      { q: 'Formal writing avoids?', options: ['Facts', 'Contractions', 'Evidence', 'Arguments'], ans: 1 },
      { q: 'A persuasive essay aims to?', options: ['Entertain', 'Inform', 'Convince', 'Describe'], ans: 2 },
      { q: 'Topic sentence is placed?', options: ['End', 'Middle', 'Beginning', 'Anywhere'], ans: 2 },
    ],
  },
  history: {
    'Indian History': [
      { q: 'Who gave the slogan "Jai Hind"?', options: ['Gandhi', 'Nehru', 'Bose', 'Tilak'], ans: 2 },
      { q: 'India got independence in?', options: ['1945', '1946', '1947', '1948'], ans: 2 },
      { q: 'First Prime Minister of India?', options: ['Patel', 'Prasad', 'Nehru', 'Ambedkar'], ans: 2 },
      { q: 'Battle of Plassey was fought in?', options: ['1757', '1764', '1857', '1947'], ans: 0 },
      { q: 'Who founded the Maurya Empire?', options: ['Ashoka', 'Chandragupta Maurya', 'Bindusara', 'Vikramaditya'], ans: 1 },
    ],
    'World Wars': [
      { q: 'World War I started in?', options: ['1912', '1914', '1916', '1918'], ans: 1 },
      { q: 'World War II ended in?', options: ['1943', '1944', '1945', '1946'], ans: 2 },
      { q: 'Hitler was leader of?', options: ['Italy', 'Japan', 'Germany', 'Austria'], ans: 2 },
      { q: 'Atomic bomb was dropped on?', options: ['Tokyo & Osaka', 'Hiroshima & Nagasaki', 'Berlin & Munich', 'Kyoto & Nagoya'], ans: 1 },
      { q: 'UN was founded after?', options: ['WW I', 'WW II', 'Cold War', 'Vietnam War'], ans: 1 },
    ],
    Modern: [
      { q: 'Cold War was between?', options: ['UK & France', 'USA & USSR', 'India & China', 'Germany & Japan'], ans: 1 },
      { q: 'Berlin Wall fell in?', options: ['1985', '1987', '1989', '1991'], ans: 2 },
      { q: 'Nelson Mandela was president of?', options: ['Nigeria', 'Kenya', 'South Africa', 'Ghana'], ans: 2 },
      { q: 'French Revolution started in?', options: ['1776', '1789', '1800', '1815'], ans: 1 },
      { q: 'Industrial Revolution began in?', options: ['France', 'Germany', 'England', 'USA'], ans: 2 },
    ],
    Ancient: [
      { q: 'Great Wall of China was built by?', options: ['Qin Shi Huang', 'Kublai Khan', 'Confucius', 'Mao'], ans: 0 },
      { q: 'Ancient Olympics were held in?', options: ['Rome', 'Athens', 'Olympia', 'Sparta'], ans: 2 },
      { q: 'Egyptian pharaohs were buried in?', options: ['Temples', 'Pyramids', 'Palaces', 'Tombs'], ans: 1 },
      { q: 'Indus Valley Civilization was in?', options: ['2500 BCE', '1000 BCE', '500 BCE', '100 CE'], ans: 0 },
      { q: 'Rome was founded in?', options: ['753 BCE', '500 BCE', '100 BCE', '44 BCE'], ans: 0 },
    ],
    Medieval: [
      { q: 'Magna Carta was signed in?', options: ['1066', '1215', '1348', '1453'], ans: 1 },
      { q: 'Crusades were fought over?', options: ['Land', 'Holy Land', 'Gold', 'Trade routes'], ans: 1 },
      { q: 'Genghis Khan founded the?', options: ['Ottoman Empire', 'Mongol Empire', 'Roman Empire', 'Han Empire'], ans: 1 },
      { q: 'Black Death was a?', options: ['War', 'Famine', 'Plague', 'Flood'], ans: 2 },
      { q: 'Feudal system was based on?', options: ['Democracy', 'Trade', 'Land ownership', 'Religion'], ans: 2 },
    ],
  },
  geography: {
    Physical: [
      { q: 'Longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Ganga'], ans: 1 },
      { q: 'Highest mountain?', options: ['K2', 'Kangchenjunga', 'Everest', 'Lhotse'], ans: 2 },
      { q: 'Largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], ans: 3 },
      { q: 'Which continent has no countries?', options: ['Arctic', 'Antarctica', 'Greenland', 'Iceland'], ans: 1 },
      { q: 'Tropic of Cancer lies at?', options: ['23.5°N', '23.5°S', '66.5°N', '0°'], ans: 0 },
    ],
    Climate: [
      { q: 'Hottest desert in the world?', options: ['Gobi', 'Arabian', 'Sahara', 'Kalahari'], ans: 2 },
      { q: 'Monsoon is caused by?', options: ['Ocean currents', 'Differential heating', 'Mountain ranges', 'Trade winds'], ans: 1 },
      { q: 'Tropical rainforests receive rainfall of?', options: ['<500mm', '500-1000mm', '>2000mm', '1000-2000mm'], ans: 2 },
      { q: 'Tundra biome is found in?', options: ['Tropics', 'Polar regions', 'Deserts', 'Mountains'], ans: 1 },
      { q: 'El Niño affects?', options: ['Earthquakes', 'Ocean temperature', 'Volcanic activity', 'Polar ice'], ans: 1 },
    ],
    Human: [
      { q: 'Most populated country?', options: ['USA', 'India', 'China', 'Brazil'], ans: 1 },
      { q: 'Largest country by area?', options: ['Canada', 'China', 'USA', 'Russia'], ans: 3 },
      { q: 'Amazon rainforest is in?', options: ['Africa', 'South America', 'Asia', 'Australia'], ans: 1 },
      { q: 'Sahara Desert is in?', options: ['Middle East', 'Asia', 'Africa', 'Australia'], ans: 2 },
      { q: 'Greenwich Meridian passes through?', options: ['Paris', 'London', 'Berlin', 'Madrid'], ans: 1 },
    ],
    Maps: [
      { q: 'Latitude lines run?', options: ['Vertically', 'Diagonally', 'Horizontally', 'Curved'], ans: 2 },
      { q: 'Equator is at?', options: ['90°N', '90°S', '0°', '45°N'], ans: 2 },
      { q: 'Prime Meridian is at?', options: ['90°E', '180°E', '0°', '45°W'], ans: 2 },
      { q: 'Scale on a map shows?', options: ['Direction', 'Population', 'Distance ratio', 'Height'], ans: 2 },
      { q: 'Contour lines on maps show?', options: ['Rivers', 'Roads', 'Elevation', 'Borders'], ans: 2 },
    ],
    Resources: [
      { q: 'Renewable resource?', options: ['Coal', 'Petroleum', 'Solar energy', 'Natural gas'], ans: 2 },
      { q: 'Largest coal producer?', options: ['USA', 'India', 'Russia', 'China'], ans: 3 },
      { q: 'Biosphere reserves protect?', options: ['Industries', 'Biodiversity', 'Minerals', 'Water'], ans: 1 },
      { q: 'Slash and burn farming is called?', options: ['Jhum', 'Terrace', 'Irrigation', 'Plantation'], ans: 0 },
      { q: 'Soil erosion is caused by?', options: ['Forests', 'Wind and water', 'Minerals', 'Mountains'], ans: 1 },
    ],
  },
  cs: {
    Programming: [
      { q: 'Boolean stores?', options: ['Numbers', 'Text', 'True/False', 'Decimals'], ans: 2 },
      { q: 'HTML stands for?', options: ['Hyper Text Markup Language', 'High Transfer Markup Language', 'Hyper Transfer Markup Language', 'None'], ans: 0 },
      { q: 'Loop that runs at least once?', options: ['for', 'while', 'do-while', 'foreach'], ans: 2 },
      { q: 'Binary search time complexity?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], ans: 2 },
      { q: 'RAM stands for?', options: ['Read Access Memory', 'Random Access Memory', 'Rapid Access Memory', 'Remote Access Memory'], ans: 1 },
    ],
    'Data Structures': [
      { q: 'Stack uses which principle?', options: ['FIFO', 'LIFO', 'Random', 'Priority'], ans: 1 },
      { q: 'Queue uses which principle?', options: ['LIFO', 'FIFO', 'Random', 'Priority'], ans: 1 },
      { q: 'Linked list nodes contain?', options: ['Only data', 'Only pointer', 'Data and pointer', 'Nothing'], ans: 2 },
      { q: 'Binary tree has max how many children per node?', options: ['1', '2', '3', 'Unlimited'], ans: 1 },
      { q: 'Array elements are accessed by?', options: ['Name', 'Index', 'Pointer', 'Key'], ans: 1 },
    ],
    Algorithms: [
      { q: 'Bubble sort worst case complexity?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(n log n)'], ans: 2 },
      { q: 'Binary search requires array to be?', options: ['Unsorted', 'Sorted', 'Empty', 'Full'], ans: 1 },
      { q: 'Recursion requires a?', options: ['Loop', 'Base case', 'Array', 'Stack'], ans: 1 },
      { q: 'DFS stands for?', options: ['Data First Search', 'Depth First Search', 'Distance First Search', 'None'], ans: 1 },
      { q: 'Greedy algorithm makes?', options: ['Random choices', 'Worst choices', 'Locally optimal choices', 'Global optimal choices always'], ans: 2 },
    ],
    Networking: [
      { q: 'IP stands for?', options: ['Internet Protocol', 'Internal Protocol', 'Internet Program', 'None'], ans: 0 },
      { q: 'HTTP stands for?', options: ['Hyper Text Transfer Protocol', 'High Text Transfer Protocol', 'Hyper Transfer Text Program', 'None'], ans: 0 },
      { q: 'DNS converts?', options: ['IP to MAC', 'Domain name to IP', 'IP to domain', 'URL to email'], ans: 1 },
      { q: 'OSI model has how many layers?', options: ['5', '6', '7', '8'], ans: 2 },
      { q: 'Router operates at which OSI layer?', options: ['Layer 1', 'Layer 2', 'Layer 3', 'Layer 4'], ans: 2 },
    ],
    Databases: [
      { q: 'SQL stands for?', options: ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'None'], ans: 0 },
      { q: 'Primary key uniquely identifies?', options: ['Column', 'Row', 'Table', 'Database'], ans: 1 },
      { q: 'SELECT * FROM table returns?', options: ['First row', 'Last row', 'All rows', 'Count'], ans: 2 },
      { q: 'JOIN combines data from?', options: ['One table', 'Two or more tables', 'Only views', 'Only indexes'], ans: 1 },
      { q: 'ACID in databases stands for?', options: ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Atomicity, Concurrency, Isolation, Dependability', 'None'], ans: 0 },
    ],
  },
  economics: {
    Microeconomics: [
      { q: 'Law of demand: price and demand are?', options: ['Directly related', 'Inversely related', 'Unrelated', 'Equal'], ans: 1 },
      { q: 'Opportunity cost means?', options: ['Actual cost', 'Hidden cost', 'Next best alternative forgone', 'Market price'], ans: 2 },
      { q: 'Perfect competition has?', options: ['One seller', 'Few sellers', 'Many sellers', 'Two sellers'], ans: 2 },
      { q: 'Elasticity measures?', options: ['Price change', 'Quantity change', 'Responsiveness of demand to price', 'Supply'], ans: 2 },
      { q: 'Monopoly has?', options: ['Many sellers', 'Two sellers', 'One seller', 'No seller'], ans: 2 },
    ],
    Macroeconomics: [
      { q: 'GDP stands for?', options: ['Gross Domestic Product', 'General Domestic Product', 'Gross Development Product', 'None'], ans: 0 },
      { q: 'Inflation means?', options: ['Rise in money supply', 'Rise in price level', 'Fall in GDP', 'Rise in exports'], ans: 1 },
      { q: 'Recession is?', options: ['Economic growth', 'Economic decline', 'Stable economy', 'High inflation'], ans: 1 },
      { q: 'Fiscal policy uses?', options: ['Interest rates', 'Money supply', 'Tax and spending', 'Exchange rates'], ans: 2 },
      { q: 'Monetary policy is controlled by?', options: ['Government', 'Central bank', 'Parliament', 'Corporations'], ans: 1 },
    ],
    Market: [
      { q: 'Supply curve slopes?', options: ['Downward', 'Upward', 'Horizontal', 'Vertical'], ans: 1 },
      { q: 'Equilibrium price is where?', options: ['Supply > Demand', 'Demand > Supply', 'Supply = Demand', 'No supply'], ans: 2 },
      { q: 'Market failure occurs when?', options: ['Prices are low', 'Resources are misallocated', 'Supply is high', 'Demand is low'], ans: 1 },
      { q: 'A public good is?', options: ['Excludable', 'Rival', 'Non-excludable and non-rival', 'Private'], ans: 2 },
      { q: 'Subsidy is given to?', options: ['Increase price', 'Decrease supply', 'Support producers', 'Increase tax'], ans: 2 },
    ],
    GDP: [
      { q: 'GDP measures?', options: ['Total exports', 'Total value of goods/services produced', 'Government spending', 'Population'], ans: 1 },
      { q: 'GDP per capita is?', options: ['GDP × Population', 'GDP / Population', 'GDP + Population', 'GDP - Population'], ans: 1 },
      { q: 'Nominal GDP is at?', options: ['Constant prices', 'Current prices', 'Real prices', 'Base year prices'], ans: 1 },
      { q: 'Which country has highest GDP (2024)?', options: ['China', 'USA', 'Germany', 'India'], ans: 1 },
      { q: 'GDP growth rate indicates?', options: ['Inflation', 'Economic growth', 'Unemployment', 'Trade balance'], ans: 1 },
    ],
    Trade: [
      { q: 'Exports are goods?', options: ['Imported', 'Sold to other countries', 'Produced locally', 'Subsidized'], ans: 1 },
      { q: 'Trade deficit means?', options: ['Exports > Imports', 'Imports > Exports', 'Exports = Imports', 'No trade'], ans: 1 },
      { q: 'Tariff is a?', options: ['Trade agreement', 'Tax on imports', 'Export subsidy', 'Import quota'], ans: 1 },
      { q: 'WTO stands for?', options: ['World Trade Organization', 'World Tax Organization', 'World Transport Organization', 'None'], ans: 0 },
      { q: 'Comparative advantage means?', options: ['Producing all goods cheaply', 'Producing at lower opportunity cost', 'Producing most goods', 'None'], ans: 1 },
    ],
  },
  hindi: {
    Grammar: [
      { q: '"राम खाना खाता है" — क्रिया है?', options: ['राम', 'खाना', 'खाता है', 'है'], ans: 2 },
      { q: 'संज्ञा के कितने भेद?', options: ['3', '4', '5', '6'], ans: 2 },
      { q: '"सुंदर" शब्द है?', options: ['संज्ञा', 'सर्वनाम', 'विशेषण', 'क्रिया'], ans: 2 },
      { q: '"बच्चे खेल रहे हैं" — वचन?', options: ['एकवचन', 'बहुवचन', 'द्विवचन', 'कोई नहीं'], ans: 1 },
      { q: 'हिंदी वर्णमाला में स्वर?', options: ['11', '13', '15', '10'], ans: 0 },
    ],
    Comprehension: [
      { q: 'अनुच्छेद का मुख्य विचार क्या है?', options: ['शीर्षक', 'केंद्रीय भाव', 'निष्कर्ष', 'परिचय'], ans: 1 },
      { q: '"पर्यायवाची" शब्द का अर्थ?', options: ['विपरीत अर्थ', 'समान अर्थ', 'अनेकार्थी', 'None'], ans: 1 },
      { q: '"विलोम" शब्द का अर्थ?', options: ['समान अर्थ', 'विपरीत अर्थ', 'अनेकार्थी', 'None'], ans: 1 },
      { q: '"मुहावरे" होते हैं?', options: ['शब्द', 'वाक्यांश', 'कविता', 'None'], ans: 1 },
      { q: 'गद्य और पद्य में अंतर?', options: ['भाषा', 'छंद', 'भाव', 'None'], ans: 1 },
    ],
    Literature: [
      { q: '"रामचरितमानस" के लेखक?', options: ['कबीर', 'तुलसीदास', 'सूरदास', 'मीराबाई'], ans: 1 },
      { q: '"गोदान" उपन्यास के लेखक?', options: ['जयशंकर प्रसाद', 'मुंशी प्रेमचंद', 'हजारी प्रसाद', 'महादेवी वर्मा'], ans: 1 },
      { q: 'कबीर थे?', options: ['कवि', 'संत कवि', 'नाटककार', 'None'], ans: 1 },
      { q: '"मधुशाला" के रचनाकार?', options: ['बच्चन', 'निराला', 'पंत', 'प्रसाद'], ans: 0 },
      { q: 'हिंदी साहित्य का स्वर्ण युग?', options: ['आदिकाल', 'भक्तिकाल', 'रीतिकाल', 'आधुनिककाल'], ans: 1 },
    ],
    Writing: [
      { q: 'पत्र के कितने प्रकार?', options: ['2', '3', '4', '5'], ans: 0 },
      { q: 'औपचारिक पत्र किसे लिखते हैं?', options: ['मित्र', 'अधिकारी', 'माता-पिता', 'भाई'], ans: 1 },
      { q: 'निबंध में होते हैं?', options: ['केवल परिचय', 'परिचय, विस्तार, निष्कर्ष', 'केवल निष्कर्ष', 'None'], ans: 1 },
      { q: 'संवाद लेखन में होता है?', options: ['एकालाप', 'बातचीत', 'वर्णन', 'None'], ans: 1 },
      { q: 'विज्ञापन का उद्देश्य?', options: ['मनोरंजन', 'प्रचार', 'शिक्षा', 'None'], ans: 1 },
    ],
    Poetry: [
      { q: '"दोहा" में होती हैं?', options: ['2 पंक्तियां', '4 पंक्तियां', '6 पंक्तियां', '8 पंक्तियां'], ans: 0 },
      { q: '"चौपाई" में होती हैं?', options: ['2 पंक्तियां', '4 पंक्तियां', '6 पंक्तियां', '8 पंक्तियां'], ans: 1 },
      { q: 'छंद का संबंध है?', options: ['अर्थ से', 'ध्वनि से', 'लय-ताल से', 'None'], ans: 2 },
      { q: '"अनुप्रास" अलंकार में?', options: ['स्वर दोहराते हैं', 'व्यंजन दोहराते हैं', 'अर्थ दोहराते हैं', 'None'], ans: 1 },
      { q: '"उपमा" अलंकार में होती है?', options: ['तुलना', 'विरोध', 'प्रश्न', 'None'], ans: 0 },
    ],
  },
};

const fallbackQs = [
  { q: 'SI unit of energy?', options: ['Watt', 'Newton', 'Joule', 'Pascal'], ans: 2 },
  { q: 'Who invented telephone?', options: ['Edison', 'Bell', 'Tesla', 'Marconi'], ans: 1 },
  { q: '15% of 200?', options: ['25', '30', '35', '20'], ans: 1 },
  { q: 'Closest planet to Sun?', options: ['Venus', 'Earth', 'Mercury', 'Mars'], ans: 2 },
  { q: 'Water formula?', options: ['H₂O₂', 'HO', 'H₂O', 'H₃O'], ans: 2 },
];

const getQuestions = (subjectId, topic) => questionsData[subjectId]?.[topic] || fallbackQs;
const MAX_VIOLATIONS = 3;

export default function PracticeQuiz() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [screen, setScreen] = useState('subjects'); // subjects | topics | focusPrompt | quiz | result
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [pendingSubject, setPendingSubject] = useState(null);
  const [pendingTopic, setPendingTopic] = useState(null);
  const quizActiveRef = useRef(false);
  const violationRef = useRef(0);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Save quiz score to backend when result screen is shown
  useEffect(() => {
    if (screen !== 'result') return;
    if (!user?.id || !selectedSubject || !selectedTopic || questions.length === 0) return;
    const avgTime = 30; // approximate seconds per question
    fetch('http://localhost:5000/api/ml/quiz-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: user.id,
        subject: selectedSubject.name,
        topic: selectedTopic,
        score: pct,
        correct: finalScore,
        total: questions.length,
        timePerQuestion: avgTime
      })
    })
      .then(r => { if (r.ok) setScoreSaved(true); })
      .catch(() => {});
  }, [screen]);

  useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);

  // Timer
  useEffect(() => {
    if (screen !== 'quiz' || answered) return;
    if (timer <= 0) { handleNext(true); return; }
    const id = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer, screen, answered]);

  // Focus mode
  useEffect(() => {
    const active = screen === 'quiz';
    quizActiveRef.current = active;
    if (!active) return;

    const onVisibility = () => {
      if (!quizActiveRef.current || !document.hidden) return;
      violationRef.current += 1;
      setViolationCount(violationRef.current);
      setShowViolationWarning(true);
      if (violationRef.current >= MAX_VIOLATIONS) {
        setAutoSubmitted(true);
        setScreen('result');
      }
    };
    const onBeforeUnload = e => { e.preventDefault(); e.returnValue = ''; };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [screen]);

  const requestStart = (subject, topic) => {
    setPendingSubject(subject);
    setPendingTopic(topic);
    setScreen('focusPrompt');
  };

  const confirmStart = () => {
    const qs = getQuestions(pendingSubject.id, pendingTopic);
    setSelectedSubject(pendingSubject);
    setSelectedTopic(pendingTopic);
    setQuestions(qs);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setAnswers([]);
    setScore(0);
    setTimer(30);
    setViolationCount(0);
    violationRef.current = 0;
    setAutoSubmitted(false);
    setShowViolationWarning(false);
    setScreen('quiz');
  };

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[currentQ].ans;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { selected: idx, correct: questions[currentQ].ans, isCorrect: correct }]);
  };

  const handleNext = (timedOut = false) => {
    if (timedOut && !answered) {
      setAnswers(prev => [...prev, { selected: -1, correct: questions[currentQ].ans, isCorrect: false }]);
    }
    if (currentQ + 1 >= questions.length) {
      setScreen('result');
    } else {
      setCurrentQ(q => q + 1);
      setSelected(null);
      setAnswered(false);
      setTimer(30);
    }
  };

  if (!user) return null;

  const finalScore = screen === 'result' ? answers.filter(a => a.isCorrect).length : score;
  const pct = questions.length ? Math.round((finalScore / questions.length) * 100) : 0;

  // ── SUBJECTS ──
  if (screen === 'subjects') return (
    <div className="pq-page page-enter">
      <div className="pq-hero">
        <div className="bg-orb" style={{ width: 400, height: 400, top: '-15%', right: '-5%', background: 'rgba(253,115,51,0.08)' }} />
        <div className="container">
          <div className="pq-hero-inner">
            <div className="pq-hero-left">
              <div className="pq-badge">🎯 Student Practice Zone</div>
              <h1 className="pq-title">Practice <span className="hero-gradient">Skills</span></h1>
              <p className="pq-subtitle">Pick a subject → choose a topic → start a 5-question timed quiz. LeetCode-style focus mode active.</p>
            </div>
            <div className="pq-hero-stats">
              <div className="pq-stat"><span className="pq-stat-num">10</span><span className="pq-stat-label">Subjects</span></div>
              <div className="pq-stat"><span className="pq-stat-num">50+</span><span className="pq-stat-label">Topics</span></div>
              <div className="pq-stat"><span className="pq-stat-num">250+</span><span className="pq-stat-label">Questions</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pq-body">
        <div className="pq-section-label">📚 All Subjects</div>
        <div className="pq-subjects-grid">
          {subjects.map(s => (
            <div key={s.id} className="pq-subject-card glass-card" onClick={() => { setSelectedSubject(s); setScreen('topics'); }}>
              <div className="pq-subject-top">
                <div className="pq-subject-icon" style={{ background: s.bg, borderColor: s.color + '40' }}>
                  {s.icon}
                </div>
                <FaChevronRight className="pq-subject-arrow" style={{ color: s.color }} />
              </div>
              <h3 className="pq-subject-name" style={{ color: s.color }}>{s.name}</h3>
              <p className="pq-subject-desc">{s.desc}</p>
              <div className="pq-subject-footer">
                <span className="pq-topic-count">{s.topics.length} topics</span>
                <span className="pq-topic-count">{s.topics.length * 5} questions</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── TOPICS ──
  if (screen === 'topics') return (
    <div className="pq-page page-enter">
      <div className="pq-hero" style={{ paddingBottom: '1.5rem' }}>
        <div className="container">
          <button className="pq-back-btn" onClick={() => setScreen('subjects')}><HiOutlineArrowLeft /> All Subjects</button>
          <div className="pq-topics-hero">
            <div className="pq-subject-icon-lg" style={{ background: selectedSubject.bg, borderColor: selectedSubject.color + '40' }}>
              {selectedSubject.icon}
            </div>
            <div>
              <h2 className="pq-topics-title" style={{ color: selectedSubject.color }}>{selectedSubject.name}</h2>
              <p className="pq-topics-sub">Choose a topic to start your quiz</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container pq-body">
        <div className="pq-topics-grid">
          {selectedSubject.topics.map((topic, i) => (
            <div key={i} className="pq-topic-card glass-card" onClick={() => requestStart(selectedSubject, topic)}
              style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="pq-topic-left">
                <div className="pq-topic-num" style={{ color: selectedSubject.color, borderColor: selectedSubject.color + '30', background: selectedSubject.bg }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="pq-topic-name">{topic}</h3>
                  <p className="pq-topic-meta">5 questions · ~2.5 min · Focus mode</p>
                </div>
              </div>
              <div className="pq-topic-right">
                <div className="pq-start-badge" style={{ background: selectedSubject.bg, color: selectedSubject.color, borderColor: selectedSubject.color + '40' }}>
                  Start →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── FOCUS PROMPT ──
  if (screen === 'focusPrompt') return (
    <div className="pq-page">
      <div className="pq-overlay">
        <div className="pq-focus-card glass-card">
          <div className="pq-focus-icon"><FaLock /></div>
          <h2 className="pq-focus-title">🔒 Focus Mode Required</h2>
          <p className="pq-focus-sub">
            <strong style={{ color: pendingSubject?.color }}>{pendingSubject?.name}</strong> — {pendingTopic}
          </p>
          <p className="pq-focus-text">This quiz requires your full attention. Rules:</p>
          <ul className="pq-focus-rules">
            <li><HiOutlineExclamation className="pq-rule-icon warn" /> Tab switching is <strong>detected and logged</strong></li>
            <li><HiOutlineExclamation className="pq-rule-icon warn" /> <strong>{MAX_VIOLATIONS} violations</strong> = auto-submit</li>
            <li><HiOutlineClock className="pq-rule-icon info" /> <strong>30 seconds</strong> per question</li>
            <li><HiOutlineShieldCheck className="pq-rule-icon ok" /> Stay focused to get your best score!</li>
          </ul>
          <div className="pq-focus-actions">
            <button className="pq-btn-cancel" onClick={() => setScreen('topics')}>Cancel</button>
            <button className="pq-btn-start" style={{ background: pendingSubject?.color }} onClick={confirmStart}>
              <FaLock /> I'm Ready — Start Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── QUIZ ──
  if (screen === 'quiz' && questions.length > 0) {
    const q = questions[currentQ];
    const progress = ((currentQ) / questions.length) * 100;
    const timerPct = (timer / 30) * 100;

    return (
      <div className="pq-page">
        {showViolationWarning && (
          <div className="pq-overlay">
            <div className="pq-violation-card glass-card">
              <div className="pq-violation-icon"><HiOutlineExclamation /></div>
              <h2 className="pq-violation-title">⚠️ Tab Switch Detected!</h2>
              <p className="pq-violation-text">You left the quiz. This has been recorded.</p>
              <div className="pq-violation-counter">
                <span className="pq-violation-num">{violationCount}</span>
                <span className="pq-violation-of">/ {MAX_VIOLATIONS}</span>
              </div>
              <p className="pq-violation-warn">
                {MAX_VIOLATIONS - violationCount > 0
                  ? `${MAX_VIOLATIONS - violationCount} more and quiz auto-submits!`
                  : 'Quiz auto-submitted!'}
              </p>
              <button className="pq-btn-dismiss" onClick={() => setShowViolationWarning(false)}>
                I Understand — Continue
              </button>
            </div>
          </div>
        )}

        {violationCount > 0 && !showViolationWarning && (
          <div className="pq-violation-bar">
            <FaLock /> Focus Mode · Violations: {violationCount}/{MAX_VIOLATIONS}
          </div>
        )}

        <div className="pq-quiz-layout">
          {/* LEFT PANEL — Subject info + progress */}
          <div className="pq-quiz-sidebar glass-card">
            <div className="pq-quiz-subject-badge" style={{ background: selectedSubject.bg, borderColor: selectedSubject.color + '40' }}>
              <span>{selectedSubject.icon}</span>
              <span style={{ color: selectedSubject.color }}>{selectedSubject.name}</span>
            </div>
            <div className="pq-quiz-topic-label">{selectedTopic}</div>

            <div className="pq-sidebar-progress">
              {questions.map((_, i) => (
                <div key={i} className={`pq-q-dot ${i < currentQ ? (answers[i]?.isCorrect ? 'dot-correct' : 'dot-wrong') : i === currentQ ? 'dot-active' : 'dot-pending'}`}
                  style={i === currentQ ? { borderColor: selectedSubject.color, background: selectedSubject.color + '30' } : {}}>
                  {i < currentQ ? (answers[i]?.isCorrect ? '✓' : '✗') : i + 1}
                </div>
              ))}
            </div>

            <div className="pq-sidebar-score">
              <HiOutlineChartBar />
              <span>Score: <strong>{score}</strong>/{currentQ}</span>
            </div>

            <div className={`pq-sidebar-timer ${timer <= 10 ? 'timer-danger' : timer <= 20 ? 'timer-warn' : ''}`}>
              <div className="pq-timer-ring" style={{ '--timer-pct': `${timerPct}%`, '--timer-color': timer <= 10 ? '#ef4444' : timer <= 20 ? '#f59e0b' : selectedSubject.color }}>
                <span className="pq-timer-num">{timer}</span>
                <span className="pq-timer-label">sec</span>
              </div>
            </div>

            <button className="pq-quit-btn" onClick={() => setScreen('topics')}>
              <HiOutlineArrowLeft /> Quit Quiz
            </button>
          </div>

          {/* RIGHT PANEL — Question */}
          <div className="pq-quiz-main">
            {/* Progress bar */}
            <div className="pq-progress-track">
              <div className="pq-progress-fill" style={{ width: `${progress}%`, background: selectedSubject.color }} />
            </div>
            <div className="pq-progress-label">
              <span>Question {currentQ + 1} of {questions.length}</span>
              <span style={{ color: selectedSubject.color }}>{Math.round(progress)}% complete</span>
            </div>

            <div className="pq-question-card glass-card">
              <div className="pq-q-number" style={{ color: selectedSubject.color }}>Q{currentQ + 1}</div>
              <h2 className="pq-question-text">{q.q}</h2>

              <div className="pq-options">
                {q.options.map((opt, i) => {
                  let cls = 'pq-option';
                  if (answered) {
                    if (i === q.ans) cls += ' pq-opt-correct';
                    else if (i === selected && i !== q.ans) cls += ' pq-opt-wrong';
                    else cls += ' pq-opt-dim';
                  } else if (selected === i) cls += ' pq-opt-selected';
                  return (
                    <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={answered}
                      style={answered && i === q.ans ? { borderColor: selectedSubject.color } : {}}>
                      <span className="pq-opt-letter" style={answered && i === q.ans ? { background: selectedSubject.color, color: '#fff' } : {}}>
                        {['A', 'B', 'C', 'D'][i]}
                      </span>
                      <span className="pq-opt-text">{opt}</span>
                      {answered && i === q.ans && <HiOutlineCheckCircle className="pq-opt-icon correct-icon" />}
                      {answered && i === selected && i !== q.ans && <HiOutlineXCircle className="pq-opt-icon wrong-icon" />}
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className={`pq-feedback ${selected === q.ans ? 'pq-feedback-correct' : 'pq-feedback-wrong'}`}>
                  <span>{selected === q.ans ? '✅ Correct! Great job.' : `❌ Wrong. Answer: ${q.options[q.ans]}`}</span>
                  <button className="pq-next-btn" style={{ background: selectedSubject.color }} onClick={() => handleNext(false)}>
                    {currentQ + 1 < questions.length ? 'Next →' : 'See Results 🎯'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULT ──
  if (screen === 'result') {
    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
    const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🌟' : pct >= 60 ? '👍' : '📚';
    return (
      <div className="pq-page page-enter">
        <div className="container pq-result-wrap">
          <div className="pq-result-card glass-card">
            {autoSubmitted && (
              <div className="pq-auto-banner">
                <HiOutlineExclamation /> Quiz auto-submitted: {MAX_VIOLATIONS} tab-switch violations
              </div>
            )}
            {scoreSaved && (
              <div style={{ textAlign: 'center', color: '#10b981', fontSize: '0.85rem', marginBottom: 8, fontWeight: 600 }}>
                ✅ Score saved to your profile — AI analysis updated!
              </div>
            )}
            <div className="pq-result-trophy">{emoji}</div>
            <h2 className="pq-result-title">{autoSubmitted ? 'Auto-Submitted!' : pct === 100 ? 'Perfect Score!' : pct >= 60 ? 'Well Done!' : 'Keep Practising!'}</h2>
            <p className="pq-result-subject" style={{ color: selectedSubject?.color }}>
              {selectedSubject?.icon} {selectedSubject?.name} — {selectedTopic}
            </p>

            <div className="pq-result-ring" style={{ borderColor: autoSubmitted ? '#ef4444' : selectedSubject?.color }}>
              <span className="pq-result-pct">{pct}%</span>
              <span className="pq-result-grade">Grade {grade}</span>
            </div>

            <div className="pq-result-stats">
              <div className="pq-result-stat">
                <HiOutlineCheckCircle style={{ color: '#10b981' }} />
                <span>{finalScore} Correct</span>
              </div>
              <div className="pq-result-stat">
                <HiOutlineXCircle style={{ color: '#ef4444' }} />
                <span>{questions.length - finalScore} Wrong</span>
              </div>
              {violationCount > 0 && (
                <div className="pq-result-stat">
                  <HiOutlineExclamation style={{ color: '#f59e0b' }} />
                  <span>{violationCount} Violations</span>
                </div>
              )}
            </div>

            <div className="pq-review">
              <h3 className="pq-review-title">Answer Review</h3>
              {questions.map((q, i) => (
                <div key={i} className={`pq-review-row ${answers[i]?.isCorrect ? 'pq-rev-correct' : 'pq-rev-wrong'}`}>
                  <span className="pq-rev-num">Q{i + 1}</span>
                  <span className="pq-rev-q">{q.q}</span>
                  <span className="pq-rev-ans">→ {q.options[q.ans]}</span>
                  <span className="pq-rev-icon">{answers[i]?.isCorrect ? <HiOutlineCheckCircle /> : <HiOutlineXCircle />}</span>
                </div>
              ))}
            </div>

            <div className="pq-result-actions">
              <button className="pq-btn-retry" style={{ borderColor: selectedSubject?.color, color: selectedSubject?.color }}
                onClick={() => requestStart(selectedSubject, selectedTopic)}>
                🔄 Retry
              </button>
              <button className="pq-btn-topics" onClick={() => setScreen('topics')}>
                📚 Other Topics
              </button>
              <button className="pq-btn-subjects" onClick={() => setScreen('subjects')}>
                🏠 All Subjects
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
