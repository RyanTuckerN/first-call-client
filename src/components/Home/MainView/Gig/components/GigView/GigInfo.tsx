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
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { returnTime } from "../../../../../_helpers/helpers";
import { Settings, AttachMoney, LocationOn, CalendarToday } from "@mui/icons-material";
import { DetailedGig } from "../../Gig.types";
import { stringAvatar } from "../../../Settings/Header";

const avatarSize: number = 100;

interface GigInfoProps extends GigPageState {
  details: DetailedGig;
}

const GigInfo: React.FunctionComponent<GigInfoProps> = ({
  authorizedView,
  date,
  description,
  callStack,
  openCalls,
  optionalInfo,
  details,
  payment,
  location,
}) => {
  const d = new Date(date);
  const { bandLeader, bandMembers } = details;
  const [additionalCategories, values] = Object.entries(optionalInfo ?? {})
  console.log(additionalCategories, values)

  return (
    <Grid
      item
      container
      xs={12}
      padding={4}
      display="flex"
      justifyContent="space-between"
      // letterSpacing={1.5}
      id="gig-header"
    >
      <Grid item xs={12} sm={6} md={6}>
        <Paper elevation={12} sx={{ padding: 2 }}>
          <Typography variant="h6">Details</Typography>
          <List>
            <ListItem>
              <ListItemAvatar>
                {bandLeader.photo ? (
                  <Avatar src={bandLeader.photo} alt={bandLeader.name}  />
                ) : (
                  <Avatar {...stringAvatar(bandLeader.name, avatarSize)} />
                )}
              </ListItemAvatar>
              {/* <ListItemText  primary={bandLeader.name} /> */}
              <Typography variant='subtitle1'>Gig hosted by <strong>{bandLeader.name}</strong></Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <AttachMoney color='success' />
              </ListItemIcon>
              <Typography><strong>Pay: </strong>${payment}</Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <LocationOn color='error' />
              </ListItemIcon>
              <Typography><strong>Location: </strong>{location}</Typography>
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CalendarToday color='info' />
              </ListItemIcon>
              <Typography><strong>Date: </strong>{`${d.toLocaleDateString()} at ${returnTime(d)}`}</Typography>
            </ListItem>

          </List>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={5}>
        <Paper elevation={12}>TEST TEST</Paper>
      </Grid>
    </Grid>
  );
};

export default GigInfo;
