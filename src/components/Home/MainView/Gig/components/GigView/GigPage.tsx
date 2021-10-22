import { Grid, Paper } from "@mui/material";
import * as React from "react";
import { Component } from "react";
// import { RouteComponentProps, withRouter } from 'react-router';
import { Gig, User } from "../../../../../../types/API.types";
import { GigIndexState } from "../../GigsIndex";
import Board from "./Board";
import GigHeader from "./GigHeader";
import { RouteComponentProps, withRouter } from "react-router";
import GigInfo from "./GigInfo";
import { DetailedGig } from "../../Gig.types";
import GigMembers from "./GigMembers";

interface RouteParams {
  gigId: string;
}

interface GigPageProps extends RouteComponentProps<RouteParams> {
  // detailedGigs: { [key: string]: DetailedGig } | null;
  // detailedOffers: { [key: string]: DetailedGig } | null;
  detailsHash: { [key: string]: DetailedGig };
  offers: Gig[];
  gigs: Gig[];
  user: User 
}

export interface GigPageState extends Gig {
  authorizedView: boolean;
  editMode: boolean;
  gigId: string | number;
  details: DetailedGig | null;
}

class GigPage extends Component<GigPageProps, GigPageState> {
  constructor(props: GigPageProps) {
    super(props);
    this.state = {
      ...[...this.props.offers, ...this.props.gigs].filter(
        (g) => g.id === parseInt(this.props.match.params.gigId)
      )[0],
      gigId: this.props.match.params.gigId,
      details: null,
      authorizedView: false,
      editMode: false,
    };
  }

  toggleEditMode = (): void =>
    this.setState({ editMode: !this.state.editMode });

  setAuthorizedView = (b: boolean) => this.setState({authorizedView: b})

  componentDidUpdate(prevProps: GigPageProps, prevState: GigPageState) {
    prevProps.detailsHash !== this.props.detailsHash &&
      this.setState({
        details: this.props.detailsHash[this.state.gigId],
      });
    
    prevProps !== this.props &&
      this.setState({
        authorizedView: this.state.gigId === this.state.id.toString(),
      });
  }

  componentDidMount() {
    this.setState({
      details: this.props.detailsHash[this.state.gigId],
      authorizedView: this.state.gigId === this.state.id.toString(),
    });
  }

  render() {
    // console.log(this.props.match.params)
    return (
      <Grid container flexDirection="column">
        {/* Hello From GigPage.tsx! */}
        <GigHeader {...this.state} toggleEditMode={this.toggleEditMode} />
        {/* <Grid
          item
          container
          xs={12}
          // padding={1}
          display="flex"
          justifyContent="space-between"
        > */}
        <Grid item xs={12} sm={6} md={5}>
          <Paper elevation={12} sx={{ paddingLeft: 3 }}>
            {this.state.details && !this.state.editMode ? (
              <GigInfo
              {...this.props}
              {...this.state}
                details={this.state.details}
                setAuth={this.setAuthorizedView}
              />
            ) : this.state.details ? (
              <div>EDIT COMPONENT GO HERE</div>
            ) : null}
            {/* {this.state.details && this.state.callStack ? (
            <GigMembers
              {...this.props}
              {...this.state}
              callStack={this.state.callStack}
            />
          ) : null} */}
            {/* </Grid> */}
            {/* <Board /> */}
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(GigPage);
