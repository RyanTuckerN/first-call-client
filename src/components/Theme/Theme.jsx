import { createTheme } from "@mui/material/styles";
// import { blue, red } from "@mui/material/colors";

// const headingStyles = {
//   fontFamily: ["'Helvetica Neue'", "Helvetica", "sans-serif"].toString(),
//   fontWeight: 200,
// };

// const theme = createTheme({
//   palette: {
//     primary: red,
//     secondary: blue,
//   },
//   typography: {
//     fontFamily: ["'Fira Mono'", "Menlo", "monospace"].toString(),
//     h1: headingStyles,
//     h2: headingStyles,
//     h3: headingStyles,
//     h4: headingStyles,
//     h5: headingStyles,
//     h6: {
//       fontWeight: 400,
//     },
//     overline: {
//       fontSize: "0.875rem",
//       fontWeight: 500,
//       letterSpacing: 2,
//     },
//     button: {
//       fontWeight: 500,
//     },
//   },
//   shape: {
//     borderRadius: 6,
//   },
//   overrides: {
//     MuiFab: {
//       extended: {
//         padding: "0 24px",
//       },
//       label: {
//         fontSize: "1rem",
//       },
//     },
//   },
// });

export const light = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#449dbf',
    },
    secondary: {
      main: '#1f1e21',
    },
    // error: {
    //   main: '#006eedc9'
    // }
  },
  typography: {
    fontFamily: 'Oswald',
    body1: {
      fontFamily: 'Lato',
    },
    body2: {
      fontFamily: 'Lato',
    },
  // },
  // typography: {
        // fontFamily: ["'Lato'", "Sans serif", "monospace"].toString(),
        // h1: headingStyles,
        // h2: headingStyles,
        // h3: headingStyles,
        // h4: headingStyles,
        // h5: headingStyles,
        // h6: {
          // fontWeight: 800,
        // },
        overline: {
          fontSize: "0.875rem",
          fontWeight: 500,
          letterSpacing: 2,
        },
        button: {
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 3,
      },
      overrides: {
        MuiFab: {
          extended: {
            padding: "0 24px",
          },
          label: {
            fontSize: "1rem",
          },
        },
      },
})

// export default theme;
export const dark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#449dbf',
    },
    secondary: {
      main: '#8031e8',
    },
    // error: {
    //   main: '#006eedc9'
    // },
    background: {
      main: '#cfddccc9'
    }
  },
  typography: {
    fontFamily: 'Oswald',
    body1: {
      fontFamily: 'Lato',
    },
    body2: {
      fontFamily: 'Lato',
    },
  // },
  // typography: {
        // fontFamily: ["'Lato'", "Sans serif", "monospace"].toString(),
        // h1: headingStyles,
        // h2: headingStyles,
        // h3: headingStyles,
        // h4: headingStyles,
        // h5: headingStyles,
        // h6: {
          // fontWeight: 800,
        // },
        overline: {
          fontSize: "0.875rem",
          fontWeight: 500,
          letterSpacing: 2,
        },
        button: {
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 3,
      },
      overrides: {
        MuiFab: {
          extended: {
            padding: "0 24px",
          },
          label: {
            fontSize: "1rem",
          },
        },
      },
})