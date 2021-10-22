import * as React from "react";
import { useEffect, useState } from "react";
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
  CheckCircleOutline,
  Circle,
  ErrorOutline,
  // Circle
} from "@mui/icons-material";
import { DetailedGig } from "../../Gig.types";
import { stringAvatar } from "../../../Settings/Header";
import { Gig, User } from "../../../../../../types/API.types";

const avatarSize: number = 35;

interface GigInfoProps extends GigPageState {
  details: DetailedGig;
  setAuth: (b: boolean) => void;
  toggleEditMode: VoidFunction;
  user: User;
  gig: Gig;
}

const GigInfo: React.FunctionComponent<GigInfoProps> = ({
  authorizedView,
  setAuth,
  toggleEditMode,
  // openCalls,
  // description,
  details,
  gig,
  user,
}) => {
  const [emptyStack, setEmptyStack] = useState(false);
  const { date, callStack, optionalInfo, payment, location } = gig;
  const { bandLeader, bandMembers } = details;

  const checkStack = (): void => {
    setEmptyStack(
      roles.map((r) => callStack?.stackTable[r].emptyStack).includes(true)
    );
  };

  useEffect(() => setAuth(user.id === details.bandLeader.id), []);
  useEffect(checkStack, [callStack]);

  const d = new Date(date);
  const entries = Object.entries(optionalInfo ?? {});
  const roles = Object.keys(callStack?.stackTable ?? {});
  const filled = roles.filter((r) => callStack?.stackTable[r].filled);
  const typoSx = { paddingTop: 3 };

  return (
    <Grid container display="flex" justifyContent="center">
      <List>
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
            <Typography {...typoSx} variant="h6">
              Additional Info
            </Typography>
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
        <Grid
          container
          display="flex"
          justifyContent="space-between"
          {...typoSx}
        >
          <Grid item display="flex">
            <Typography variant="h6">Band</Typography>
            {emptyStack && authorizedView ? (
              <ErrorOutline
                color="error"
                fontSize="small"
                sx={{ marginLeft: 1 }}
              />
            ) : null}
          </Grid>
          <Grid item display="flex">
            {filled.length === roles.length ? (
              <>
                <CheckCircleOutline color="success" />
                <Typography>Band Filled!</Typography>
              </>
            ) : (
              <>{`${filled.length}/${roles.length} filled`}</>
            )}
          </Grid>
        </Grid>

        {roles.length && !authorizedView ? (
          roles.map((r, i) => (
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
        ) : roles.length && authorizedView ? (
          roles.map((r, i) => {
            const role = callStack?.stackTable[r];
            return (
              <ListItem key={i}>
                <ListItemIcon>
                  {role.filled ? (
                      <IconButton>
                        <CheckCircleOutline sx={{fontSize: 17}} color="success" />
                      </IconButton>
                  ) : role.emptyStack ? (
                    <IconButton onClick={toggleEditMode} >
                      <ErrorOutline sx={{fontSize: 17}} color="error" />
                    </IconButton>
                  ) : (
                    null
                  )}
                </ListItemIcon>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography>
                      <strong>{properize(r)}:</strong> &nbsp;{" "}
                      {bandMembers.filter((p) => p.role === r)[0]?.name ??
                        role?.confirmed?.name ??
                        role?.confirmed?.email ?? <i>Not filled</i>}
                    </Typography>
                  </Grid>
                  <div>
                    {!role.filled ? (
                      !role.onCall && !role.calls?.length ? (
                        <Typography variant="body2">Empty Stack!</Typography>
                      ) : (
                        <>
                          <Typography display="inline" sx={{ marginLeft: 1 }}>
                            On call:
                          </Typography>
                          <Typography
                            display="inline"
                            sx={{ marginLeft: 1 }}
                            variant="body2"
                          >
                            {role.onCall}
                          </Typography>
                          <Box>
                            {role.calls?.length ? (
                              <Typography
                                display="inline"
                                sx={{ marginLeft: 1 }}
                              >
                                Stack:
                              </Typography>
                            ) : null}
                            {role.calls?.length
                              ? role.calls?.map((call: any, i: number) => (
                                  <Typography
                                    display="inline"
                                    sx={{ marginLeft: 1 }}
                                    variant="body2"
                                    key={i}
                                  >
                                    {call}
                                  </Typography>
                                ))
                              : null}
                          </Box>
                        </>
                      )
                    ) : null}
                  </div>
                </Grid>
              </ListItem>
            );
          })
        ) : (
          <div>Nothing to display!</div>
        )}
      </List>
    </Grid>
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
