import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material';


export const createLearnupTheme = (mode: PaletteMode) => {
  const sufaceBackground = mode === 'dark' ? '#212021' : '#f7f8fb';
  const paperBackgorund = mode === 'dark' ? '#2b282b' : '#ffffff';
  const dividerColor = mode === 'dark' ? '#383638' : '#e5e7eb';
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
        secondary: mode === 'dark' ? '#d1d5db' : '#4b5563',
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
            padding: 16,
            border: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
            boxShadow: mode === 'dark'
              ? '0 10px 24px rgba(0, 0, 0, 0.25)'
              : '0 10px 24px rgba(17, 24, 39, 0.06)',
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            background: paperBackgorund,
            borderTop: '1px solid',
            borderColor: dividerColor
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
