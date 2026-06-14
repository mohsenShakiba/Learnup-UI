import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material';


export const createLearnupTheme = (mode: PaletteMode) => {
  const sufaceBackground = mode === 'dark' ? 'rgba(23, 20, 25)' : '#f7f8fb';
  const paperBackgorund = mode === 'dark' ? 'rgba(25, 23, 29)' : '#ffffff';
  const dividerColor = mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#60a5fa',
        light: '#60a5fa',
        dark: '#60a5fa',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6945cc',
        light: '#5232a8',
        dark: '#392375',
        contrastText: '#ffffff',
      },
      success: {
        light: '#34d399',
        main: '#059669',
        dark: '#047857',
      },
      warning: {
        main: '#d97706',
      },
      error: {
        main: '#dc2626',
      },
      background: {
        default: sufaceBackground,
        paper: paperBackgorund,
      },
      text: {
        primary: mode === 'dark' ? '#f9fafb' : '#111827',
        secondary: mode === 'dark' ? 'rgba(255,255,255,0.6)' : '#4b5563',
      },
      divider: dividerColor,
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    typography: {
      fontFamily: 'IranSans, Arial, sans-serif',

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
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(20px)'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: paperBackgorund,
            padding: 16,
            border: `1px solid ${dividerColor}`,
            boxShadow: mode === 'dark'
              ? '0 10px 24px rgba(0, 0, 0, 0.25)'
              : '0 10px 24px rgba(17, 24, 39, 0.06)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: paperBackgorund,
            padding: 16,
            border: `1px solid ${dividerColor}`,
            boxShadow: mode === 'dark'
              ? '0 10px 24px rgba(0, 0, 0, 0.25)'
              : '0 10px 24px rgba(17, 24, 39, 0.06)',
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            borderTop: '1px solid',
            borderColor: dividerColor,
          }
        }
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
};
