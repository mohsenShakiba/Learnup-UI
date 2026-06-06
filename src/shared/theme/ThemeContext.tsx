import { CssBaseline, ThemeProvider } from '@mui/material';
import type { ReactNode } from 'react';
import { learnupTheme } from './theme';

export function LearnupThemeProvider ({ children }: { children: ReactNode; }) {
  return (
    <ThemeProvider theme={learnupTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
