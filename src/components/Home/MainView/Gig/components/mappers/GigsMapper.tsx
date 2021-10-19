import React, { Component } from "react";
import { GigIndexState } from "../../GigsIndex";
import { UserCtx } from "../../../../../Context/MainContext";
import { Grid } from "@mui/material";
import GigCard from "./components/GigCard";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";

interface GigsMapperProps extends GigIndexState {
  setRoute: any;
  gigsOrOffers: "gigs" | "offers";
}

interface GigsMapperState {
  detailedGigs: any;
}

class GigsMapper extends Component<GigsMapperProps, GigsMapperState> {
  static contextType = UserCtx;

  constructor(props: GigsMapperProps) {
    super(props);
    this.state = { detailedGigs: {} };
  }

  fetchGigsDetails = async () => {
    const detailsHash:any = {};
    this.props.gigs.forEach(async (gig) => {
      const info = await fetchHandler({
        url: `${API_URL}/gig/${gig.id}`,
        auth: localStorage.getItem("token") ?? "",
        
      });
      detailsHash[gig.id.toString()] = info 
    });
    this.setState({detailedGigs: detailsHash})
  };

  componentDidMount() {
    this.fetchGigsDetails()
  }

  arr: string[] = "a".repeat(12).split("");

  render() {
    console.log(this.context);
    return (
      <Grid container>
        {this.props.gigs.map((gig) => (
          <Grid item xs={12} sm={6}  key={gig.id}>
            <GigCard {...gig}{...this.state}/>
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default GigsMapper;
