import React from "react";

import { GigIndexState } from "../GigsIndex";
import {
  List,
  ListItemButton,
  Typography,
  Paper,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import { Event, DeviceHub, Notifications } from "@mui/icons-material";




// *** *** SIDEBAR *** ***
interface GigSidebarProps extends GigIndexState {
  setRoute: any;
  route: string;
}
const activeColor: string = "#bfbfbf55"


export const GigSidebar: React.FunctionComponent<GigSidebarProps> = ({
  setRoute,
  route,
}) => {

  return (
    <div>
      <div style={{ height: 40 }} />
      <List sx={{ display: "flex", flexDirection: "column" }}>
        <ListItemButton
          sx={{ backgroundColor: route === "notifications" ? activeColor : "", borderRadius: 10 }}
          onClick={() => setRoute("notifications")}
        >
          <Notifications sx={{ padding: 0.5, margin: 1 }} />
          <Typography variant="body1">Alerts</Typography>
        </ListItemButton>
        <ListItemButton
          sx={{ backgroundColor: route === "gigs" ? activeColor : "", borderRadius: 10 }}
          onClick={() => setRoute("gigs")}
        >
          <DeviceHub sx={{ padding: 0.5, margin: 1 }} />
          <Typography variant="body1">Gigs</Typography>
        </ListItemButton>
        <ListItemButton
          sx={{ backgroundColor: route === "offers" ? activeColor : "", borderRadius: 10 }}
          onClick={() => setRoute("offers")}
        >
          <Event sx={{ padding: 0.5, margin: 1 }} />
          <Typography variant="body1">Offers</Typography>
        </ListItemButton>
      </List>
    </div>
  );
};



/// *** *** BOTTOM NAV *** *** ///
interface BottomNavProps extends GigIndexState {
  setRoute: any;
  route: string;
}

export const BottomNav: React.FunctionComponent<BottomNavProps> = ({
  setRoute,
  route,
}) => {
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        // value={value}
        // onChange={(event, newValue) => {
        //   setValue(newValue);
        // }}
      >
        <BottomNavigationAction
          sx={{ backgroundColor: route === "offers" ? activeColor : "" }}
          label="Offers"
          icon={<Event />}
          onClick={() => setRoute("offers")}
        />
        <BottomNavigationAction
          sx={{ backgroundColor: route === "gigs" ? activeColor : "" }}
          label="Gigs"
          icon={<DeviceHub />}
          onClick={() => setRoute("gigs")}
        />
        <BottomNavigationAction
          sx={{ backgroundColor: route === "notifications" ? activeColor : "" }}
          label="Alerts"
          icon={<Notifications />}
          onClick={() => setRoute("notifications")}
        />
      </BottomNavigation>
    </Paper>
  );
};
