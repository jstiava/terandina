import { alpha, createTheme, darken, lighten } from "@mui/material";
import { Fenix, Montaga, Playwrite_IN, Zain } from "next/font/google";

const playwrite_cursive_font = Playwrite_IN({
  variable: "--font-playwrite-in",
});

export const zain_sans_font = Zain({
  variable: "--font-zain",
  subsets: ["latin"],
  weight: "700"
});

const fenix = Fenix({
  subsets: ['latin'],
  weight: "400"
})

const theme = createTheme({
  palette: {
    background: {
      paper: '#f4f4f4'
    },
    primary: {
      main: "#550e00",
    },
    secondary: {
      main: "#ffffff"
    }
  },
  components: {
    MuiChip: {
      styleOverrides: {
        sizeSmall: {
          height: '1.5rem',
        },
        root: {
          height: "2rem"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            padding: "0 0.25rem",
            borderRadius: "0 !important",
            height: "3rem",
            fontSize: "1.35rem",
          },
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: 'capitalize',
          height: "3rem",
          fontSize: "1.125rem",
          lineHeight: "115%",
          variants: [
            {
              props: { variant: "flipped" },
              style: {
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.8),
                },
                backgroundColor: '#ffffff',
                color: '#46210A',
              }
            },
          ]
        }
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          '& .MuiAlertTitle-root': {
            fontSize: "1.25rem",
            margin: "0.05rem 0 0.25rem 0"
          }
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: [
            zain_sans_font.style.fontFamily,
            'sans',
          ].join(','),
        }
      }
    }
  },
  typography: {

    h1: {
      fontSize: "2.5rem",
      fontFamily: [
        fenix.style.fontFamily,
        'sans-serif',
      ].join(','),
    },
    h2: {
      fontSize: "2.5rem",
      fontFamily: [
        fenix.style.fontFamily,
        'sans-serif',
      ].join(','),
    },
    h4: {
      fontSize: "2rem",
      fontWeight: 800,
    },
    h5: {
      // fontWeight: 400,
      fontFamily: [
        fenix.style.fontFamily,
        'sans-serif',
      ].join(','),
    },
    h6: {
      fontWeight: 700
    },
    body1: {
      fontSize: "1rem",
      fontFamily: [
        fenix.style.fontFamily,
        'sans-serif',
      ].join(','),
    },
    caption: {
      fontSize: "0.95rem",
      padding: "0.5rem 0.75rem",
      opacity: 0.6
    },
    fontFamily: [
      zain_sans_font.style.fontFamily,
      'sans',
    ].join(','),
  },
  breakpoints: {
    values: {
      xs: 425,
      sm: 768,
      md: 1024,
      lg: 1440,
      xl: 1920
    },
  },
});


export default theme;