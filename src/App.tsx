import * as React from "react";
import { Component } from "react";

import "./App.css";
import Home from "./components/Home/Home";

class App extends Component {
  render() {
    return (
      <div className="App">
        Hello from App.tsx!
        <Home />
      </div>
    );
  }
}

export default App;
