import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#075db8',
      dark: '#064a94',
    },
    secondary: {
      main: '#0f766e',
      dark: '#115e59',
    },
    background: {
      default: '#f3f6fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#172033',
      secondary: '#667085',
    },
  },
  typography: {
    fontFamily: ['Inter', 'Roboto', 'Arial', 'sans-serif'].join(','),
    fontSize: 12.5,
    body1: {
      fontSize: 13,
      lineHeight: 1.35,
    },
    body2: {
      fontSize: 12,
      lineHeight: 1.35,
    },
    h4: {
      fontSize: 24,
      fontWeight: 900,
      letterSpacing: '-0.03em',
    },
    h5: {
      fontSize: 20,
      fontWeight: 900,
      letterSpacing: '-0.02em',
    },
    h6: {
      fontSize: 16,
      fontWeight: 800,
    },
    button: {
      fontSize: 12.5,
      fontWeight: 800,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(7, 93, 184, 0.08)',
          boxShadow: '0 10px 24px rgba(15, 36, 75, 0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 32,
          borderRadius: 10,
          padding: '4px 10px',
          fontSize: 12.5,
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 12,
          fontWeight: 700,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 34,
          borderRadius: 10,
          fontSize: 12.5,
        },
        input: {
          padding: '6px 10px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          padding: '6px 10px',
          minHeight: 'unset',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 32,
          fontSize: 12.5,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: 12,
          padding: '6px 10px',
          lineHeight: 1.25,
        },
        head: {
          fontWeight: 800,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          minHeight: 38,
        },
      },
    },
  },
})

export default theme