import React, { useEffect, useState, useContext } from "react";
import { GigIndexState } from "../GigsIndex";
import { Notification } from "../../../../../types/API.types";
import {
  Button,
  Grid,
  Typography,
  Box,
  Avatar,
  Badge,
  IconButton,
} from "@mui/material";
import { DetailedGig, RouteOption, Routes } from "../Gig.types";
import NotificationsDashBoard from "./GigDashboard";
import Notifications from "../../../components/Notifications";
import { BottomNav } from "./Navigation";
import GigsDash from "./GigsDash";
import GigsMapper from "./mappers/GigsMapper";
import { fetchHandler } from "../../../../_helpers/fetchHandler";
import API_URL from "../../../../_helpers/environment";
import StoryFeed from "../../../Stories/StoryFeed";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import { UserCtx } from "../../../../Context/MainContext";
import { dark, light } from "../../../../Theme/Theme";
import { Notifications as NotificationsIcon } from "@mui/icons-material";
import { Redirect } from "react-router";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { smallImage } from "../../../../_helpers/helpers";
import Swal from "sweetalert2";
import "../Gig.css";

interface GigWelcomeProps extends GigIndexState {
  dashboardRoute: RouteOption;
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
      ></Grid>
      {routes[dashboardRoute]?.dash}
      <Grid container spacing={2} display="flex" justifyContent="center">
        <Grid item xs={12} sm={10} height={"100%"}>
          {routes[dashboardRoute]?.body}
          <Box display="flex" justifyContent="center" p={1}>
            {dashboardRoute === "notifications" && notifications.length ? (
              <>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={async () => {
                    Swal.fire({
                      title: "Are you sure?",
                      text: "Your notifications will be gone for good!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, delete them!",
                      customClass: {
                        container:
                          context?.darkModeOn === "true"
                            ? "dark-mode-swal"
                            : "",
                      },
                    }).then(async (result) => {
                      if (result.isConfirmed) {
                        (await handleDeleteAll()) &&
                          Swal.fire({
                            title: "Deleted!",
                            text: "Your notifications have been deleted.",
                            icon: "success",
                            customClass: {
                              container:
                                context?.darkModeOn === "true"
                                  ? "dark-mode-swal"
                                  : "",
                            },
                          });
                      }
                    });
                  }}
                >
                  clear
                </Button>
                <Button
                  variant="outlined"
                  color="info"
                  onClick={() => setGigState("messageCode", null)}
                  sx={{ display: messageCode ? "block" : "none" }}
                >
                  show all
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
            maxHeight={"100%"}
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
                  <IconButton
                    onClick={() => props.setGigState("messageCode", 100)}
                  >
                    <Badge badgeContent="!" variant="standard" color="primary">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Box>
                <Grid border={1} borderColor={"divider"}>
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
            <Grid item md={12} lg={8} xl={8} height="calc(100% - 30px)">
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
                      onClick={async () => {
                        Swal.fire({
                          title: "Are you sure?",
                          text: "Your notifications will be gone for good!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, delete them!",
                          customClass: {
                            container:
                              context?.darkModeOn === "true"
                                ? "dark-mode-swal"
                                : "",
                          },
                        }).then(async (result) => {
                          if (result.isConfirmed) {
                            (await handleDeleteAll()) &&
                              Swal.fire({
                                title: "Deleted!",
                                text: "Your notifications have been deleted.",
                                icon: "success",
                                customClass: {
                                  container:
                                    context?.darkModeOn === "true"
                                      ? "dark-mode-swal"
                                      : "",
                                },
                              });
                          }
                        });
                      }}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => setGigState("messageCode", null)}
                      sx={{ display: messageCode ? "block" : "none" }}
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
                ></Notifications>
              </Box>
              <Box display="flex" justifyContent="center" p={2}></Box>
            </Grid>
            <Grid
              className="dashboard-right-side"
              item
              lg={4}
              xl={4}
              flexDirection="column"
              wrap={"nowrap"}
              pl={1}
              pt={0}
              maxHeight={"100%"}
              sx={{ display: { xs: "none", lg: "flex" } }}
            >
              <Grid
                item
                xs={12}
                sx={{
                  maxHeight: !!user?.following.length ? "50%" : "100%",
                  overflowY: "hidden",
                }}
              >
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

              {!!user?.following.length && (
                <Grid item xs={12} sx={{ maxHeight: "50%" }}>
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
                      bgcolor: "background.paper",
                      color: "typography.default",
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
                                  src={smallImage(u.photo ?? "", 40)}
                                  alt=""
                                  sx={{ height: 20, width: 20 }}
                                />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Typography variant="subtitle1">
                                  {u.name}
                                </Typography>{" "}
                              </Box>
                              <Typography
                                variant="body2"
                                pr={1}
                                fontWeight={300}
                              >
                                {u.role}
                              </Typography>
                            </Box>
                          </Link>
                        );
                      })}
                  </Box>
                </Grid>
              )}
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
