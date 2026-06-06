import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import { useMemo, type ReactNode } from 'react';
import { createLearnupTheme } from './theme';

export function LearnupThemeProvider ({ children }: { children: ReactNode; }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () => createLearnupTheme(prefersDarkMode ? 'dark' : 'light'),
    [prefersDarkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
