import React, { useState } from "react";
import { GigIndexState } from "../GigsIndex";
import { Notification } from "../../../../../types/API.types";
import { Button, Grid, Paper, Typography, Box } from "@mui/material";
import { HashCode } from "../Gig.types";
import NotificationsDashBoard from "./GigDashboard";
import Notifications from "../../../components/Notifications";
import { GigSidebar, BottomNav } from "./Navigation";
import GigsDash from "./GigsDash";
import GigsMapper from "./mappers/GigsMapper";

interface GigWelcomeProps extends GigIndexState {}

const GigWelcome: React.FunctionComponent<GigWelcomeProps> = (
  props: GigWelcomeProps
) => {
  const [route, setRoute] = useState("offers");
  const { user, notifications, messageCode, windowDimensions, setGigState } =
    props;
  const { width } = windowDimensions;

  const routes: any = {
    notifications: {
      body: (
        <Notifications
          notifications={filterNotifications(messageCode, notifications)}
          setHomeState={props.setHomeState}
        />
      ),
      dash: <NotificationsDashBoard {...props} />,
    },
    gigs: {
      body: <GigsMapper {...props} setRoute={setRoute} gigsOrOffers="gigs" />,
      dash: <GigsDash {...props} gigsOrOffers="gigs" />,
    },
    offers: {
      body: <GigsMapper {...props} setRoute={setRoute} gigsOrOffers="offers" />,
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
          {`Welcome back, ${user.name.split(" ")[0]}!`}
        </Typography>
      </Paper>
      {routes[route].dash}
      <Grid container spacing={2} display="flex" justifyContent="center">
        {width >= 600 && (
          <Grid item xs={3} sm={3}>
            <GigSidebar {...props} setRoute={setRoute} route={route} />
          </Grid>
        )}
        <Grid item xs={12} sm={9}>
          {routes[route].body}
          <Box display="flex" justifyContent="center">
            {route === "notifications" && notifications.length ? (
              <Button onClick={() => setGigState("messageCode", null)}>
                show all notifications
              </Button>
            ) : route === "notifications" ? (
              <Button disabled>No Notifications!</Button>
            ) : null}
          </Box>
        </Grid>
      </Grid>
      {width < 600 && (
        <>
          <div id="spacer" style={{ height: 40 }} />{" "}
          <BottomNav {...props} setRoute={setRoute} route={route} />
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
