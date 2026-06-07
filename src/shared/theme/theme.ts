import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material';

export const createLearnupTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#059669',
      light: '#34d399',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#d97706',
    },
    error: {
      main: '#dc2626',
    },
    background: {
      default: mode === 'dark' ? '#111827' : '#f7f8fb',
      paper: mode === 'dark' ? '#1f2937' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#f9fafb' : '#111827',
      secondary: mode === 'dark' ? '#d1d5db' : '#4b5563',
    },
    divider: mode === 'dark' ? '#374151' : '#e5e7eb',
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  typography: {
    fontFamily: 'IranSans, Arial, sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 800,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minHeight: '100vh',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: 16,
          border: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
          boxShadow: mode === 'dark'
            ? '0 10px 24px rgba(0, 0, 0, 0.25)'
            : '0 10px 24px rgba(17, 24, 39, 0.06)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});
