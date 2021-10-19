// import * as React from "react";
import { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
// import "./App.css";
import Home from "./components/Home/Home";
import { UserCtx } from "./components/Context/MainContext";
import { UserSetter, TokenSetter, ColorSetter, EmailSetter, StateSetter } from "./App.types";
import { User, UserAuth } from "./types/API.types";
import { light, dark } from "./components/Theme/Theme";
import { ThemeProvider } from "@mui/material/styles";
import { fetchHandler } from "./components/_helpers/fetchHandler";
import API_URL from "./components/_helpers/environment";
import {Snackbar} from '@mui/material'

interface AppProps {}

export interface AppState {
  user: User | null;
  token: string;
  auth: boolean | null;
  darkModeOn: string;
  updateProfile: UserSetter;
  toggleDark: ColorSetter;
  toggleEmail: EmailSetter;
  setUser: StateSetter;
  setToken: TokenSetter;
}

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      user: null,
      token: "",
      auth: null,
      darkModeOn: localStorage.getItem("darkModeOn") ?? "false",
      updateProfile: this.updateProfile,
      toggleDark: this.toggleDark,
      toggleEmail: this.toggleEmail,
      setUser: this.setUser,
      setToken: this.setToken,
    };
  }

  setUser = (user: User): void => this.setState({ user });

  updateProfile = async(user: User):Promise<boolean> => {
    const json = await fetchHandler({
      url: `${API_URL}/user/profile`,
      method: "PUT",
      auth: this.state.token,
      body: user ,
    });
    // console.log(json)
    json.user && this.setUser(json.user); 
    return json.success ? true : false 
  }

  setToken = (token: string): void => {
    localStorage.setItem("token", token);
    this.setState({ token });
  };

  toggleDark = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { darkModeOn } = this.state;
    this.setState({ darkModeOn: darkModeOn === "true" ? "false" : "true" });
    const currentMode = localStorage.getItem("darkModeOn");
    localStorage.setItem(
      "darkModeOn",
      currentMode === "true" ? "false" : "true"
    );
  };

  toggleEmail = async (): Promise<void> => {
    const emails = !this.state.user?.emails;
    const json = await fetchHandler({
      url: `${API_URL}/user/profile`,
      method: "PUT",
      auth: this.state.token,
      body: { emails },
    });
    this.setUser(json.user);
  };

  logout = (): void => this.setState({ user: null, token: "", auth: null });

  authenticate = async (token: string): Promise<void> => {
    const json: UserAuth = await fetchHandler({
      url: `${API_URL}/user/auth`,
      auth: token,
    });
    if (json.auth) {
      this.setState({ auth: true, user: json.user ?? null, token });
    } else {
      this.setState({ auth: false });
      localStorage.removeItem("token");
    }
  };

  componentDidMount(): void {
    const token: string | null = localStorage.getItem("token");
    token ? this.authenticate(token) : this.setState({ auth: false });
  }

  componentDidUpdate(prevProps: AppProps, prevState: AppState) {
    prevState.token !== this.state.token && this.authenticate(this.state.token);
  }

  render() {
    return (
      <div>
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
                <Home logout={this.logout} />
              ) : null}
            </UserCtx.Provider>
          </ThemeProvider>
        </Router>
      </div>
    );
  }
}

export default App;
