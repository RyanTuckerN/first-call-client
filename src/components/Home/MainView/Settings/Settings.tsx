// import * as React from "react";
import { Component } from "react";
import ChangePass from "./ChangePass";
import {
  NavLink,
  Route,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
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
import { User } from "../../../../types/API.types";
import API_URL from "../../../_helpers/environment";
import { fetchHandler } from "../../../_helpers/fetchHandler";
import Header from "./Header";
import Swal from "sweetalert2";
import "./Settings.css";
import EditProfile from "../Profile/EditProfile";
import { AppState } from "../../../../App";

interface SettingsProps extends RouteComponentProps {
  setAppState: any;
  user: User;
  token: string;
}

interface SettingsState {}

class Settings extends Component<SettingsProps, SettingsState> {
  static contextType = UserCtx;
  static header: string = "body1";

  constructor(props: SettingsProps, context: AppState) {
    super(props, context);
    this.state = { photo: this.context.user?.photo ?? "" };
  }

  toggleEmail = async (): Promise<void> => {
    const emails = !this.props.user.emails;
    const json = await fetchHandler({
      url: `${API_URL}/user/profile`,
      method: "PUT",
      auth: localStorage.getItem("token") ?? this.context.token ?? "",
      body: { emails },
    });
    this.props.setAppState("user", json.user);
  };

  updateProfile = async (user: any): Promise<boolean> => {
    const json = await fetchHandler({
      url: `${API_URL}/user/profile`,
      method: "PUT",
      auth: localStorage.getItem("token") ?? this.context.token ?? "",
      body: user,
    });
    // console.log(json)
    json.user && this.props.setAppState("user", json.user);
    return json.success ? true : false;
  };

  uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<boolean> => {
    try {
      const files = e.target.files;
      if (!files) throw new Error("something went wrong!");
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "lvcrltpx");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpd08wa9g/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const File = await res.json();
      console.log(File);
      // await this.setState({photo: File.secure_url});
      await this.updateProfile({ photo: File.secure_url });
      return true;
    } catch (err) {
      console.error(err);
      alert("There was an error! Please try again");
      return false;
    }
  };

  handleInfo = (): Promise<any> =>
    Swal.fire({
      icon: "question",
      text: "FirstCall will never send promotional materials, but email is a great way to stay informed about any changes to your gigs. Opt out anytime!",
      customClass: {
        container:
          this.context.darkModeOn === "true" ? "dark-mode-swal" : "",
      },
    });
  // handleEmail = ():void =>

  componentDidMount() {
    // console.log(this.context);
  }
  render() {
    return (
      <Grid container>
        <Grid item xs={6} sm={5}>
          <Header handlePhoto={this.uploadImage} {...this.props} />
        </Grid>

        <Grid container item xs={12} spacing={2} flexWrap="wrap-reverse">
          <Grid item xs={12} sm={5} md={3}>
            <Grid>
              <Typography variant="h5" sx={{ paddingLeft: 2, marginTop: 5 }}>
                Settings
              </Typography>
              <NavLink to={`${this.props.match.path}`}>
                <ListItemButton>
                  <Typography variant="body1">Account</Typography>
                </ListItemButton>
              </NavLink>
              <NavLink to={`${this.props.match.path}/change-password`}>
                <ListItemButton>
                  <Typography variant="body1">Security</Typography>
                </ListItemButton>
              </NavLink>
            </Grid>
            <div id="spacer" />
            {/* <Divider /> */}
            <List>
              <Grid>
                <ListItem>
                  <Typography variant="h5">Preferences</Typography>
                </ListItem>
                {/* Hello from Settings.tsx! */}
                <ListItem>
                  <div className="toggle">
                    <Typography variant="body1">Dark Mode</Typography>
                    <div>
                      <Switch
                        onChange={this.context.toggleDark}
                        checked={
                          this.context.darkModeOn === "true" ? true : false
                        }
                      />
                      <Typography display="inline" variant="body2">
                        {this.context.darkModeOn === "true" ? "On" : "Off"}
                      </Typography>
                    </div>
                  </div>
                </ListItem>
                {/* <Divider /> */}
                <ListItem>
                  <div className="toggle">
                    <div>
                      <Typography display="inline" variant="body1">
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
                        onChange={this.toggleEmail}
                        checked={this.props.user.emails ?? true}
                      />
                      <Typography display="inline" variant="body2">
                        {this.props.user.emails ? "On" : "Off"}
                      </Typography>
                    </div>
                  </div>
                </ListItem>
              </Grid>
              {/* <Divider /> */}
              {/* <ChangePass /> */}
            </List>
          </Grid>
          <Grid item xs={12} sm={7} md={9}>
              <Route exact path={`${this.props.match.path}/`}>
                <EditProfile
                  {...this.props}
                  updateProfile={this.updateProfile}
                />
              </Route>
              <Route exact path={`${this.props.match.path}/change-password`}>
                <ChangePass />
              </Route>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(Settings);
