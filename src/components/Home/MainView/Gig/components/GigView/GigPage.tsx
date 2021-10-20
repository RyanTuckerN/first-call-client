import { Grid } from "@mui/material";
import * as React from "react";
import { Component } from "react";
// import { RouteComponentProps, withRouter } from 'react-router';
import { Gig } from "../../../../../../types/API.types";
import { GigIndexState } from "../../GigsIndex";
import Board from "./Board";
import GigHeader from "./GigHeader";
import { RouteComponentProps, withRouter } from "react-router";
import GigInfo from "./GigInfo";
import { DetailedGig } from "../../Gig.types";

interface RouteParams {
  gigId: string;
}

interface GigPageProps extends RouteComponentProps<RouteParams> {
  detailedGigs: { [key: string]: DetailedGig } | null;
  detailedOffers: { [key: string]: DetailedGig } | null;
  offers: Gig[];
  gigs: Gig[];
}

export interface GigPageState extends Gig {
  authorizedView: boolean;
  gigId: string | number;
  details: DetailedGig;
}

class GigPage extends Component<GigPageProps, GigPageState> {
  constructor(props: GigPageProps) {
    super(props);
    this.state = {
      ...[...this.props.offers, ...this.props.gigs].filter(
        (g) => g.id === parseInt(this.props.match.params.gigId)
      )[0],
      authorizedView: false,
      gigId: this.props.match.params.gigId,
      details: { ...this.props.detailedGigs, ...this.props.detailedOffers }[
        this.props.match.params.gigId
      ],
    };
  }

  componentDidUpdate(prevProps: GigPageProps, prevState: GigPageState) {
    if (prevProps !== this.props) {
      this.setState({
        details: { ...this.props.detailedGigs, ...this.props.detailedOffers }[
          this.state.gigId
        ],
      });
    }
    
  }

  render() {
    // console.log(this.props.match.params)
    return (
      <Grid container>
        {/* Hello From GigPage.tsx! */}
        <GigHeader {...this.state} />
        {this.state.details ? (
          <GigInfo
            {...this.props}
            {...this.state}
            details={this.state.details}
          />
        ) : null}
        {/* <Board /> */}
      </Grid>
    );
  }
}

export default withRouter(GigPage);
