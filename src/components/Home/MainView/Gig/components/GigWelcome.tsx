import React, { useEffect, useState, useContext } from "react";
import { GigIndexState } from "../GigsIndex";
import { Notification } from "../../../../../types/API.types";
import {
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Badge,
} from "@mui/material";
import { DetailedGig, HashCode, RouteOption, Routes } from "../Gig.types";
import NotificationsDashBoard from "./GigDashboard";
import Notifications from "../../../components/Notifications";
import { GigSidebar, BottomNav } from "./Navigation";
import GigsDash from "./GigsDash";
import GigsMapper from "./mappers/GigsMapper";
import "../Gig.css";
import { fetchHandler } from "../../../../_helpers/fetchHandler";
import API_URL from "../../../../_helpers/environment";
import { UserCtx } from "../../../../Context/MainContext";
import { dark, light } from "../../../../Theme/Theme";
import StoryFeed from "../../../Stories/StoryFeed";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import GigCreate from "../GigCreate";
import { Redirect } from "react-router";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { smallImage } from "../../../../_helpers/helpers";
import Swal from "sweetalert2";

interface GigWelcomeProps extends GigIndexState {
  dashboardRoute: RouteOption; //Main state
  detailsHash: { [key: string]: DetailedGig };
  followInfo?: any;
  setMainState: (key: string, value: any) => void;
  setHomeState: (key: string, value: any) => void;
}

const GigWelcome: React.FunctionComponent<GigWelcomeProps> = (
  props: GigWelcomeProps
) => {
  const {
    user,
    notifications,
    messageCode,
    dashboardRoute,
    followInfo,
    setGigState,
    setMainState,
  } = props;

  // const [windowDimensions, setWindowDimensions] = useState({height: window.innerHeight, width: window.innerWidth});
  const [width, setWidth] = useState(window.innerWidth);
  const context = useContext(UserCtx);

  const handleResize = (w: number): void => setWidth(w);

  useEffect(() => {
    window.addEventListener("resize", () => handleResize(window.innerWidth));
    return window.removeEventListener("resize", () =>
      handleResize(window.innerWidth)
    );
  });

  const handleDeleteAll = async (): Promise<boolean> => {
    const { deletions, success } = await fetchHandler({
      url: `${API_URL}/notification/deleteAll`,
      method: "delete",
      auth: localStorage.getItem("token") ?? "",
    });
    success && setGigState("notifications", []);
    context?.handleSnackBar(
      success ? `${deletions} messages deleted` : "Something went wrong!",
      success ? "success" : "error"
    );
    return success;
  };

  const setRoute = (route: RouteOption) =>
    setMainState("dashboardRoute", route);

  const routes: Routes = {
    notifications: {
      body: (
        <Notifications
          notifications={filterNotifications(messageCode, notifications)}
          setHomeState={props.setHomeState}
        />
        // <div />
      ),
      dash: <NotificationsDashBoard {...props} width={width} />,
    },
    gigs: {
      body: <GigsMapper {...props} gigsOrOffers="gigs" user={props.user} />,
      dash: <GigsDash {...props} gigsOrOffers="gigs" />,
    },
    offers: {
      body: <GigsMapper {...props} gigsOrOffers="offers" user={props.user} />,
      dash: <GigsDash {...props} gigsOrOffers="offers" />,
    },
    addGig: {
      body: <Redirect to="/main/add" />,
      dash: <React.Fragment />,
    },
    addStory: {
      body: <Redirect to={`/main/profile/${props.user?.id}`} />,
      dash: <GigsDash {...props} gigsOrOffers="offers" />,
    },
  };

  const drawerWidth = 300;

  return width < 900 ? (
    <>
      <Grid
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        {/* <Typography variant="h5" paddingBottom={2} paddingTop={1}>
          {user && `Welcome back, ${user.name.split(" ")[0]}!`}
        </Typography> */}
      </Grid>
      {routes[dashboardRoute]?.dash}
      <Grid container spacing={2} display="flex" justifyContent="center">
        <Grid item xs={12} sm={10}>
          {routes[dashboardRoute]?.body}
          <Box display="flex" justifyContent="center" p={1}>
            {dashboardRoute === "notifications" && notifications.length ? (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={async () => console.log(await handleDeleteAll())}
                >
                  Delete all notifications
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setGigState("messageCode", null)}
                >
                  show all notifications
                </Button>
              </>
            ) : dashboardRoute === "notifications" ? (
              <Button disabled sx={{ marginTop: 4 }}>
                No Notifications!
              </Button>
            ) : null}
          </Box>
        </Grid>
      </Grid>
      <div id="spacer" className="small-screen" style={{ height: 40 }} />{" "}
      <BottomNav
        {...props}
        setRoute={setRoute}
        route={dashboardRoute}
        setMainState={setMainState}
      />
    </>
  ) : (
    /**
     * *** *** *** *** *** ***
     * *** *** *** *** *** ***
     * *** GREATER THAN 900 width
     * *** *** *** *** *** ***
     * *** *** *** *** *** ***
     */
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: light.palette.grey[900],
          },
          // height: '100%'
        }}
      >
        <Toolbar sx={{ height: 100 }} />
        <Box sx={{}}>
          <Grid
            container
            item
            xs={12}
            display="flex"
            flexDirection="column"
            padding={2}
            wrap={"nowrap"}
            // pr={4}
            maxHeight={"100%"}
            // bgcolor={dark.palette.background.default}
          >
            {!!props.offers.length && (
              <>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography
                    pt={1}
                    variant="subtitle1"
                    fontWeight={600}
                    color="white"
                  >
                    Offers
                  </Typography>
                  <Badge badgeContent="!" variant="standard" color="primary">
                    <NotificationsIcon />
                  </Badge>
                </Box>
                <Grid
                  border={1}
                  borderColor={"divider"}
                  // style={{ overflowY: "auto" }}
                >
                  <GigsMapper
                    {...props}
                    gigsOrOffers="offers"
                    user={props.user}
                  />
                </Grid>
              </>
            )}
            <Box
              component="div"
              sx={{ display: "flex", justifyContent: "space-between" }}
            >
              <Typography variant="subtitle1" fontWeight={600} color="white">
                Gigs
              </Typography>
              <Button onClick={() => setRoute("addGig")}>
                <Add fontSize="small" /> new gig?
              </Button>
            </Box>
            <Grid
              border={1}
              borderColor={"divider"}
              style={{ maxHeight: "100%", overflowY: "auto" }}
            >
              <GigsMapper {...props} gigsOrOffers="gigs" user={props.user} />
              {!props.gigs.length && (
                <Typography
                  variant="overline"
                  ml={2}
                  fontWeight={300}
                  color="#ffffff80"
                >
                  <i>... NO GIGS!</i>
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Drawer>
      <Grid
        container
        width={`calc(100vw - ${drawerWidth + 30}px)`}
        height={"calc(100vh - 150px)"}
        sx={{ ml: `${drawerWidth + 15}px`, mr: "15px" }}
      >
        {["notifications", "gigs", "offers"].includes(dashboardRoute) ? (
          <>
            <Grid item md={12} lg={8} xl={9} height="calc(100% - 30px)">
              <Box
                component="div"
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Typography pt={1} variant="h5" fontWeight={200}>
                  {messageCode === 100
                    ? "Offers"
                    : messageCode === 200
                    ? "Responses"
                    : messageCode === 300
                    ? "Updates"
                    : "All activity"}
                </Typography>
                {dashboardRoute === "notifications" && notifications.length ? (
                  <Box
                    component="div"
                    sx={{ display: "flex", alignItems: "flex-end", mb: -1 }}
                  >
                    <Button
                      variant="text"
                      // color="error"
                      onClick={async () => {
                        Swal.fire({
                          title: 'Are you sure?',
                          text: "Your notifications will be gone for good!",
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#3085d6',
                          cancelButtonColor: '#d33',
                          confirmButtonText: 'Yes, delete them!',
                          customClass: {
                            container:
                              context?.darkModeOn === "true" ? "dark-mode-swal" : "",
                          }
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            await handleDeleteAll() && Swal.fire(
                              {title: 'Deleted!',
                              text: 'Your notifications have been deleted.',
                              icon: 'success',
                              customClass: {
                                container:
                                  context?.darkModeOn === "true" ? "dark-mode-swal" : "",
                              }}
                            )
                          }
                        })
                        
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="text"
                      // color="info"
                      onClick={() => setGigState("messageCode", null)}
                    >
                      show all
                    </Button>
                  </Box>
                ) : dashboardRoute === "notifications" ? (
                  <Box
                    component="div"
                    sx={{ display: "flex", alignItems: "flex-end", mb: -1 }}
                  >
                    <Button disabled>
                      <i>No Notifications</i>
                    </Button>
                  </Box>
                ) : null}
              </Box>
              <Box
                component="div"
                border={1}
                borderColor={dark.palette.divider}
                height="100%"
              >
                <NotificationsDashBoard {...props} width={599} />
                <Notifications
                  notifications={filterNotifications(
                    messageCode,
                    notifications
                  )}
                  setHomeState={props.setHomeState}
                >
                  {/* <NotificationsDashBoard {...props} width={599} /> */}
                </Notifications>
              </Box>
              <Box display="flex" justifyContent="center" p={2}></Box>
            </Grid>
            <Grid
              container
              item
              lg={4}
              xl={3}
              display="flex"
              flexDirection="column"
              wrap={"nowrap"}
              pl={1}
              pt={0}
              maxHeight={"100%"}
              sx={{ display: { xs: "none", lg: "flex" } }}
            >
              <Grid item xs={12} sx={{ maxHeight: "50%", overflowY: "hidden" }}>
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    position: "relative",
                    bottom: -3,
                  }}
                >
                  <Typography pt={1} variant="h6" fontWeight={200}>
                    Stories
                  </Typography>
                  <Button
                    onClick={() => {
                      setMainState("profileModalOpen", true);
                      setRoute("addStory");
                    }}
                    sx={{ position: "relative", bottom: -3 }}
                  >
                    <Add fontSize="small" /> new Story?
                  </Button>
                </Box>
                <Box
                  border={1}
                  borderColor={"divider"}
                  component="div"
                  sx={{ maxHeight: "100%", width: "100%", overflowY: "auto" }}
                >
                  <StoryFeed dashboard={true} />
                  <div style={{ height: 20, width: "100%" }} />
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ maxHeight: "50%" }}>
                {/* <Box
                  component="div"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                > */}
                <Typography
                  pt={1}
                  variant="h6"
                  fontWeight={200}
                  sx={{ position: "relative", bottom: -15 }}
                >
                  People You Follow:
                </Typography>

                <Box
                  border={1}
                  borderColor={"divider"}
                  component="ul"
                  sx={{
                    maxHeight: "calc(100% - 46px)",
                    width: "100%",
                    overflowY: "auto",
                    ml: 0,
                    pl: 0,
                    bgcolor: dark.palette.background.default,
                    color: 'white'
                  }}
                >
                  {!!followInfo &&
                    user?.following?.map((userId, i) => {
                      const u =
                        !!followInfo?.length &&
                        followInfo?.filter((u: any) => u.id === userId)[0];
                      if (!u) return <React.Fragment />;
                      return (
                        <Link to={`/main/profile/${u.id}`} key={u.id}>
                          <Box
                            component="li"
                            display="flex"
                            alignItems="center"
                            pl={2}
                            justifyContent="space-between"
                            className="list-link"
                          >
                            <Box
                              component="div"
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                            >
                              <Avatar
                                src={smallImage(u.photo ?? '')}
                                alt=""
                                sx={{ height: 20, width: 20 }}
                              />
                              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <Typography variant="subtitle1">
                                {u.name}
                              </Typography>{" "}
                            </Box>
                            {/* &nbsp;&nbsp; */}
                            <Typography variant="body2" pr={1} fontWeight={300}>
                              {u.role}
                            </Typography>
                          </Box>
                        </Link>
                        //   <Box component="li"  {...props}>
                        //   <Avatar
                        //     src={option.photo}
                        //     alt=""
                        //   />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        //   <Typography variant='subtitle1'>{option.name}</Typography> &nbsp;&nbsp;
                        //   <Typography variant='body1'>{option.role}</Typography>
                        // </Box>
                      );
                    })}
                </Box>
              </Grid>
            </Grid>
          </>
        ) : (
          routes[dashboardRoute].body
        )}
      </Grid>
    </>
  );
};

const filterNotifications = (
  code: number | null,
  notifications: Notification[]
): Notification[] => {
  if (!code) return notifications;
  return notifications.filter(
    (n) => n.details.code === code || n.details.code === code + 1
  );
};

export default GigWelcome;
