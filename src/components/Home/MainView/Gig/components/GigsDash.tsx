import React from "react";
import { Grid, Typography } from "@mui/material";
import { GigIndexState } from "../GigsIndex";

interface GigsDashProps extends GigIndexState {
  gigsOrOffers: "gigs" | "offers";
}

const GigsDash: React.FunctionComponent<GigsDashProps> = ({
  offers,
  gigs,
  gigsOrOffers,
}) => {
  return gigs ? (
    <Grid container justifyContent="center" mt={-2} pb={1}>
      <Grid item xs={12} display="flex" justifyContent="center">
        <Typography variant="overline" fontWeight={300} fontSize={20}>
          {gigsOrOffers === "gigs"
            ? `${gigs?.length ?? 0} ${gigs?.length === 1 ? "GIG" : "GIGS"}`
            : `${offers?.length ?? 0} ${
                offers?.length === 1 ? "OFFER" : "OFFERS"
              }`}
        </Typography>
      </Grid>
    </Grid>
  ) : null;
};

export default GigsDash;
