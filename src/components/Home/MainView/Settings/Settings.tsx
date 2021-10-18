// import * as React from "react";
import { Component } from "react";
// import ChangePass from "./ChangePass";
import { Link, Route, RouteComponentProps, withRouter } from "react-router-dom";
import {
  Typography,
  Switch,
  IconButton,
  List,
  ListItem,
  Divider,
  ListItemButton,
  Grid,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { UserCtx } from "../../../Context/MainContext";
import Header from "./Header";
import Swal from "sweetalert2";
import "./Settings.css";
import EditProfile from '../Profile/EditProfile'

interface SettingsProps extends RouteComponentProps {}

interface SettingsState {}

class Settings extends Component<SettingsProps, SettingsState> {
  static contextType = UserCtx;
  static header: string = 'body1'

  constructor(props: SettingsProps) {
    super(props);
    // this.state = { :  };
  }

  handleInfo = (): Promise<any> =>
    Swal.fire({
      icon: "question",
      text: "FirstCall will never send promotional materials, but email is a great way to stay informed about any changes to your gigs. Opt out anytime!",
    });
  // handleEmail = ():void =>

  componentDidMount() {
    console.log(this.context);
  }
  render() {
    return (
      <>
        <Header user={this.context.user} {...this.props} />


        <Grid container spacing={2} flexWrap='wrap-reverse'>
        
          <Grid item xs={12} sm={5} md={3}>
            <Typography variant='h5' sx={{paddingLeft:2, marginTop:5}}>
              Account Settings
            </Typography>
            <List>
              <ListItemButton>
                <Typography variant='body1'>Account</Typography>
              </ListItemButton>
              {/* <Divider /> */}
              {/* Hello from Settings.tsx! */}
              <ListItem>
                <div className="toggle">
                  <Typography variant='body1'>Dark Mode</Typography>
                  <div>
                    <Switch
                      onChange={this.context.toggleDark}
                      checked={this.context.darkModeOn === "true" ? true : false}
                    />
                    <Typography display="inline" variant='body2'>
                      {this.context.darkModeOn === "true" ? "On" : "Off"}
                    </Typography>
                  </div>
                </div>
              </ListItem>
              {/* <Divider /> */}
              <ListItem>
                <div className="toggle">
                  <div>
                    <Typography display="inline" variant='body1'>
                      Receive Emails?
                    </Typography>
                    <IconButton
                      sx={{ position: "relative", bottom: 6 }}
                      onClick={this.handleInfo}
                    >
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </div>
                  {/* <Typography variant='body1'>First call will send emails by default to keep you in the loop about any changes in the status of your gigs, but you can opt out if you wish!</Typography> */}
                  <div>
                    <Switch
                      onChange={this.context.toggleEmail}
                      checked={this.context.user.emails}
                    />
                    <Typography display="inline" variant='body2'>
                      {this.context.user.emails ? "On" : "Off"}
                    </Typography>
                  </div>
                </div>
              </ListItem>
              {/* <Divider /> */}
              {/* <ChangePass /> */}
            </List>
          </Grid>
          <Grid item xs={12} sm={7} md={9}>
            <EditProfile />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withRouter(Settings);
