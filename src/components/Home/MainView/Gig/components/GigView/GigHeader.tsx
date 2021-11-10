import * as React from "react";
import { GigPageState } from "./GigPage";
import { Grid, Typography, IconButton } from "@mui/material";
import { returnTime } from "../../../../../_helpers/helpers";
import { Edit, HighlightOff } from "@mui/icons-material";
import { Gig } from "../../../../../../types/API.types";

interface GigHeaderProps extends GigPageState {
  toggleEditMode: VoidFunction;
  gig: Gig;
}

const GigHeader: React.FunctionComponent<GigHeaderProps> = ({
  authorizedView,
  gig,
  editMode,
  toggleEditMode,
}) => {
  const { description, date, photo } = gig;
  const d = new Date(date);

  return (
    <>
      {photo && (
        <Grid
          style={{
            width: "100%",
            height: 600,
          }}
        >
          <img
            src={photo}
            alt={gig.description}
            style={{ width: "100%", objectFit: "cover", height: 600 }}
          />
        </Grid>
      )}
      <Grid
        item
        container
        xs={12}
        letterSpacing={1.5}
        id="gig-header"
        sx={{ padding: 1.5, paddingBottom: 2 }}
      >
        <Grid item xs={11} sx={{ zIndex: 5 }}>
          <Typography
            variant="overline"
            fontSize="medium"
            color="GrayText"
          >{`${d.toLocaleDateString()} AT ${returnTime(d)}`}</Typography>
          <Typography variant="h4">{description}</Typography>
        </Grid>
        {authorizedView && (
          <Grid
            item
            xs={1}
            display="flex"
            justifyContent={"flex-end"}
            alignItems="flex-start"
          >
            <IconButton onClick={toggleEditMode}>
              {editMode ? <HighlightOff /> : <Edit />}
            </IconButton>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default GigHeader;
