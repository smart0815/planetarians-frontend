import { createTheme } from "@mui/material/styles";

const mainBlack = "#100300";
const mainWhite = "#ffffff";
const blue = "#1722d2";
// Create a theme instance.
const theme = createTheme({
  palette: {
    common: {
      black: mainBlack,
      white: mainWhite,
      blue: blue,
    },
    primary: {
      main: mainBlack,
    },
    secondary: {
      main: mainWhite,
    },
    info: {
      main: blue,
    },
  },
  typography: {
    h1: {
      fontSize: 45,
      fontWeight: "bold",
      color: "white",
      marginBottom: 18,
      '@media (max-width:960px)': {
        fontSize: 32
      }
    },
    h2: {
      fontSize: 20,
      fontWeight: "bold",
      '@media (max-width:960px)': {
        fontSize: 16
      }
    },
    h3: {
      fontSize: 14,
      marginBottom: 12,
      fontWeight: "bold",
    },
    a: {
      color: mainBlack,
    },
    body1: {
      fontFamily: 'Golos-Regular'
    }
  },
});

export default theme;
