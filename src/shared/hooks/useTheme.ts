import { useState } from 'react';
import { useTheme as useThemeSystem, Theme } from '../styles/theme';

export const useTheme = (initialDarkMode: boolean = true): { theme: Theme; isDark: boolean; toggleTheme: () => void } => {
  const [isDark, setIsDark] = useState(initialDarkMode);
  const theme = useThemeSystem(isDark);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return { theme, isDark, toggleTheme };
};
