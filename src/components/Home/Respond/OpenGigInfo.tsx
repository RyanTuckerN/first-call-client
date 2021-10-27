import * as React from "react";
import {
  Grid,
  Paper,
  Typography,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
} from "@mui/material";
import { properize, returnTime } from "../../_helpers/helpers";
import {
  AttachMoney,
  LocationOn,
  CalendarToday,
  CheckCircleOutline,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import * as _ from "lodash";
import { Gig } from "../../../types/API.types";
import { stringAvatar } from "../MainView/Settings/Header";
import { DetailedGig } from "../MainView/Gig/Gig.types";
import { GigPageState } from "../MainView/Gig/components/GigView/GigPage";

const avatarSize: number = 35;

interface OpenGigInfoProps  {
  details: DetailedGig;
  gig: Gig;
}

const OpenGigInfo: React.FunctionComponent<OpenGigInfoProps> = ({
  details,
  gig,
}) => {
  const { date, callStack, optionalInfo, payment, gigLocation } = gig;
  const { bandLeader, bandMembers } = details;

  const d = new Date(date);
  const entries = Object.entries(optionalInfo ?? {});
  const roles = Object.keys(callStack?.stackTable ?? {});
  const filled = roles.filter((r) => callStack?.stackTable[r].filled);
  const typoSx = { paddingTop: 1.5 };

  return (
    <Grid
      container
      display="flex"
      flexDirection="row"
      justifyContent="center"
      spacing={1}
      sx={{ padding: 1 }}
    >
 
      <Grid item xs={12} sm={7} md={4}>
        <Paper elevation={10} sx={{ paddingLeft: 2, minHeight: "100%" }}>
          <Typography {...typoSx} variant="h6">
            Details
          </Typography>
          <ListItem>
              <ListItemAvatar>
                {bandLeader.photo ? (
                  <Avatar
                    src={bandLeader.photo}
                    alt={bandLeader.name}
                    sx={{ height: avatarSize, width: avatarSize }}
                  />
                ) : (
                  <Avatar {...stringAvatar(bandLeader.name, avatarSize)} />
                )}
              </ListItemAvatar>
            {/* <ListItemText  primary={bandLeader.name} /> */}

            <Typography variant="subtitle1">
              Gig hosted by <strong>{bandLeader.name}</strong>
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <AttachMoney color="success" />
            </ListItemIcon>
            <Typography>
              <strong>Pay: &nbsp; </strong>${payment}
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <LocationOn color="error" />
            </ListItemIcon>
            <Typography>
              <strong>Location: &nbsp;</strong>
              {gigLocation}
            </Typography>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CalendarToday color="info" />
            </ListItemIcon>
            <Typography>
              <strong>Date: &nbsp; </strong>
              {`${d.toLocaleDateString()} at ${returnTime(d)}`}
            </Typography>
          </ListItem>
          {!_.isEmpty(entries) && (
            <>
              {/* <Grid item xs={12} sm={6} md={3}> */}
              {/* <Paper elevation={10} sx={{ padding: 1, minHeight: "100%" }}> */}
              {entries.length ? (
                <Grid item xs={12}>
                  {/* <Divider sx={{ paddingY: 1 }} /> */}
                  <Typography {...typoSx} variant="h6">
                    Additional Info
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12}>
                {entries.map((entry, i) => {
                  return (
                    <ListItem key={i}>
                      {/* <ListItemIcon sx={{  }}></ListItemIcon> */}
                      <Typography sx={{}}>
                        <strong>{properize(entry[0])}: &nbsp; </strong>
                        {`${entry[1]}`}
                      </Typography>
                    </ListItem>
                  );
                })}
              </Grid>
              {/* </Paper> */}
              {/* </Grid> */}
            </>
          )}
          <div id="gig-padding" style={{ height: 20 }} />
        </Paper>
      </Grid>
      {/* <Divider sx={{ paddingY: 1 }} /> */}
      <Grid
        container
        item
        xs={12}
        sm={6}
        md={4}
        display="flex"
        flexDirection="column"
        // justifyContent="space-between"
        // {...typoSx}
      >
        <Paper elevation={10} sx={{ padding: 1, minHeight: "100%" }}>
          <Grid item xs={12} container>
            <Grid item xs={4} paddingLeft={1}>
              <Typography variant="h6">Band</Typography>
            </Grid>
            <Grid
              item
              xs={8}
              display="flex"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              {filled.length ? (
                filled.length === roles.length ? (
                  <>
                    <CheckCircleOutline color="success" />
                    <Typography>Band Filled!</Typography>
                  </>
                ) : (
                  <>{`${filled.length}/${roles.length} filled`}</>
                )
              ) : null}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            {roles.length
              ? roles.map((r, i) => (
                  <ListItem key={i}>
                    <Typography>
                      <strong>{properize(r)}:</strong> &nbsp;{" "}
                      {bandMembers.filter((p) => p.role === r)[0]?.name ??
                        callStack?.stackTable[r]?.confirmed?.name ??
                        callStack?.stackTable[r]?.confirmed?.email ?? (
                          <i>Not filled</i>
                        )}
                    </Typography>
                  </ListItem>
                ))
              : null}
            {/* </List> */}
          </Grid>
          <div id="gig-padding" style={{ height: 20 }} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OpenGigInfo;

/**
 *   {/* //*** **** **** *** *** *** *** ** ** * * * */ //*** **** **** *** *** *** *** ** ** * * * *///*** **** **** *** *** *** *** ** ** * * * */
//*** **** **** *** *** *** *** ** ** * * * *///*** **** **** *** *** *** *** ** ** * * * */ //*** **** **** *** *** *** *** ** ** * * * */
//*** **** **** *** *** *** *** ** ** * * * *///*** **** **** *** *** *** *** ** ** * * * */ //*** **** **** *** *** *** *** ** ** * * * */
//*** **** **** *** *** *** *** ** ** * * * *///*** **** **** *** *** *** *** ** ** * * * */ //*** **** **** *** *** *** *** ** ** * * * */
//CHANGE THIS IN THE SERVER TO ADD NAME AND EMAIL AS AN OBJECT
//REQUIRE USER TO GIVE NAME WHEN ACCEPTING THE OFFER */}
