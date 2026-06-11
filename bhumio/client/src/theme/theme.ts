import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00BFA5', // Emerald/Teal from snapshot action buttons
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#00B0FF', // Sky Blue info color
      contrastText: '#ffffff',
    },
    success: {
      main: '#10B981', // Clean success mint green
      light: '#EEFBF7',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#F59E0B',
      light: '#FEF3C7',
    },
    error: {
      main: '#EF4444',
      light: '#FEE2E2',
    },
    background: {
      default: '#F5F7FA', // Soft bright slate background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B', // Deep Slate Obsidian
      secondary: '#64748B', // Soft gray
    },
    divider: '#E8ECEB', // Soft border divider color from snapshot
  },
  typography: {
    fontFamily: '"Inter", "Outfit", sans-serif',
    h1: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
    },
    subtitle1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Outfit", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 16, // Beautiful rounded corners from snapshot
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #E8ECEB', // Clean card outline matching snapshot
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0px 8px 24px rgba(149, 157, 165, 0.1)',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 24, // Rounded pill-shaped buttons
          padding: '6px 18px',
          fontWeight: 600,
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#00BFA5',
            backgroundImage: 'linear-gradient(135deg, #00BFA5 0%, #00B0FF 100%)', // Subtle premium gradient
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#00A892',
              boxShadow: '0px 4px 12px rgba(0, 191, 165, 0.2)',
            },
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: '#00B0FF',
            '&:hover': {
              backgroundColor: '#009BE0',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Outfit", sans-serif',
          fontWeight: 600,
          textTransform: 'none',
          fontSize: '1rem',
        },
      },
    },
  },
});

export default theme;
