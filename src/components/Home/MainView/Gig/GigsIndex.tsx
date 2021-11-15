import * as React from "react";
import { Component } from "react";
import { withRouter, Route, RouteComponentProps } from "react-router-dom";
import { Gig, Notification, User } from "../../../../types/API.types";
import API_URL from "../../../_helpers/environment";
import { UserCtx } from "../../../Context/MainContext";
import { fetchHandler } from "../../../_helpers/fetchHandler";
import GigPage from "./components/GigView/GigPage";
import { DetailedGig, NotificationsHash, RouteOption } from "./Gig.types";
import GigWelcome from "./components/GigWelcome";
import { AppState } from "../../../../App";
import GigCreate from "./GigCreate";
import { Container, Paper } from "@mui/material";

interface GigIndexProps extends RouteComponentProps {
  user: User | null;
  notifications: Notification[];
  dashboardRoute: RouteOption;
  followInfo: any[];
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
  detailsHash: { [key: string]: DetailedGig } | null;
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
      detailsHash: null,
      setGigState: this.setGigState,
    };
  }

  fetchOffers = async (): Promise<boolean> => {
    const json = await fetchHandler({
      url: `${API_URL}/user/offers`,
      auth: localStorage.getItem("token") ?? this.context?.token ?? "",
    });
    const { offers, message, success } = json;
    success && this.setState({ offers });
    return success;
  };

  fetchDetails = async (): Promise<void> => {
    const body = [...this.state.gigs, ...this.state.offers].map((g) => g.id);
    const { hash, success } = await fetchHandler({
      method: "post",
      url: `${API_URL}/gig/details`,
      auth: localStorage.getItem("token") ?? this.context?.token ?? "",
      body,
    });
    success && this.setState({ detailsHash: hash });
  };

  setGigState = (key: string, value: any) => {
    const obj: any = {};
    obj[key] = value;
    this.setState(obj);
  };

  addGig = (gig: Gig): void =>
    this.setState({ gigs: [...this.state.gigs, gig] });

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
    if (!prevProps.user && this.props.user) {
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
  }

  async componentDidMount() {
    await this.fetchOffers();
  }

  componentWillUnmount() {
    this.props.setMainState("dashboardRoute", "notifications");
  }

  render() {
    return (
      <>
        <Route exact path="/main">
          {this.state.detailsHash ? (
            <GigWelcome
              {...this.props}
              {...this.state}
              detailsHash={this.state.detailsHash}
            />
          ) : null}
        </Route>

        <Route exact path="/main/gig/:gigId">
          {this.state.detailsHash && this.state.user ? (
            <GigPage
              {...this.props}
              {...this.state}
              user={this.state.user}
              detailsHash={this.state.detailsHash}
              addGig={this.addGig}
            />
          ) : null}
        </Route>

        <Route exact path="/main/add">
          {this.state.user ? (
            <Container maxWidth={"xl"} sx={{ height: "100%" }}>
              <Paper>
                <GigCreate
                  {...this.state.user}
                  followInfo={this.props.followInfo}
                  addGig={this.addGig}
                  fetchDetails={this.fetchDetails}
                  setMainState={this.props.setMainState}
                />
              </Paper>
            </Container>
          ) : null}
        </Route>
      </>
    );
  }
}

export default withRouter(GigIndex);
