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
  Build,
  AddBoxOutlined,
  // Circle
} from "@mui/icons-material";
import { DetailedGig } from "../../Gig.types";
import {Link} from 'react-router-dom'
import { stringAvatar } from "../../../Settings/Header";
import { Gig, User } from "../../../../../../types/API.types";
import * as _ from "lodash";
import { Zoom, Fade } from "react-reveal";

const avatarSize: number = 35;

interface GigInfoProps extends GigPageState {
  details: DetailedGig;
  user: User;
  gig: Gig;
  toggleEditMode?: VoidFunction;
  setAuth?: (b: boolean) => void;
}

const GigInfo: React.FunctionComponent<GigInfoProps> = ({
  authorizedView,
  details,
  gig,
  user,
  setAuth,
  toggleEditMode,
}) => {
  const [emptyStack, setEmptyStack] = useState(false);
  const { date, callStack, optionalInfo, payment, gigLocation } = gig;
  const { bandLeader, bandMembers } = details;

  const checkStack = (): void => {
    setEmptyStack(
      roles.map((r) => callStack?.stackTable[r].emptyStack).includes(true)
    );
  };

  useEffect(
    setAuth ? () => setAuth(user.id === details.bandLeader.id) : () => null,
    []
  );
  useEffect(checkStack, [callStack]);

  const d = new Date(date);
  const entries = Object.entries(optionalInfo ?? {});
  const roles = Object.keys(callStack?.stackTable ?? {});
  const filled = roles.filter((r) => callStack?.stackTable[r].filled);
  const typoSx = { paddingTop: 1.5 };

  return (
    <Grid
      container
      display="flex"
      flexDirection='row'
      justifyContent="center"
      spacing={1}
      sx={{ padding: 1 }}
    >
      {/* <List> */}
      {/* {gig.photo && (
        <Grid item xs={12} sm={5} md={3}>
          <Avatar variant="square" src={gig.photo} sx={{height: '100%', width:'100%'}} />
        </Grid>
      )} */}
      <Grid item xs={12} sm={7} md={4}>
        <Paper elevation={10} sx={{ paddingLeft: 2, minHeight: "100%" }}>
          <Typography {...typoSx} variant="h6">
            Details
          </Typography>
          <ListItem>
            <Link to={`/main/profile/${bandLeader.id}`}>
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
            </Link>
            {/* <ListItemText  primary={bandLeader.name} /> */}
            {authorizedView ? (
              <Typography variant="subtitle1">
                You are the bandleader
              </Typography>
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
      <div id='gig-padding' style={{height:20}}/>
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
                  <>
                    {emptyStack && authorizedView ? (
                      <ErrorOutline
                        color="error"
                        fontSize="small"
                        sx={{ marginLeft: 1 }}
                      />
                    ) : null}
                    {`${filled.length}/${roles.length} filled`}
                  </>
                )
              ) : null}
            </Grid>
          </Grid>

          <Grid item xs={12}>
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
                    {role.filled ? (
                      <IconButton>
                        <CheckCircleOutline
                          sx={{ fontSize: 13 }}
                          color="success"
                        />
                      </IconButton>
                    ) : role.emptyStack ? (
                      <IconButton onClick={toggleEditMode}>
                        <ErrorOutline sx={{ fontSize: 13 }} color="error" />
                      </IconButton>
                    ) : (
                      <IconButton disabled>
                        <ErrorOutline
                          sx={{ fontSize: 13, color: "rgba(0,0,0,0)" }}
                        />
                      </IconButton>
                    )}
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
                            <Typography variant="body2">
                              Empty Stack!
                            </Typography>
                          ) : (
                            <>
                              <Typography
                                display="inline"
                                sx={{ marginLeft: 1 }}
                              >
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
                                    Backups:
                                  </Typography>
                                ) : null}
                                {role.calls?.length
                                  ? role.calls?.map((call: any, i: number) => (
                                      <Typography
                                        // display="inline"
                                        sx={{ marginLeft: 3 }}
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
              <ListItem>
                {/* <ListItemIcon> */}
                <IconButton onClick={toggleEditMode}>
                  <AddBoxOutlined />
                </IconButton>
                {/* </ListItemIcon> */}
                <Typography
                  display="inline"
                  sx={{ marginLeft: 1 }}
                  variant="body2"
                >
                  Create your call lists!
                </Typography>
              </ListItem>
            )}
            {/* </List> */}
          </Grid>
      <div id='gig-padding' style={{height:20}}/>

        </Paper>
      </Grid>
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
