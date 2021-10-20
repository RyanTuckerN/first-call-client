import React, { Component } from "react";
import { GigIndexState } from "../../GigsIndex";
import { UserCtx } from "../../../../../Context/MainContext";
import { Grid } from "@mui/material";
import GigCard from "./components/GigCard";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";
import {DetailedGig} from '../../Gig.types'

interface GigsMapperProps extends GigIndexState {
  setRoute: any;
  gigsOrOffers: "gigs" | "offers";
}

interface GigsMapperState {
  detailedGigs: {[key: string]: DetailedGig}
  detailedOffers: {[key: string]: DetailedGig}
}

class GigsMapper extends Component<GigsMapperProps, GigsMapperState> {
  static contextType = UserCtx;

  constructor(props: GigsMapperProps) {
    super(props);
    // this.state = { detailedGigs: null };
  }

  // fetchGigsDetails = async () => {
  //   const detailsHash: any = {};
  //   this.props[this.props.gigsOrOffers].forEach(async (gig) => {
  //     const info = await fetchHandler({
  //       url: `${API_URL}/gig/${gig.id}`,
  //       auth: localStorage.getItem("token") ?? "",
  //     });
  //     detailsHash[gig.id] = info;
  //   });
  //   this.setState({ detailedGigs: detailsHash });
  // };


  // componentDidUpdate(prevProps: GigsMapperProps, prevState: GigsMapperState) {
  //   if (prevProps.gigsOrOffers !== this.props.gigsOrOffers) {
  //     this.fetchGigsDetails();
  //   }
  // }

  // componentDidMount() {
  //   this.fetchGigsDetails();
  // }

  render() {

    return (
      <Grid container>
        {this.props[this.props.gigsOrOffers].map((gig) => (
          <Grid item xs={12} sm={6} key={gig.id}>
            <GigCard {...gig} userId={this.props.user?.id ?? null} detailsHash={this.props.gigsOrOffers === 'gigs' ? this.props.detailedGigs : this.props.detailedOffers} />
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default GigsMapper;


//example response!
// const JSON = {
//   "3": {
//     gigInfo: {
//       gig: {
//         description: "Remarkable concert",
//         date: "2021-12-24T22:30:00.543Z",
//         payment: 425,
//         optionalInfo: {
//           meal: "Box lunch",
//           attire: "Business casual",
//           rehearsal: "2 weeks before",
//         },
//         posts: { count: 0, rows: [] },
//       },
//       bandLeader: {
//         id: 1,
//         email: "user1@email.com",
//         name: "Nikola Falkenberg",
//         photo: "https://randomuser.me/api/portraits/med/women/90.jpg",
//       },
//       bandMembers: [
//         {
//           id: 4,
//           email: "user4@email.com",
//           name: "Bilge Bles",
//           role: "saxophone",
//         },
//         {
//           id: 5,
//           email: "user5@email.com",
//           name: "Bonnie Carr",
//           role: "accordian",
//         },
//       ],
//     },
//     message: "success",
//   },
// };
