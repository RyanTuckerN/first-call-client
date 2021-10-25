import React, { useEffect, useState } from "react";
import { GigIndexState } from "../GigsIndex";
import { Notification } from "../../../../../types/API.types";
import { Button, Grid, Paper, Typography, Box } from "@mui/material";
import { DetailedGig, HashCode, RouteOption, Routes } from "../Gig.types";
import NotificationsDashBoard from "./GigDashboard";
import Notifications from "../../../components/Notifications";
import { GigSidebar, BottomNav } from "./Navigation";
import GigsDash from "./GigsDash";
import GigsMapper from "./mappers/GigsMapper";
import "../Gig.css";

interface GigWelcomeProps extends GigIndexState {
  dashboardRoute: RouteOption; //Main state
  detailsHash: { [key: string]: DetailedGig };
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
    setGigState,
    setMainState,
  } = props;

  // const [windowDimensions, setWindowDimensions] = useState({height: window.innerHeight, width: window.innerWidth});
  const [width, setWidth] = useState(window.innerWidth);

  const handleResize = (w: number): void => setWidth(w);

  useEffect(() => {
    window.addEventListener("resize", () => handleResize(window.innerWidth));
    return window.removeEventListener("resize", () => handleResize(window.innerWidth)
    );
  });

  // useEffect(()=>{
  //   console.log(windowDimensions)
  // },[windowDimensions])

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
    gig: {
      body: <GigsMapper {...props} gigsOrOffers="offers" user={props.user} />,
      dash: <GigsDash {...props} gigsOrOffers="offers" />,
    },
    callStack: {
      body: <GigsMapper {...props} gigsOrOffers="offers" user={props.user} />,
      dash: <GigsDash {...props} gigsOrOffers="offers" />,
    },
  };

  return (
    <>
      <Paper
        elevation={15}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography variant="h5" paddingBottom={2} paddingTop={1}>
          {user && `Welcome back, ${user.name.split(" ")[0]}!`}
        </Typography>
      </Paper>
      {routes[dashboardRoute]?.dash}
      <Grid container spacing={2} display="flex" justifyContent="center">
        {width >= 600 && (
          <Grid className="large-screen" item xs={3} sm={false}>
            <GigSidebar {...props} setRoute={setRoute} route={dashboardRoute} />
          </Grid>
        )}
        <Grid item xs={12} sm={9}>
          {routes[dashboardRoute]?.body}
          <Box display="flex" justifyContent="center">
            {dashboardRoute === "notifications" && notifications.length ? (
              <Button onClick={() => setGigState("messageCode", null)}>
                show all notifications
              </Button>
            ) : dashboardRoute === "notifications" ? (
              <Button disabled sx={{ marginTop: 4 }}>
                No Notifications!
              </Button>
            ) : null}
          </Box>
        </Grid>
      </Grid>
      {width < 600 && (
        <>
          <div id="spacer" className="small-screen" style={{ height: 40 }} />{" "}
          <BottomNav {...props} setRoute={setRoute} route={dashboardRoute} />
        </>
      )}
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
