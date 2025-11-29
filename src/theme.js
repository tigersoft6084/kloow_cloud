// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      xxl: 1920, // <-- custom breakpoint
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif'
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#3A71E1',
          color: 'white',
          textTransform: 'none',
          '&.Mui-disabled': {
            backgroundColor: '#333344', // custom disabled background
            color: '#aaa' // custom disabled text color
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&::placeholder': {
            color: '#aaa', // 👈 your custom placeholder color
            opacity: 1 // ensures color shows fully (default is 0.5)
          }
        }
      }
    }
  }
});

export default theme;
