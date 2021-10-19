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
import {Notification} from '../../../types/API.types'
import GigIndex from "./Gig/GigsIndex";
import Profile from "./Profile/Profile";
import Settings from "./Settings/Settings";

export interface MainViewProps extends RouteComponentProps {
  functions: HomeFunctions;
  notifications: Notification[]
}

interface MainViewState {}

class MainView extends Component<MainViewProps, MainViewState> {
  constructor(props: MainViewProps) {
    super(props);
    // this.state = { :  };
  }

  componentDidMount() {
    const { fetchOffers, fetchNotifications } = this.props.functions;
    fetchOffers();
    fetchNotifications();
  }

  render() {
    return (
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
            <GigIndex notifications={this.props.notifications} />
          </Route>
        </Switch>
      </>
    );
  }
}

export default withRouter(MainView);
