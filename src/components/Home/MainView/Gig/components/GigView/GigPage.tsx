import { Grid, Paper } from "@mui/material";
import * as React from "react";
import { Component } from "react";
// import { RouteComponentProps, withRouter } from 'react-router';
import { Gig, User } from "../../../../../../types/API.types";
import { GigIndexState } from "../../GigsIndex";
import Board from "./Board";
import GigHeader from "./GigHeader";
import GigInfo from "./GigInfo";
import GigEdit from "./GigEdit";
import { RouteComponentProps, withRouter, Route, NavLink } from "react-router-dom";
import { DetailedGig } from "../../Gig.types";
import { WindowDimensions } from "../../../../Home.types";
import CallStackCreate from "../../CallStack/CallStackCreate";

interface RouteParams {
  gigId: string;
}

interface GigPageProps extends RouteComponentProps<RouteParams> {
  detailsHash: { [key: string]: DetailedGig };
  offers: Gig[];
  gigs: Gig[];
  user: User;
  windowDimensions: WindowDimensions;
}

export interface GigPageState {
  authorizedView: boolean;
  editMode: boolean;
  gigId: string | number;
  details: DetailedGig | null;
  gig: Gig | null;
}

class GigPage extends Component<GigPageProps, GigPageState> {
  constructor(props: GigPageProps) {
    super(props);
    this.state = {
      gig: null,
      gigId: this.props.match.params.gigId,
      details: null,
      authorizedView: false,
      editMode: false,
    };
  }
  setAuthorizedView = (b: boolean) => this.setState({ authorizedView: b });

  // gigInfoProps = {
  //   user: this.props.user,
  //   authorizedView: this.state.authorizedView,
  //   editMode: this.state.editMode,
  //   gigId: this.state.gigId,
  //   setAuth: this.setAuthorizedView
  // }

  setGig = (gig: Gig):void => this.setState({gig})

  toggleEditMode = (): void =>
    this.setState({ editMode: !this.state.editMode });

  componentDidUpdate(prevProps: GigPageProps, prevState: GigPageState) {
    prevProps.detailsHash !== this.props.detailsHash &&
      this.setState({
        details: this.props.detailsHash[this.state.gigId],
      });

    prevProps !== this.props &&
      this.setState({
        authorizedView: this.state.gig?.ownerId === this.props.user.id,
      });
  }

  componentDidMount() {
    this.setState({
      details: this.props.detailsHash[this.props.match.params.gigId],
      authorizedView: this.state.gigId === this.state.gig?.id.toString(),
      gig:
        [...this.props.gigs, ...this.props.offers].filter(
          (g) => g.id.toString() === this.state.gigId
        )[0] ?? null,
    });
  }

  render() {
    // console.log(this.props.match.params)
    return (
      <Grid container >
        {/* Hello From GigPage.tsx! */}
        {this.state.gig && (
          <GigHeader
            {...this.state}
            gig={this.state.gig}
            toggleEditMode={this.toggleEditMode}
          />
        )}

        <Grid item xs={12} md={6} sx={{ marginTop: 3 }}>
          {/* <Paper elevation={12} sx={{ }}> */}
          {this.state.details && !this.state.editMode && this.state.gig ? (
            <GigInfo
              {...{
                user: this.props.user,
                authorizedView: this.state.authorizedView,
                editMode: this.state.editMode,
                gigId: this.state.gigId,
                setAuth: this.setAuthorizedView,
                windowDimensions: this.props.windowDimensions,
              }}
              toggleEditMode={this.toggleEditMode}
              details={this.state.details}
              gig={this.state.gig}
            />
          ) : this.state.details && this.state.editMode && this.state.gig ? (
            <GigEdit
              {...this.state.gig}
              details={this.state.details}
              windowDimensions={this.props.windowDimensions}
              setGig={this.setGig}
            />
          ) : null}
          {/* </Paper> */}
        </Grid>
        <Grid item xs={12} md={6} sx={{ marginTop: 3 }}>
          {/* <CallStackCreate /> */}
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(GigPage);
