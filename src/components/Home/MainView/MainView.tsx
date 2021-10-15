import * as React from 'react';
import { Component } from 'react';
import { Route, Link, Switch, BrowserRouter as Router } from "react-router-dom";

import GigIndex from './Gig/GigsIndex';
import Profile from './Profile/Profile';
import Settings from './Settings/Settings';

interface MainViewProps {
  
}
 
interface MainViewState {
  
}
 
class MainView extends Component<MainViewProps, MainViewState> {
  constructor(props: MainViewProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
    <div>
      Hello from MainView.tsx
      <Profile />
      <Settings />
      <GigIndex />
    </div> 
    );
  }
}
 
export default MainView;