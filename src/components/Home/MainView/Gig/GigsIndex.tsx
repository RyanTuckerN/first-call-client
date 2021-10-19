import * as React from "react";
import { Component } from "react";
import { Gig, Notification, User } from "../../../../types/API.types";
import API_URL from "../../../_helpers/environment";
import { UserCtx } from "../../../Context/MainContext";
import { fetchHandler } from "../../../_helpers/fetchHandler";
import GigCreate from "./components/GigCreate";
import GigEdit from "./components/GigEdit";
import GigInvite from "./components/GigInvite";
import GigPage from "./components/GigPage";
import GigDashBoard from "./components/GigDashboard";
import { NotificationsHash } from "./Gig.types";
import GigWelcome from "./components/GigWelcome";

interface GigIndexProps {
  notifications: Notification[];
}

export interface GigIndexState {
  offers: Gig[];
  gigs: Gig[];
  notifications: Notification[];
  notificationsHash: NotificationsHash;
  user: User
  setGigState: (key: string, value: any) => void;
}

class GigIndex extends Component<GigIndexProps, GigIndexState> {
  static contextType = UserCtx;

  constructor(props: GigIndexProps, context: any) {
    super(props, context);
    this.state = {
      offers: [],
      gigs: this.context.user.gigs ?? [],
      notifications: this.props.notifications,
      notificationsHash: this.notificationHash(this.props.notifications),
      user: this.context.user,
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
  componentDidUpdate(prevProps: GigIndexProps, prevState: GigIndexState) {
    if (prevProps.notifications !== this.props.notifications) {
      this.setState({
        notificationsHash: this.notificationHash(this.props.notifications),
        notifications: this.props.notifications
      });
    }
    if(prevState.notificationsHash !== this.state.notificationsHash){
      
    }
    console.log(Object.entries(this.state.notificationsHash))
  }

  componentDidMount() {
    this.fetchOffers();
    console.log(this.notificationHash);
  }
  render() {
    return (
      <div>
        <GigWelcome {...this.state} />
        {/* <GigPage {...this.state} />
        <GigCreate {...this.state} />
        <GigInvite {...this.state} />
        <GigEdit {...this.state} /> */}
      </div>
    );
  }
}

export default GigIndex;
