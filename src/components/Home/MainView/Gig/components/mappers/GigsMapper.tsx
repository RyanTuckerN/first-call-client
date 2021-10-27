import React, { Component } from "react";
import { GigIndexState } from "../../GigsIndex";
import { UserCtx } from "../../../../../Context/MainContext";
import { Grid } from "@mui/material";
import GigCard from "./components/GigCard";
import API_URL from "../../../../../_helpers/environment";
import { DetailedGig } from "../../Gig.types";
import { User } from "../../../../../../types/API.types";

interface GigsMapperProps extends GigIndexState {
  // setRoute: any;
  gigsOrOffers: "gigs" | "offers";
  detailsHash: any,
  // user: User | null
}

interface GigsMapperState {}

class GigsMapper extends Component<GigsMapperProps, GigsMapperState> {
  static contextType = UserCtx;

  constructor(props: GigsMapperProps) {
    super(props);
  }

  render() {
    return (
      <Grid container>
        {this.props[this.props.gigsOrOffers].map((gig) => (
          <Grid item xs={12} sm={12} key={gig.id}>
            {this.props.detailsHash && this.props.user ? <GigCard
              {...gig}
              userId={this.props.user?.id ?? null}
              detailsHash={this.props.detailsHash}
              user={this.props.user}
            /> : null}
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default GigsMapper;
