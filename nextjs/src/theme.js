import { createMuiTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

// Create a theme instance.
const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      "Raleway",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ]
  },
  palette: {
    primary: {
      main: "#025159",
      light: "#3e7d86",
      dark: "#002830"
    },
    secondary: {
      main: "#F28241",
      light: "#ffb36f",
      dark: "#ba5312"
    },
    error: {
      main: red.A400
    },
    background: {
      default: "#12130E"
    }
  }
});

export default theme;
