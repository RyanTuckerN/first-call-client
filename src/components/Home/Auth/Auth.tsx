import * as React from "react";
import { Component } from "react";
import Login from "./Login";
import Signup from "./Signup";
import {
  Route,
  Link,
  Switch,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import API_URL from '../../_helpers/environment'

interface AuthProps extends RouteComponentProps {}

interface AuthState {
  email: string;
  first: string;
  last: string;
  password: string;
}

interface PropsToPass {
  handleEmail: any;
  handlePassword: any;
  handleFirst: any;
  handleLast: any;
  handleLogin: any;
  handleSignup: any;
  clearState: any;
}
class Auth extends Component<AuthProps, AuthState> {
  constructor(props: AuthProps) {
    super(props);
    this.state = { email: "", first: "", last: "", password: "" };
  }
  functions: PropsToPass = {
    handleEmail: (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ email: e.target.value }),
    handleFirst: (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ first: e.target.value }),
    handleLast: (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ last: e.target.value }),
    handlePassword: (e: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({ password: e.target.value }),
    handleLogin: async(e: React.FormEvent<HTMLInputElement>) => {
      const { email, password } = this.state;
      e.preventDefault();
      if (!email || !password) {
        alert("please fill out all fields!");
        return
      }
      const res = await fetch(`${API_URL}/user/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      })
      const json = await res.json()
      console.log(json)
      alert(json.message)
    },
    handleSignup: async(e: React.FormEvent<HTMLInputElement>) => {
      const { email, password, first, last } = this.state;
      e.preventDefault();
      if (!email || !password || !first || !last) {
        alert("please fill out all fields!");
        return
      }
      const res = await fetch(`${API_URL}/user/signup`, {
        method: "POST",
        body: JSON.stringify({ email, password, name: first + " " + last }),
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      })
      const json = await res.json()
      console.log(json)
      alert(json.message)
    },

    clearState: () =>
      this.setState({ email: "", first: "", last: "", password: "" }),
  };
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
