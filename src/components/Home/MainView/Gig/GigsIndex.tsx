import * as React from "react";
import { Component } from "react";
import { withRouter, Link, Route, Switch, RouteComponentProps } from "react-router-dom";
import { Gig, Notification, User } from "../../../../types/API.types";
import API_URL from "../../../_helpers/environment";
import { UserCtx } from "../../../Context/MainContext";
import { fetchHandler } from "../../../_helpers/fetchHandler";
import GigInvite from "./components/GigInvite";
import GigPage from "./components/GigView/GigPage";
import GigDashBoard from "./components/GigDashboard";
import { DetailedGig, NotificationsHash } from "./Gig.types";
import { WindowDimensions } from "../../Home.types";
import GigWelcome from "./components/GigWelcome";
import { BottomNav } from "./components/Navigation";

interface GigIndexProps extends RouteComponentProps {
  notifications: Notification[];
  user: User | null;
  setHomeState: (key: string, value: any) => void;
}

export interface GigIndexState {
  offers: Gig[];
  gigs: Gig[];
  detailedGigs: { [key: string]: DetailedGig } | null;
  detailedOffers: { [key: string]: DetailedGig } | null;
  notifications: Notification[];
  notificationsHash: NotificationsHash;
  user: User | null;
  windowDimensions: WindowDimensions;
  messageCode: number | null;
  setHomeState: (key: string, value: any) => void;
  setGigState: (key: string, value: any) => void;
}

class GigIndex extends Component<GigIndexProps, GigIndexState> {
  static contextType = UserCtx;

  constructor(props: GigIndexProps, context: any) {
    super(props, context);
    this.state = {
      offers: [],
      gigs: this.props.user?.gigs ?? [],
      detailedGigs: null,
      detailedOffers: null,
      notifications: this.props.notifications,
      notificationsHash: this.notificationHash(this.props.notifications),
      user: this.props.user,
      messageCode: null,
      windowDimensions: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
      setHomeState: this.props.setHomeState,
      setGigState: this.setGigState,
    };
  }

  fetchOffers = async (): Promise<boolean> => {
    const json = await fetchHandler({
      url: `${API_URL}/user/offers`,
      auth: localStorage.getItem("token") ?? "",
    });
    const { offers, message, success } = json;
    success ? this.setState({ offers }) : console.log(message);
    return success;
  };

  fetchGigsDetails = async () => {
    const gigsHash: any = {};
    this.state.gigs.forEach(async (gig) => {
      const info = await fetchHandler({
        url: `${API_URL}/gig/${gig.id}`,
        auth: localStorage.getItem("token") ?? "",
      });
      gigsHash[gig.id] = info.gigInfo;
    });
    this.setState({ detailedGigs: gigsHash });
  };

  fetchOffersDetails = async () => {
    const offersHash: any = {};
    this.state.offers.forEach(async (gig) => {
      const info = await fetchHandler({
        url: `${API_URL}/gig/${gig.id}`,
        auth: localStorage.getItem("token") ?? "",
      });
      offersHash[gig.id] = info.gigInfo;
    });
    this.setState({ detailedOffers: offersHash });
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
    // console.log(Object.entries(this.state.notificationsHash));
  }

  async componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    await this.fetchOffers();
    await this.fetchGigsDetails();
    await this.fetchOffersDetails();
  }
  render() {
    const { width } = this.state.windowDimensions;

    return (
      <div>
        <Route exact path='/main' >
          <GigWelcome {...this.state} />
        </Route>
        <Route exact path='/main/:gigId'>  
          <GigPage {...this.state}/>
        </Route>
        {/* <GigCreate {...this.state} />
        <GigInvite {...this.state} />
        <GigEdit {...this.state} /> */}
      </div>
    );
  }
}

export default withRouter(GigIndex);
