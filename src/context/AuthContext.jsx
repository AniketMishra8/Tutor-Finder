import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Point this to your new Node Express server
const API_URL = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Instead of loading from localStorage DB, we just check if we have a JWT token
  useEffect(() => {
    const token = localStorage.getItem('tutor_finder_token');
    if (token) {
      // In a full production app, you would make a GET /api/auth/me request here
      // to validate the token and get the fresh user profile. 
      // For this prototype, if they have a user payload saved alongside the token, we load it.
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

    // Save JWT token and basic user info to persist session
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

    // Auto-login after successful registration
    localStorage.setItem('tutor_finder_token', data.token);
    localStorage.setItem('tutor_finder_user', JSON.stringify(data.user));
    setUser(data.user);

    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tutor_finder_token');
    localStorage.removeItem('tutor_finder_user');
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
