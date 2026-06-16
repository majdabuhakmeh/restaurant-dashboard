import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main:  '#FF2D6B',
      light: '#ff6b9d',
      dark:  '#d4175a',
    },
    secondary: {
      main:  '#c084fc',
      light: '#e9d5ff',
      dark:  '#9333ea',
    },
    success: { main: '#10b981' },
    warning: { main: '#f59e0b' },
    error:   { main: '#ef4444' },
    info:    { main: '#3b82f6' },
    background: {
      default: '#f8f9fc',
      paper:   '#ffffff',
    },
    text: {
      primary:   '#1f2937',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '10px 20px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #FF2D6B, #d4175a)',
          boxShadow: '0 4px 14px rgba(255,45,107,0.35)',
          '&:hover': {
            background: 'linear-gradient(135deg, #e8195a, #b80f47)',
            boxShadow: '0 4px 18px rgba(255,45,107,0.50)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
          border: '1px solid #f3f4f6',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 10 },
        },
      },
    },
  },
});

export default theme;
