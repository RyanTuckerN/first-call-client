import React, { Component } from "react";
import { GigIndexState } from "../../GigsIndex";
import { UserCtx } from "../../../../../Context/MainContext";
import { Grid } from "@mui/material";
import GigCard from "./components/GigCard";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";
import { DetailedGig } from "../../Gig.types";

interface GigsMapperProps extends GigIndexState {
  setRoute: any;
  gigsOrOffers: "gigs" | "offers";
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
          <Grid item xs={12} sm={6} key={gig.id}>
            <GigCard
              {...gig}
              userId={this.props.user?.id ?? null}
              detailsHash={
                this.props.gigsOrOffers === "gigs"
                  ? this.props.detailedGigs
                  : this.props.detailedOffers
              }
            />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default GigsMapper;
