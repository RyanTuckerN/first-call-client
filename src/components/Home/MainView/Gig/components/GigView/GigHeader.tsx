import * as React from "react";
import { GigPageState } from "./GigPage";
import {
  Grid,
  Paper,
  Container,
  Box,
  Typography,
  Avatar,
  IconButton,
} from "@mui/material";
import { returnTime } from "../../../../../_helpers/helpers";
import { Edit, HighlightOff, Save, Settings } from "@mui/icons-material";
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
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          {/* <Avatar src={photo} sx={{height:150, width:150, position: 'absolute', top: 135, zIndex:2, background: 'rgba(0, 0, 0, 0.8)'}} /> */}
          <img
            src={photo}
            alt={gig.description}
            style={{ width: "50%", maxWidth: "80vw", borderRadius: 10 }}
          />
        </div>
      )}

      <Grid
        item
        container
        xs={12}
        // spacing={2}
        letterSpacing={1.5}
        id="gig-header"
        sx={{ background: "#bada5540", padding: 1.5, paddingBottom: 2 }}
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
            {editMode && (
              //save updates to gig
              <IconButton>
                <Save />
              </IconButton>
            )}
            <IconButton onClick={toggleEditMode}>
              {editMode ? <HighlightOff /> : <Edit />}
            </IconButton>
          </Grid>
        )}
      </Grid>

      {/* ASK JAKE! */}
    </>
  );
};

export default GigHeader;
