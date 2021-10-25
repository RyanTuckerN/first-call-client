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
  windowDimensions: WindowDimensions;
  messageCode: number | null;
  // setHomeState: (key: string, value: any) => void;
  setGigState: (key: string, value: any) => void;
}

class GigIndex extends Component<GigIndexProps, GigIndexState> {
  static contextType = UserCtx;
  context!: React.ContextType<typeof UserCtx>

  constructor(props: GigIndexProps, context: AppState) {
    super(props, context);
    this.state = {
      offers: [],
      gigs: this.props.user?.gigs ?? [],
      // detailedGigs: null,
      // detailedOffers: null,
      notifications: this.props.notifications,
      notificationsHash: this.notificationHash(this.props.notifications),
      user: this.props.user,
      messageCode: null,
      windowDimensions: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
      // setHomeState: this.props.setHomeState,
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
    const hash = await fetchHandler({
      method: "post",
      url: `${API_URL}/gig/details`,
      auth: localStorage.getItem("token") ?? this.context?.token ?? "",
      body,
    });
    this.props.setHomeState("detailsHash", hash);
  };

  setGigState = (key: string, value: any) => {
    const obj: any = {};
    obj[key] = value;
    this.setState(obj);
  };

  notificationHash = (arr: Notification[]): NotificationsHash =>
    arr.reduce((obj: any, note: Notification) => {
      const id: string = note.details.code.toString();
      if (!obj[id]) obj[id] = [];
      obj[id].push(note);
      return obj;
    }, {});

  handleResize = (): void =>
    this.setState({
      windowDimensions: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
    });

  componentDidUpdate(prevProps: GigIndexProps, prevState: GigIndexState) {
    if (prevProps.notifications !== this.props.notifications) {
      this.setState({
        notificationsHash: this.notificationHash(this.props.notifications),
        notifications: this.props.notifications,
      });
    }
    if (prevState.notificationsHash !== this.state.notificationsHash) {
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
    // console.log(Object.entries(this.state.notificationsHash));
  }

  async componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    await this.fetchOffers();
    if (!this.props.detailsHash) await this.fetchDetails();
  }
  render() {
    const { width } = this.state.windowDimensions;

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
        {/* <Route
          exact
          path="/main/gig/:gigId"
          render={() => {
            return this.props.detailsHash && this.state.user ? (
              <GigPage
                {...this.props}
                {...this.state}
                user={this.state.user}
                detailsHash={this.props.detailsHash}
                windowDimensions={this.state.windowDimensions}
              />
            ) : null;
          }}
        /> */}
        <Route exact path="/main/gig/:gigId">
          {this.props.detailsHash && this.state.user ? (
            <GigPage
              {...this.props}
              {...this.state}
              user={this.state.user}
              detailsHash={this.props.detailsHash}
              windowDimensions={this.state.windowDimensions}
            />
          ) : null}
        </Route>
        <Route exact path="/main/add">
          {this.state.user && this.state.windowDimensions ? (
            <GigCreate
              {...this.state.user}
              windowDimensions={this.state.windowDimensions}
            />
          ) : null}
        </Route>
        {/* <Route exact path="/invite/gig/:gigId">
          <GigInfo />
          <GigInvite />
        </Route> */}
        {/* <GigCreate {...this.state} />
        <GigInvite {...this.state} />
        <GigEdit {...this.state} /> */}
      </>
    );
  }
}

export default withRouter(GigIndex);
