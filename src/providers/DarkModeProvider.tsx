import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { enable as enableDarkMode, disable as disableDarkMode } from 'darkreader';

interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModerProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    setIsDarkMode(newMode);
  };

  useEffect(() => {
    if (isDarkMode) {
      const darkTheme = {
        brightness: 110,
        contrast: 105,
        sepia: 0,
      };
      enableDarkMode(darkTheme);
    } else {
      disableDarkMode();
    }
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode debe ser usado dentro de un DarkModerProvider');
  }
  return context;
};
