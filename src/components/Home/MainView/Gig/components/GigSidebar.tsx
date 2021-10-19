import React from "react";

import { GigIndexState } from "../GigsIndex";
import { List, ListItemButton, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

interface GigSidebarProps extends GigIndexState {}

const GigSidebar: React.FunctionComponent<GigSidebarProps> = (props) => {
  return (
    <div>
      <div style={{height: 40}}/>
      <List sx={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
        <NavLink to={`#`}>
          <ListItemButton>
            <Typography variant='body1'>Offers</Typography>
          </ListItemButton>
        </NavLink>
        <NavLink to={`#`}>
          <ListItemButton>
            <Typography variant='body1'>Gigs</Typography>
          </ListItemButton>
        </NavLink>
        <NavLink to={`#`}>
          <ListItemButton>
            <Typography variant='body1'>Profile</Typography>
          </ListItemButton>
        </NavLink>
      </List>
    </div>
  );
};

export default GigSidebar;
