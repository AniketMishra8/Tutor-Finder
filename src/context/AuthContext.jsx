import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Using absolute URL so it works without restarting Vite proxy
const API_URL = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tutor_finder_token');
    if (token) {
      const savedUser = localStorage.getItem('tutor_finder_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          console.error("Failed to parse saved user");
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to login');
    }

    localStorage.setItem('tutor_finder_token', data.token);
    localStorage.setItem('tutor_finder_user', JSON.stringify(data.user));
    setUser(data.user);
    
    return data.user;
  };

  const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to register');
    }

    // Auto-login upon registration
    localStorage.setItem('tutor_finder_token', data.token);
    localStorage.setItem('tutor_finder_user', JSON.stringify(data.user));
    setUser(data.user);
    
    return data.user;
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('tutor_finder_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tutor_finder_token');
    localStorage.removeItem('tutor_finder_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
