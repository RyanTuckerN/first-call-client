import * as React from "react";
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
} from "@mui/material";
import { properize, returnTime } from "../../../../../_helpers/helpers";
import {
  Settings,
  AttachMoney,
  LocationOn,
  CalendarToday,
  ChevronRight,
} from "@mui/icons-material";
import { DetailedGig } from "../../Gig.types";
import { stringAvatar } from "../../../Settings/Header";
import { Gig } from "../../../../../../types/API.types";

interface GigMembersProps extends GigPageState {}

interface GigMembersState extends Gig {}

class GigMembers extends React.Component<GigMembersProps, GigMembersState> {
  constructor(props: GigMembersProps) {
    super(props);
    // this.state = { :  };
  }
  render() {
    const roles = Object.keys(this.props.callStack?.stackTable ?? {});

    console.log(roles);

    return (
      // <Grid item xs={12} sm={6} md={5}>
      <>
        {/* <Paper elevation={4} sx={{ padding: 2 }}> */}
          <Typography variant="h6">Band</Typography>
          <List>
            {roles.map((r) => (
              <ListItemText sx={{ marginLeft: 1 }}>
                <strong>{properize(r)}: </strong>Not yet filled
              </ListItemText>
            ))}
          </List>
        {/* </Paper> */}
      {/* </Grid> */}
          </>
    );
  }
}

export default GigMembers;
