import type { PaletteMode } from '@mui/material';
import { createTheme } from '@mui/material';


export const createLearnupTheme = (mode: PaletteMode) => {
  const sufaceBackground = mode === 'dark' ? 'rgba(23, 20, 25)' : 'rgba(250, 250, 250)';
  const paperBackgorund = mode === 'dark' ? 'rgba(25, 23, 29)' : 'rgba(255, 255, 255)';
  const dividerColor = mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(240, 240, 240)';
  return createTheme({
    direction: 'rtl',
    palette: {
      mode,
      primary: {
        main: '#005eff',
        light: '#4d8eff',
        dark: '#0444b3',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#6945cc',
        light: '#5232a8',
        dark: '#392375',
        contrastText: '#ffffff',
      },
      background: {
        default: sufaceBackground,
        paper: paperBackgorund,
      },
      text: {
        primary: mode === 'dark' ? '#f9fafb' : '#111827',
        secondary: mode === 'dark' ? '#9ca3af' : '#6b7280',
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
            padding: 8,
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
            padding: 8,
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
            backgroundColor: paperBackgorund,
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            border: '1px solid',
            borderColor: dividerColor
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
};
