import { createTheme } from "@mui/material/styles";
import darkScrollbar from "@mui/material/darkScrollbar";

export const light = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#449dbf",
    },
    secondary: {
      main: "#00a4e9",
    },
    background: {
      default: "#ffeace35",
    },
    success: { main: "#46a46c" },
  },
  typography: {
    fontFamily: "Oswald",
    body1: {
      fontFamily: "Lato",
    },
    body2: {
      fontFamily: "Lato",
    },
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
});

export const dark = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: darkScrollbar(),
      },
    },
  },
  palette: {
    mode: "dark",
    primary: {
      main: "#449dbf",
    },
    secondary: {
      main: "#8031e8",
    },
    background: {
      main: "#cfddccc9",
    },
  },
  typography: {
    fontFamily: "Oswald",
    body1: {
      fontFamily: "Lato",
    },
    body2: {
      fontFamily: "Lato",
    },
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
});
