// import * as React from "react";
import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
// import "./App.css";
import Home from "./components/Home/Home";
import {ThemeProvider} from '@mui/styles'
import theme from './components/Theme/Theme'

class App extends Component {
  render() {
    return (
      <div>
        {/* Hello from App.tsx! */}
        <Router>
          <ThemeProvider theme={theme}>
            <Home />
          </ThemeProvider>
        </Router>
      </div>
    );
  }
}

export default App;
