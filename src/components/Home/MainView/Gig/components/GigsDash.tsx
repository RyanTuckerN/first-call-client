import React from "react";
import { Grid, Paper, Typography, CardActionArea } from "@mui/material";
import { GigIndexState } from "../GigsIndex";

interface GigsDashProps extends GigIndexState {
  gigsOrOffers: "gigs" | "offers";
}

const GigsDash: React.FunctionComponent<GigsDashProps> = ({
  offers,
  gigs,
  gigsOrOffers,
  // setHomeState,
  // setGigState,
}) => {
  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} display="flex" justifyContent="center">
        <Typography variant='h4' paddingY={4}>
          {gigsOrOffers === "gigs"
            ? `${gigs.length} GIGS`
            : `${offers.length} OFFERS`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default GigsDash;
