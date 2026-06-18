import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material';


export const createLearnupTheme = (mode: PaletteMode) => {
  const sufaceBackground = mode === 'dark' ? 'rgba(23, 20, 25)' : 'rgba(250, 244, 235)';
  const paperBackgorund = mode === 'dark' ? 'rgba(25, 23, 29)' : 'rgba(247, 239, 225)';
  const dividerColor = mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(230, 226, 218)';
  return createTheme({
    direction: 'rtl',
    palette: {
      mode,
      primary: {
        main: '#778873',
        light: '#A1BC98',
        dark: '#778873',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6945cc',
        light: '#5232a8',
        dark: '#392375',
        contrastText: '#ffffff',
      },
      success: {
        light: '#587a50',
        main: '#587a50',
        dark: '#587a50',
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
        secondary: mode === 'dark' ? '#747d78' : '#747d78',
      },
      divider: dividerColor,
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    typography: {
      fontFamily: 'IranSans, Roboto, sans-serif',
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
            boxShadow: 'none',
            borderRadius: '16px'
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            background: paperBackgorund,
            padding: 16,
            border: `1px solid ${dividerColor}`,
            boxShadow: 'none',
            borderRadius: '16px'
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          }
        }
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
