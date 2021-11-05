import * as React from "react";
import { Component } from "react";
import Login from "./Login";
import Signup from "./Signup";
import {
  Route,
  Switch,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import API_URL from "../../_helpers/environment";
import { LoginSignupProps, UserResponse } from "./Auth.types";
import { fetchHandler } from "../../_helpers/fetchHandler";
import { properize, returnParams } from "../../_helpers/helpers";
import { UserCtx } from "../../Context/MainContext";
import { AppState } from "../../../App";

interface AuthProps extends RouteComponentProps {
  setToken: (token: string) => void;
  setAppState: (key: string, value: any) => void;
}

interface AuthState {
  email: string;
  first: string;
  last: string;
  password: string;
}
class Auth extends Component<AuthProps, AuthState> {
  static contextType = UserCtx;

  constructor(props: AuthProps, context: AppState) {
    super(props, context);
    this.state = { email: "", first: "", last: "", password: "" };
  }

  functions: LoginSignupProps = {
    handleEmail: (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ email: e.target.value }),
    handleFirst: (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ first: e.target.value }),
    handleLast: (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ last: e.target.value }),
    handlePassword: (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ password: e.target.value }),

    handleLogin: async (e: React.FormEvent<HTMLInputElement>) => {
      const { email, password } = this.state;
      const { setToken, setAppState } = this.props;

      e.preventDefault();
      if (!email || !password) {
        this.context.handleSnackBar("please fill out all fields!", "warning");
        return;
      }

      const json: UserResponse = await fetchHandler({
        url: `${API_URL}/user/login`,
        method: "post",
        body: { email: email.toLowerCase().trim(), password },
      });
      if (!json.user || !json.sessionToken) {
        this.context.handleSnackBar(json.message, "error");
        return;
      }

      setToken(json.sessionToken);
      setAppState("user", json.user);
      this.props.history.push("/main");
      this.context.handleSnackBar(
        `Welcome back, ${json.user!.name.split(" ")[0]}!`,
        "success"
      );
    },
    handleSignup: async (e: React.FormEvent<HTMLInputElement>) => {
      const { email, password, first, last } = this.state;
      const { setToken, setAppState } = this.props;

      e.preventDefault();
      if (!email || !password || !first || !last) {
        this.context.handleSnackBar("please fill out all fields!", "warning");
        return;
      }
      const json: UserResponse = await fetchHandler({
        url: `${API_URL}/user/signup`,
        method: "post",
        body: {
          email: email.toLowerCase().trim(),
          password,
          name: `${properize(first)} ${properize(last)}`,
        },
      });
      console.log(json);
      if (!json.user || !json.sessionToken) {
        this.context.handleSnackBar(json.message, "error");
        return;
      }
      console.log(json)
      setToken(json.sessionToken);
      setAppState("user", json.user);
      this.props.history.push("/main");
      this.context.handleSnackBar(json.message, "success");
    },
    clearState: () =>
      this.setState({ email: "", first: "", last: "", password: "" }),
  };

  componentDidMount() {
    const context = this.context;
    console.log(context);
    this.setState({ ...this.state, ...returnParams() });
  }

  render() {
    return (
      <div>
        {/* Hello from Auth! */}
        <Switch>
          <Route path={`${this.props.match.path}/signup`}>
            <Signup functions={this.functions} authState={this.state} />
          </Route>
          <Route path={`${this.props.match.path}/login`}>
            <Login functions={this.functions} authState={this.state} />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default withRouter(Auth);
