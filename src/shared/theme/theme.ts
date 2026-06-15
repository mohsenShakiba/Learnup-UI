import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material';


export const createLearnupTheme = (mode: PaletteMode) => {
  const sufaceBackground = mode === 'dark' ? 'rgba(23, 20, 25)' : 'rgba(233, 230, 235)';
  const paperBackgorund = mode === 'dark' ? 'rgba(25, 23, 29)' : 'rgba(235, 233, 239)';
  const dividerColor = mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  return createTheme({
    direction: 'rtl',
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
      h1: {
        fontSize: "32px",
      },
      h2: {
        fontSize: "26px",
      },
      h3: {
        fontSize: "24px",
      },
      h4: {
        fontSize: "24px",
      },
      h5: {
        fontSize: "20px",
      },
      h6: {
        fontSize: "20px",
      },
      body1: {
        fontSize: "16px",
      },
      body2: {
        fontSize: "14px",
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
            boxShadow: 'none'
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: paperBackgorund,
            padding: 16,
            border: `1px solid ${dividerColor}`,
            boxShadow: 'none'
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
