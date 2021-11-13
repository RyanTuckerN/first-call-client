import React from "react";

import { GigIndexState } from "../GigsIndex";
import {
  List,
  ListItemButton,
  Typography,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Divider,
} from "@mui/material";
import {
  Event,
  DeviceHub,
  Notifications,
  AddPhotoAlternate,
  Add,
} from "@mui/icons-material";
import { dark } from "../../../../Theme/Theme";
import { RouteOption } from "../Gig.types";

interface GigSidebarProps extends GigIndexState {
  setRoute: any;
  route: string;
}
const activeColor: string = "#bfbfbf55";

export const GigSidebar: React.FunctionComponent<GigSidebarProps> = ({
  setRoute,
  route,
}) => {
  return (
    <div>
      <div style={{ height: 40 }} />
      <List sx={{ display: "flex", flexDirection: "column" }}>
        <ListItemButton
          sx={{
            backgroundColor: route === "notifications" ? activeColor : "",
            borderRadius: 10,
          }}
          onClick={() => setRoute("notifications")}
        >
          <Notifications sx={{ padding: 0.5, margin: 1 }} />
          <Typography variant="body1">Alerts</Typography>
        </ListItemButton>
        <ListItemButton
          sx={{
            backgroundColor: route === "gigs" ? activeColor : "",
            borderRadius: 10,
          }}
          onClick={() => setRoute("gigs")}
        >
          <DeviceHub sx={{ padding: 0.5, margin: 1 }} />
          <Typography variant="body1">Gigs</Typography>
        </ListItemButton>
        <ListItemButton
          sx={{
            backgroundColor: route === "offers" ? activeColor : "",
            borderRadius: 10,
          }}
          onClick={() => setRoute("offers")}
        >
          <Event sx={{ padding: 0.5, margin: 1 }} />
          <Typography variant="body1">Offers</Typography>
        </ListItemButton>
      </List>
    </div>
  );
};

interface BottomNavProps extends GigIndexState {
  route: RouteOption;
  setRoute: any;
  windowDimensions?: {height: number, width: number};
  setMainState: (key: string, value: any) => void;
}

export const BottomNav: React.FunctionComponent<BottomNavProps> = ({
  route,
  setRoute,
  windowDimensions,
  setMainState,
}) => {

  const {width} = windowDimensions!
  return (
    <>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          color: "white",
        }}
        elevation={0}
      >
        <Divider sx={{mb: 1}} />
        <BottomNavigation
          showLabels={width>=600}
          sx={{
      
            backgroundColor: dark.palette.background.default,
            color: "white",
            pb:1
          }}
        >
          <BottomNavigationAction
            sx={{ color: "#ffffff", position:'relative', left:4, bottom:1 }}
            label="Add Gig"
            icon={<Add />}
            onClick={() => setRoute("addGig")}
          />
          <BottomNavigationAction
            sx={{
              backgroundColor: route === "offers" ? activeColor : "",
              color: "#ffffff",
            }}
            label="Offers"
            icon={<Event />}
            onClick={() => setRoute("offers")}
          />
          <BottomNavigationAction
            sx={{
              backgroundColor: route === "gigs" ? activeColor : "",
              color: "#ffffff",
            }}
            label="Gigs"
            icon={<DeviceHub />}
            onClick={() => setRoute("gigs")}
          />
          <BottomNavigationAction
            sx={{
              backgroundColor: route === "notifications" ? activeColor : "",
              color: "#ffffff",
            }}
            label="Alerts"
            icon={<Notifications />}
            onClick={() => setRoute("notifications")}
          />
          <BottomNavigationAction
            sx={{
              backgroundColor: route === "addGig" ? activeColor : "",
              color: "#ffffff",
              // display: { xs: "none", sm: "flex" },
            }}
            label="Add Story"
            icon={<AddPhotoAlternate />}
            onClick={() => {
              setMainState("profileModalOpen", true);
              setRoute("addStory");
            }}
          />
        </BottomNavigation>
      </Paper>
    </>
  );
};
