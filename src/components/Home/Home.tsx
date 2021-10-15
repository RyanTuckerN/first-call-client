import * as React from 'react';
import { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Auth from '../Auth/Auth';
import MainView from './MainView/MainView';
import Respond from './MainView/Respond/Respond';

interface HomeProps {
  
}
 
interface HomeState {
  
}
 
class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
    <div>
      Hello from Home!
      <Respond />
      <Auth />
      <Router>
        <MainView />
      </Router>
    </div> 
    );
  }
}
 
export default Home;