import * as React from 'react';
import { Component } from 'react';
import Login from './Login';
import Signup from './Signup';


interface AuthProps {
  
}
 
interface AuthState {
  
}
 
class Auth extends Component<AuthProps, AuthState> {
  constructor(props: AuthProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
    <div>
      Hello from Auth!
      <Signup />
      <Login />
    </div> 
    );
  }
}
 
export default Auth;