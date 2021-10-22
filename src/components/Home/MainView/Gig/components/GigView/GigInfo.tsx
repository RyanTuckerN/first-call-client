import * as React from "react";
import { useEffect } from "react";
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
  Divider,
} from "@mui/material";
import { properize, returnTime } from "../../../../../_helpers/helpers";
import {
  Settings,
  AttachMoney,
  LocationOn,
  CalendarToday,
  ChevronRight,
} from "@mui/icons-material";
import { DetailedGig } from "../../Gig.types";
import { stringAvatar } from "../../../Settings/Header";
import { User } from "../../../../../../types/API.types";

const avatarSize: number = 50;

interface GigInfoProps extends GigPageState {
  details: DetailedGig;
  setAuth: (b: boolean) => void;
  user: User;
}

const GigInfo: React.FunctionComponent<GigInfoProps> = ({
  authorizedView,
  setAuth,
  date,
  // description,
  callStack,
  // openCalls,
  optionalInfo,
  details,
  payment,
  location,
  user,
}) => {
  const d = new Date(date);
  const { bandLeader, bandMembers } = details;
  useEffect(() => setAuth(user.id === details.bandLeader.id), []);
  const entries = Object.entries(optionalInfo ?? {});
  const roles = Object.keys(callStack?.stackTable ?? {});
  console.log(entries);

  return (
    <>
      <Typography variant="h6">Details</Typography>
      <List>
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
          {authorizedView ? (
            <Typography variant="subtitle1">You are the bandleader</Typography>
          ) : (
            <Typography variant="subtitle1">
              Gig hosted by <strong>{bandLeader.name}</strong>
            </Typography>
          )}
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
            {location}
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
        {entries.length && (
          <>
            <Divider sx={{ paddingY: 1 }} />
            <Typography variant="h6">Additional info</Typography>
          </>
        )}

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
        <Divider sx={{ paddingY: 1 }} />
        <Typography variant="h6">Band</Typography>

        
        {roles.length ? (
          roles.map((r) => (
            <ListItem>
              <Typography>
                <strong>{properize(r)}:</strong> &nbsp;{" "}
                {bandMembers.filter((p) => p.role === r)[0]?.name ??
                  callStack?.stackTable[r]?.confirmed?.name ??
                  callStack?.stackTable[r]?.confirmed?.email ??
                  "Not filled"}
              </Typography>
            </ListItem>
          ))
        ) : (
          <div>Nothing to display!</div>
        )}
      </List>
    </>
  );
};

export default GigInfo;

/**
 *   {/* //*** **** **** *** *** *** *** ** ** * * * */ //*** **** **** *** *** *** *** ** ** * * * *///*** **** **** *** *** *** *** ** ** * * * */
//*** **** **** *** *** *** *** ** ** * * * *///*** **** **** *** *** *** *** ** ** * * * */ //*** **** **** *** *** *** *** ** ** * * * */
//*** **** **** *** *** *** *** ** ** * * * *///*** **** **** *** *** *** *** ** ** * * * */ //*** **** **** *** *** *** *** ** ** * * * */
//*** **** **** *** *** *** *** ** ** * * * *///*** **** **** *** *** *** *** ** ** * * * */ //*** **** **** *** *** *** *** ** ** * * * */
//CHANGE THIS IN THE SERVER TO ADD NAME AND EMAIL AS AN OBJECT
//REQUIRE USER TO GIVE NAME WHEN ACCEPTING THE OFFER */}
