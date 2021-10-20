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
    gigs ?
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12} display="flex" justifyContent="center">
        <Typography variant='h4' paddingY={4}>
          {gigsOrOffers === "gigs"
            ? `${gigs?.length ?? 0} GIGS`
            : `${offers?.length ?? 0} OFFERS`}
        </Typography>
      </Grid>
    </Grid>
    :null
  );
};

export default GigsDash;
