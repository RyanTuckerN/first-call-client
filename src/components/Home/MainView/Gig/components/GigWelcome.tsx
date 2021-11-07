import React, { useEffect, useState, useContext } from "react";
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
import { fetchHandler } from "../../../../_helpers/fetchHandler";
import API_URL from "../../../../_helpers/environment";
import { UserCtx } from "../../../../Context/MainContext";
import { dark } from "../../../../Theme/Theme";
import StoryFeed from "../../../Stories/StoryFeed";

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
    gig: {
      body: <GigsMapper {...props} gigsOrOffers="offers" user={props.user} />,
      dash: <GigsDash {...props} gigsOrOffers="offers" />,
    },
    callStack: {
      body: <GigsMapper {...props} gigsOrOffers="offers" user={props.user} />,
      dash: <GigsDash {...props} gigsOrOffers="offers" />,
    },
  };

  return width < 900 ? (
    <>
      <Grid
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Typography variant="h5" paddingBottom={2} paddingTop={1}>
          {user && `Welcome back, ${user.name.split(" ")[0]}!`}
        </Typography>
      </Grid>
      {routes[dashboardRoute]?.dash}
      <Grid container spacing={2} display="flex" justifyContent="center">
        <Grid item xs={12} sm={9}>
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
      <BottomNav {...props} setRoute={setRoute} route={dashboardRoute} />
    </>
  ) : (
    /**
     * *** *** *** *** *** ***
     * *** *** *** *** *** ***
     * *** GREATER THAN 900 width
     * *** *** *** *** *** ***
     * *** *** *** *** *** ***
     */
    <Grid container height={"calc(100vh - 180px)"}>
      <Grid
        container
        item
        md={5}
        lg={4}
        display="flex"
        flexDirection="column"
        padding={2}
        wrap={"nowrap"}
        pr={4}
        maxHeight={"100%"}
      >
        {/* {props.gigs.map((gig, i) => (
          <GigCardAlt {...gig} key={i} />
        ))} */}
        <Typography variant="subtitle1" fontWeight={600}>
          Gigs
        </Typography>
        <Grid
          border={1}
          borderColor={"divider"}
          style={{ maxHeight: "45%", overflowY: "scroll" }}
        >
          <GigsMapper {...props} gigsOrOffers="gigs" user={props.user} />
          {!props.gigs.length && (
            <Typography variant="overline" ml={2} fontWeight={300} color='#ffffff80'>
              <i>... NO GIGS!</i>
            </Typography>
          )}
        </Grid>
        <Typography pt={1} variant="subtitle1" fontWeight={600}>
          Offers
        </Typography>
        <Grid
          border={1}
          borderColor={"divider"}
          style={{ maxHeight: "45%", overflowY: "scroll" }}
        >
          <GigsMapper {...props} gigsOrOffers="offers" user={props.user} />
          {!props.offers.length && (
            <Typography variant="overline" ml={2} fontWeight={300} color='#ffffff80'>
              <i>... NO OFFERS!</i>
            </Typography>
          )}
        </Grid>
      </Grid>
      <Grid
        item
        md={7}
        lg={4}
        xl={5}
        height="95%"
        border={1}
        borderColor={dark.palette.divider}
      >
        <NotificationsDashBoard {...props} width={599} />

        <Notifications
          notifications={filterNotifications(messageCode, notifications)}
          setHomeState={props.setHomeState}
        >
          {/* <NotificationsDashBoard {...props} width={599} /> */}
        </Notifications>
        <Box display="flex" justifyContent="center" p={2}>
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
      <Grid
        container
        item
        lg={4}
        xl={3}
        display="flex"
        flexDirection="column"
        padding={2}
        wrap={"nowrap"}
        pr={4}
        maxHeight={"100%"}
        sx={{ display: { xs: "none", lg: "block" } }}
      >
        <StoryFeed dashboard={true} />
      </Grid>
    </Grid>
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
