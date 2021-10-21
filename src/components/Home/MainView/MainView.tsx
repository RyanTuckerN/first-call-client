// import * as React from "react";
import { Component } from "react";
import {
  Route,
  // Link,
  Switch,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { HomeFunctions } from "../Home.types";
import {Notification, User} from '../../../types/API.types'
import GigIndex from "./Gig/GigsIndex";
import Profile from "./Profile/Profile";
import Settings from "./Settings/Settings";
import { RouteOption } from "./Gig/Gig.types";

export interface MainViewProps extends RouteComponentProps {
  functions: HomeFunctions;
  notifications: Notification[];
  user: User | null,
  auth: boolean | null;
  setHomeState: (key:string, value: any) => void,
}

interface MainViewState {
  setMainState: any,
  route: RouteOption
}

class MainView extends Component<MainViewProps, MainViewState> {
  constructor(props: MainViewProps) {
    super(props);
    this.state = { route: 'notifications', setMainState: this.setMainState};
  }

  setMainState = (key: string, value: any):void => {
    const stateObj:any={}
    stateObj[key]=value
    this.setState(stateObj)}

  componentDidMount() {
    const { fetchOffers, fetchNotifications } = this.props.functions;
    fetchOffers();
    fetchNotifications();
  }

  render() {
    return (
      this.props.auth ?
      <>
        {/* Hello from MainView.tsx */}
        <Switch>
          <Route path={`${this.props.match.path}/profile`}>
            <Profile  />
          </Route>
          <Route path={`${this.props.match.path}/settings`}>
            <Settings />
          </Route>
          <Route path={`${this.props.match.path}/`}>
            
            {this.props.user?.gigs && this.props.notifications ? <GigIndex {...this.props} /> : null}
          </Route>
        </Switch>
      </> : null
    );
  }
}

export default withRouter(MainView);
