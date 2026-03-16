import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Check local storage or system preference
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('tutor_finder_theme');
    if (saved) return saved;
    // Default to dark mode given the project's original feel, but it will be togglable
    return 'dark'; 
  });

  useEffect(() => {
    // Apply theme class to the document body
    document.body.className = theme === 'dark' ? 'dark-theme' : 'light-theme';
    // Save to local storage
    localStorage.setItem('tutor_finder_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
