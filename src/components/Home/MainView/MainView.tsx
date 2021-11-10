import { Component } from "react";
import {
  Route,
  Switch,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { Notification, User } from "../../../types/API.types";
import GigIndex from "./Gig/GigsIndex";
import Profile from "./Profile/Profile";
import Settings from "./Settings/Settings";
import { RouteOption } from "./Gig/Gig.types";
import Inbox from "./Inbox/Inbox";
import { fetchHandler } from "../../_helpers/fetchHandler";
import { Container, Paper } from "@mui/material";
import API_URL from "../../_helpers/environment";

export interface MainViewProps extends RouteComponentProps {
  notifications: Notification[];
  user: User;
  auth: boolean | null;
  token: string;
  fetchNotifications: () => Promise<void>;
  setHomeState: (key: string, value: any) => void;
  setAppState: (key: string, value: any) => void;
}

interface MainViewState {
  setMainState: (key: string, value: any) => void;
  followInfo: any[];
  dashboardRoute: RouteOption;
  profileModalOpen: boolean;
}

class MainView extends Component<MainViewProps, MainViewState> {
  constructor(props: MainViewProps) {
    super(props);
    this.state = {
      setMainState: this.setMainState,
      followInfo: [],
      dashboardRoute: "notifications",
      profileModalOpen: false,
    };
  }

  fetchFollowsInfo = async (): Promise<boolean> => {
    try {
      const { success, users, message } = await fetchHandler({
        url: `${API_URL}/user/follows/${this.props.user.id}`,
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      success && this.setState({ followInfo: users });
      return success;
    } catch (error) {
      return false;
    }
  };

  setMainState = (key: string, value: any): void => {
    const stateObj: any = {};
    stateObj[key] = value;
    this.setState(stateObj);
  };

  componentDidMount() {
    const { fetchNotifications } = this.props;
    fetchNotifications();
    this.fetchFollowsInfo();
  }

  render() {
    return this.props.auth ? (
      <>
        <Switch>
          <Route path={`${this.props.match.path}/profile/:userId`}>
            <Container maxWidth="lg" sx={{ height: "calc(100% - 60px)" }}>
              <Paper sx={{ minHeight: "100%" }}>
                <Profile
                  modalOpen={this.state.profileModalOpen}
                  setMainState={this.setMainState}
                />
              </Paper>
            </Container>
          </Route>
          <Route path={`${this.props.match.path}/settings`}>
            <Container maxWidth="lg" sx={{ height: "100%" }}>
              <Paper sx={{ p: 2, height: "100%" }}>
                <Settings {...this.props} />
              </Paper>
            </Container>
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
