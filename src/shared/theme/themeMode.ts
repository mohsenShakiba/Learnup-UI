import { createContext, useContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeModeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
};

export const THEME_MODE_STORAGE_KEY = 'learnup.themeMode';

export const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(
  undefined,
);

export function getStoredThemeMode (): ThemeMode {
  const stored = localStorage.getItem(THEME_MODE_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

export function useThemeMode () {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a LearnupThemeProvider');
  }
  return context;
}
