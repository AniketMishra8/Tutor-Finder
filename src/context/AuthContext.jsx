import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

const MOCK_USERS = [
  { id: 'stu_123', email: 'alex@student.com', password: 'password', role: 'student', name: 'Alex Johnson' },
  { id: 'teacher_1', email: 'priya@teacher.com', password: 'password', role: 'teacher', name: 'Dr. Priya Sharma' },
  { id: 'parent_1', email: 'johnson@parent.com', password: 'password', role: 'parent', name: 'Mr. Johnson', studentEmail: 'alex@student.com' }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [usersDb, setUsersDb] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock DB
    let existingDb = localStorage.getItem('tutor_finder_db');
    if (!existingDb) {
      localStorage.setItem('tutor_finder_db', JSON.stringify(MOCK_USERS));
      setUsersDb(MOCK_USERS);
    } else {
      setUsersDb(JSON.parse(existingDb));
    }

    // Check active session
    const savedSession = localStorage.getItem('tutor_finder_session');
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        console.error('Failed to parse session from localStorage');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const foundUser = usersDb.find(u => u.email === email && u.password === password);
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // If parent, find the linked student name
    let sessionUser = { ...foundUser };
    if (foundUser.role === 'parent') {
      const child = usersDb.find(u => u.email === foundUser.studentEmail && u.role === 'student');
      sessionUser.studentName = child ? child.name : 'your child';
    }

    // Remove password from active session
    delete sessionUser.password;
    
    setUser(sessionUser);
    localStorage.setItem('tutor_finder_session', JSON.stringify(sessionUser));
    return sessionUser;
  };

  const register = (userData) => {
    // Check if email already exists
    if (usersDb.some(u => u.email === userData.email)) {
      throw new Error('An account with this email already exists.');
    }

    // Validate parent linking
    if (userData.role === 'parent') {
      const childExists = usersDb.some(u => u.email === userData.studentEmail && u.role === 'student');
      if (!childExists) {
        throw new Error('We could not find a registered student with that email. Please ensure the student has registered first.');
      }
    }

    const newUser = {
      ...userData,
      id: `${userData.role}_${Date.now()}`
    };

    const updatedDb = [...usersDb, newUser];
    setUsersDb(updatedDb);
    localStorage.setItem('tutor_finder_db', JSON.stringify(updatedDb));
    
    // Auto-login after registration
    return login(userData.email, userData.password);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tutor_finder_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
