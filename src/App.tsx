// import * as React from "react";
import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
// import "./App.css";
import Home from "./components/Home/Home";
import { UserCtx } from "./components/Context/MainContext";
import {
  UserSetter,
  TokenSetter,
  ColorSetter,
  EmailSetter,
  StateSetter,
} from "./App.types";
import { User, UserAuth } from "./types/API.types";
import { light, dark } from "./components/Theme/Theme";
import { ThemeProvider } from "@mui/material/styles";
import { fetchHandler } from "./components/_helpers/fetchHandler";
import API_URL from "./components/_helpers/environment";
import { Snackbar, Alert } from "@mui/material";

interface AppProps {}

export interface AppState {
  user: User | null;
  token: string;
  auth: boolean | null;
  darkModeOn: string;
  snackBarOpen: boolean;
  snackMessage: string;
  snackSeverity: "success" | "warning" | "error" | "info";
  handleSnackBar: (
    snackMessage: string,
    snackSeverity: "success" | "warning" | "error" | "info"
  ) => void;
  authenticate: (token: string) => Promise<void>;
  toggleDark: ColorSetter;
  setToken: TokenSetter;
  logout: () => void;
  setAppState: (key: string, value: any) => void;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      user: null,
      token: "",
      auth: null,
      darkModeOn: localStorage.getItem("darkModeOn") ?? "true",
      snackBarOpen: false,
      snackMessage: "",
      snackSeverity: "info",
      handleSnackBar: this.handleSnackBar,
      authenticate: this.authenticate,
      logout: this.logout,
      toggleDark: this.toggleDark,
      setToken: this.setToken,
      setAppState: this.setAppState,
    };
  }

  setAppState = (key: string, value: any): void => {
    const stateObj: any = {};
    stateObj[key] = value;
    this.setState(stateObj);
  };

  setUser = (user: User): void => this.setState({ user });

  setToken = (token: string): void => {
    localStorage.setItem("token", token);
    this.setState({ token });
  };

  logout = (): void => this.setState({ user: null, token: "", auth: null });

  toggleDark = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { darkModeOn } = this.state;
    this.setState({ darkModeOn: darkModeOn === "true" ? "false" : "true" });
    const currentMode = localStorage.getItem("darkModeOn");
    localStorage.setItem(
      "darkModeOn",
      currentMode === "true" ? "false" : "true"
    );
  };

  authenticate = async (token: string): Promise<void> => {
    const json: UserAuth = await fetchHandler({
      url: `${API_URL}/user/auth`,
      auth: token,
    });
    if (json.auth) {
      this.setState({ auth: true, user: json.user, token });
    } else {
      this.setState({ auth: false });
      localStorage.removeItem("token");
    }
  };

  handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackBarOpen: false });
  };

  handleSnackBar = (
    snackMessage: string,
    snackSeverity?: "success" | "warning" | "error" | "info"
  ): void => {
    this.setState({ snackMessage, snackSeverity: snackSeverity ?? 'info', snackBarOpen: true });
  };

  componentDidMount() {
    const token: string | null = localStorage.getItem("token");
    token ? this.authenticate(token) : this.setState({ auth: false });
    // console.log(light, dark)
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    prevState.token !== this.state.token && this.authenticate(this.state.token);
  }

  render() {
    return (
      <>
        {/* Hello from App.tsx! */}
        <Router
        //  getUserConfirmation={()=>{}}
        >
          <ThemeProvider
            theme={this.state.darkModeOn === "true" ? dark : light}
          >
            <UserCtx.Provider value={this.state}>
              {/* <div>
                <Switch onChange={this.toggleDark} checked={this.state.darkModeOn}/>
              </div> */}
              {/* replace null with loading screen if load times increase! */}
              {typeof this.state.auth === "boolean" ? (
                <Home {...this.state} />
              ) : null}
            </UserCtx.Provider>
            <Snackbar
              open={this.state.snackBarOpen}
              autoHideDuration={4000}
              onClose={this.handleClose}
            >
              <Alert severity={this.state.snackSeverity} variant='standard'>
                {this.state.snackMessage}
              </Alert>
            </Snackbar>
          </ThemeProvider>
        </Router>
      </>
    );
  }
}

export default App;
