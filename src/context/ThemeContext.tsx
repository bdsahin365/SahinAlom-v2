/**
 * Theme context for dark/light mode management
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageManager } from '../utils/storage';
import { STORAGE_KEYS } from '../config/index';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  initialDarkMode?: boolean;
}

/**
 * Theme Provider Component
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialDarkMode = true,
}) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Try to load from localStorage first
    const stored = StorageManager.getItem<boolean>(STORAGE_KEYS.THEME);
    if (stored !== null) return stored;

    // Check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    return initialDarkMode;
  });

  // Persist theme changes
  useEffect(() => {
    StorageManager.setItem(STORAGE_KEYS.THEME, darkMode);

    // Update DOM
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const value: ThemeContextType = {
    darkMode,
    toggleDarkMode,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
