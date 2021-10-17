import * as React from "react";
import { Component } from "react";
import Login from "./Login";
import Signup from "./Signup";
import {
  Route,
  // Link,
  Switch,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import API_URL from "../../_helpers/environment";
import { LoginSignupProps, UserResponse } from "./Auth.types";
import { fetchHandler } from "../../_helpers/fetchHandler";
import { properize } from "../../_helpers/helpers";
import { UserCtx } from "../../Context/MainContext";

interface AuthProps extends RouteComponentProps {}

interface AuthState {
  email: string;
  first: string;
  last: string;
  password: string;
}
class Auth extends Component<AuthProps, AuthState> {
  static contextType = UserCtx;

  constructor(props: AuthProps) {
    super(props);
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
      const { setUser, setToken } = this.context;
      e.preventDefault();
      if (!email || !password) {
        alert("please fill out all fields!");
        return;
      }

      const json: UserResponse = await fetchHandler({
        url: `${API_URL}/user/login`,
        method: "post",
        body: { email, password },
      });
      if(!json.user || !json.sessionToken){
        alert(json.message)
        return
      }
      
      setToken(json.sessionToken);
      setUser(json.user);
      this.props.history.push('/main')
      alert(json.message);

    },
    handleSignup: async (e: React.FormEvent<HTMLInputElement>) => {
      const { email, password, first, last } = this.state;
      const { setUser, setToken } = this.context;
      e.preventDefault();
      if (!email || !password || !first || !last) {
        alert("please fill out all fields!");
        return;
      }
      const json: UserResponse = await fetchHandler({
        url: `${API_URL}/user/signup`,
        method: "post",
        body: {
          email,
          password,
          name: `${properize(first)} ${properize(last)}`,
        },
      });
      console.log(json);
      if(!json.user || !json.sessionToken){
        alert(json.message)
        return
      }
      setToken(json.sessionToken);
      setUser(json.user);
      this.props.history.push('/main')
      alert(json.message);
    },
    clearState: () =>
      this.setState({ email: "", first: "", last: "", password: "" }),
  };

  componentDidMount() {
    const context = this.context;
    console.log(context);
    
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
