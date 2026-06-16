import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main:  '#a855f7',  // soft violet
      light: '#d8b4fe',  // lavender
      dark:  '#7c3aed',  // deep violet
    },
    secondary: {
      main:  '#f472b6',  // blush pink
      light: '#fbcfe8',
      dark:  '#db2777',
    },
    success: { main: '#34d399', dark: '#059669' },
    warning: { main: '#fbbf24', dark: '#d97706' },
    error:   { main: '#f87171', dark: '#e11d48' },
    info:    { main: '#60a5fa', dark: '#2563eb' },
    background: {
      default: '#faf8ff',  // barely-lavender white
      paper:   '#ffffff',
    },
    text: {
      primary:   '#1e1b4b',  // deep indigo instead of harsh black
      secondary: '#6b7280',
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
          background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
          boxShadow: '0 4px 14px rgba(168,85,247,0.30)',
          '&:hover': {
            background: 'linear-gradient(135deg, #9333ea, #6d28d9)',
            boxShadow: '0 4px 18px rgba(168,85,247,0.45)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: '0 2px 16px rgba(139,92,246,0.08), 0 0 0 1px rgba(139,92,246,0.06)',
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#a855f7',
          },
        },
      },
    },
  },
});

export default theme;
