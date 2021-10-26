import * as React from "react";
import { Component } from "react";
import {
  withRouter,
  Link,
  Route,
  Switch,
  RouteComponentProps,
} from "react-router-dom";
import { Gig, Notification, User } from "../../../../types/API.types";
import API_URL from "../../../_helpers/environment";
import { UserCtx } from "../../../Context/MainContext";
import { fetchHandler } from "../../../_helpers/fetchHandler";
import GigInvite from "./components/GigInvite";
import GigPage from "./components/GigView/GigPage";
import GigDashBoard from "./components/GigDashboard";
import { DetailedGig, NotificationsHash, RouteOption } from "./Gig.types";
import { WindowDimensions } from "../../Home.types";
import GigWelcome from "./components/GigWelcome";
import { Button } from "@mui/material";
import { BottomNav } from "./components/Navigation";
import { AppState } from "../../../../App";
import GigCreate from "./GigCreate";
import GigInfo from "./components/GigView/GigInfo";

interface GigIndexProps extends RouteComponentProps {
  notifications: Notification[]; //Home State
  user: User | null; //App State
  dashboardRoute: RouteOption; //Main state
  detailsHash: { [key: string]: DetailedGig } | null;
  setAppState: (key: string, value: any) => void;
  setHomeState: (key: string, value: any) => void;
  setMainState: (key: string, value: any) => void;
}

export interface GigIndexState {
  offers: Gig[];
  gigs: Gig[];
  notifications: Notification[];
  notificationsHash: NotificationsHash;
  user: User | null;
  messageCode: number | null;
  setGigState: (key: string, value: any) => void;
}

class GigIndex extends Component<GigIndexProps, GigIndexState> {
  static contextType = UserCtx;
  context!: React.ContextType<typeof UserCtx>;

  constructor(props: GigIndexProps, context: AppState) {
    super(props, context);
    this.state = {
      offers: [],
      gigs: this.props.user?.gigs ?? [],
      notifications: this.props.notifications,
      notificationsHash: this.notificationHash(this.props.notifications),
      user: this.props.user,
      messageCode: null,
      setGigState: this.setGigState,
    };
  }

  fetchOffers = async (): Promise<boolean> => {
    const json = await fetchHandler({
      url: `${API_URL}/user/offers`,
      auth: localStorage.getItem("token") ?? this.context?.token ?? "",
    });
    const { offers, message, success } = json;
    success ? this.setState({ offers }) : console.log(message);
    return success;
  };

  fetchDetails = async () => {
    const body = [...this.state.gigs, ...this.state.offers].map((g) => g.id);
    const { hash, success } = await fetchHandler({
      method: "post",
      url: `${API_URL}/gig/details`,
      auth: localStorage.getItem("token") ?? this.context?.token ?? "",
      body,
    });
    success && this.props.setHomeState("detailsHash", hash);
  };

  setGigState = (key: string, value: any) => {
    const obj: any = {};
    obj[key] = value;
    this.setState(obj);
  };

  notificationHash = (arr: Notification[]): NotificationsHash =>
    arr.reduce((obj: { [key: string]: Notification[] }, note: Notification) => {
      const id: string = note.details.code.toString();
      if (!obj[id]) obj[id] = [];
      obj[id].push(note);
      return obj;
    }, {});

  componentDidUpdate(prevProps: GigIndexProps, prevState: GigIndexState) {
    if (prevProps.notifications !== this.props.notifications) {
      this.setState({
        notificationsHash: this.notificationHash(this.props.notifications),
        notifications: this.props.notifications,
      });
    }
    if (prevState.notificationsHash !== this.state.notificationsHash) {
      this.fetchOffers();
      this.fetchDetails();
    }
    if (prevProps.user !== this.props.user && this.props.user) {
      this.setState({
        user: this.props.user,
        gigs: this.props.user.gigs ?? [],
      });
      this.fetchOffers();
      this.fetchDetails();
    }
    if (prevState.gigs !== this.state.gigs) {
      this.fetchOffers();
      this.fetchDetails();
    }
    if (prevState.offers !== this.state.offers) {
      this.fetchDetails();
    }
    // console.log(Object.entries(this.state.notificationsHash));
  }

  componentDidMount() {
    // this.fetchDetails();
    // this.fetchOffers();
  }

  render() {
    return (
      <>

        <Route exact path="/main">
          {this.props.detailsHash ? (
            <GigWelcome
              {...this.props}
              {...this.state}
              detailsHash={this.props.detailsHash}
            />
          ) : null}
        </Route>

        <Route exact path="/main/gig/:gigId">
          {this.props.detailsHash && this.state.user ? (
            <GigPage
              {...this.props}
              {...this.state}
              user={this.state.user}
              detailsHash={this.props.detailsHash}
            />
          ) : null}
        </Route>
        
        <Route exact path="/main/add">
          {this.state.user ? <GigCreate {...this.state.user} /> : null}
        </Route>
        
      </>
    );
  }
}

export default withRouter(GigIndex);
