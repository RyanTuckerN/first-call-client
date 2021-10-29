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
import { Notification, User } from "../../../types/API.types";
import GigIndex from "./Gig/GigsIndex";
import Profile from "./Profile/Profile";
import Settings from "./Settings/Settings";
import { DetailedGig, RouteOption } from "./Gig/Gig.types";
import { Alert, Snackbar } from "@mui/material";
import Inbox from "./Inbox/Inbox"

export interface MainViewProps extends RouteComponentProps {
  // functions: HomeFunctions;
  notifications: Notification[];
  user: User;
  auth: boolean | null;
  detailsHash: { [key: string]: DetailedGig } | null;
  token: string;
  fetchNotifications: () => Promise<void>;
  setHomeState: (key: string, value: any) => void;
  setAppState: (key: string, value: any) => void;
}

interface MainViewState {
  setMainState: (key: string, value: any) => void;
  dashboardRoute: RouteOption;
}

class MainView extends Component<MainViewProps, MainViewState> {
  constructor(props: MainViewProps) {
    super(props);
    this.state = {
      setMainState: this.setMainState,
      dashboardRoute: "notifications",
    };
  }

  setMainState = (key: string, value: any): void => {
    const stateObj: any = {};
    stateObj[key] = value;
    this.setState(stateObj);
  };

  componentDidMount() {
    const { fetchNotifications } = this.props;
    fetchNotifications();
  }



  render() {
    return this.props.auth ? (
      <>
        {/* Hello from MainView.tsx */}
        <Switch>
          <Route path={`${this.props.match.path}/profile/:userId`}>
            <Profile />
          </Route>
          <Route path={`${this.props.match.path}/settings`}>
            <Settings {...this.props} />
          </Route>
          <Route path={`${this.props.match.path}/inbox`}>
              <Inbox />
          </Route>
          <Route path={`${this.props.match.path}/`}>
            {this.props.user?.gigs && this.props.notifications ? (
              <GigIndex {...this.props} {...this.state} />
            ) : null}
          </Route>
        </Switch>
        
      </>
    ) : null;
  }
}

export default withRouter(MainView);
