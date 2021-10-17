import * as React from 'react';
import { Component } from 'react';
import { Route, Link, Switch, RouteComponentProps, withRouter } from "react-router-dom";

import GigIndex from './Gig/GigsIndex';
import Profile from './Profile/Profile';
import Settings from './Settings/Settings';

interface MainViewProps extends RouteComponentProps {
  
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
      {/* Hello from MainView.tsx */}
      <Switch>
        <Route path={`${this.props.match.path}/profile`}>
          <Profile />
        </Route>
        <Route path={`${this.props.match.path}/settings`}>
          <Settings />
        </Route>
        <Route path={`${this.props.match.path}/gigs`}>
          <GigIndex />
        </Route>
      </Switch>
    </div> 
    );
  }
}
 
export default withRouter(MainView);