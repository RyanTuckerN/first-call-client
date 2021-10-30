// import * as React from 'react';
import { Component } from "react";
// import EditProfile from './EditProfile';
import {
  Avatar,
  Grid,
  Typography,
  Paper,
  IconButton,
  Popover,
} from "@mui/material";
import { User } from "../../../../types/API.types";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { fetchHandler } from "../../../_helpers/fetchHandler";
import API_URL from "../../../_helpers/environment";
import { stringAvatar } from "../Settings/Header";
import { UserCtx } from "../../../Context/MainContext";
import { AppState } from "../../../../App";
import {
  PersonAdd,
  Edit,
  Add,
  MailOutline,
  AttachMoney,
  Settings
} from "@mui/icons-material";

interface RouteParams {
  userId: string;
}

interface ProfileProps extends RouteComponentProps<RouteParams> {}

interface ProfileState {
  user: User | null;
  anchorEl: HTMLButtonElement | null;
}

class Profile extends Component<ProfileProps, ProfileState> {
  static contextType = UserCtx!;

  constructor(props: ProfileProps, context: AppState) {
    super(props, context);
    this.state = { user: null, anchorEl: null };
  }

  fetchUser = async (): Promise<boolean> => {
    try {
      const json = await fetchHandler({
        url: `${API_URL}/user/profile/${this.props.match.params.userId}`,
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      json.success && this.setState({ user: json.user });
      return json.success;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (): void => this.setState({ anchorEl: null });

  componentDidMount() {
    this.fetchUser();
  }

  render() {
    const { user } = this.state;
    // const {token} = this.context
    const avatarSize = 175;
    const open = Boolean(this.state.anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <>
        {user && (
          <Grid container>
            <Grid item xs={12} sx={{ height: 100 }}>
              <img
                src="https://picsum.photos/800"
                alt="random placeholder"
                style={{ width: "100%", objectFit: "cover", height: 180 }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="flex-end"
            >
              {user.photo ? (
                <Avatar
                  src={user.photo}
                  sx={{
                    height: avatarSize,
                    width: avatarSize,
                    border: 3,
                    borderColor: "white",
                  }}
                  alt={user.name}
                />
              ) : (
                <Avatar {...stringAvatar(user.name, avatarSize)} />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="flex-end"
            >
              {this.context.user.id === user.id ? (
                <Link to="/main/add">
                  <Add sx={{ position: "relative", right: 45, bottom: 20 }} />
                </Link>
              ) : (
                <Link to="#">
                  <MailOutline
                    sx={{ position: "relative", right: 36, bottom: 20 }}
                  />
                </Link>
              )}
              {this.context.user.id === user.id ? (
                <Link to="/main/settings">
                  <Edit sx={{ position: "relative", left: 45, bottom: 20 }} />
                </Link>
              ) : (
                <>
                  <IconButton
                    sx={{ position: "relative", left: 45, bottom: 20 }}
                  >
                    <PersonAdd />
                  </IconButton>
                </>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {(!user.role ||
                !user.location ||
                !user.paymentPreference ||
                !user.photo) &&
              this.context.user.id === user.id ? (
                <Link to="/main/settings">
                  <Typography variant="caption">
                    {/* <Settings sx={{fontSize: 'small'}} />&nbsp; */}
                    <i>Finish setting up your profile?</i>
                  </Typography>
                </Link>
              ) : null}
              <Typography variant="h4">
                {user.name}
                {user.paymentPreference ? (
                  <>
                    <IconButton
                      // sx={{ position: "relative", left: 53, bottom: 20 }}
                      aria-describedby={id}
                      // variant="contained"
                      onClick={this.handleClick}
                    >
                      <AttachMoney fontSize='small' color='success' />
                    </IconButton>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={this.state.anchorEl}
                      onClose={this.handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                    >
                      {Object.keys(user.paymentPreference).map((p, i) => {
                        const platform = p;
                        const handle = user.paymentPreference![p];
                        return (
                          <Paper sx={{ p: 2 }} key={i}>
                            <Typography variant="body1">
                              {platform}: &nbsp; {handle}
                            </Typography>
                          </Paper>
                        );
                      })}
                    </Popover>
                  </>
                ) : null}
              </Typography>
              <Typography sx={{ p: 0 }} variant="body1">
                {user.role ? user.role : null}&nbsp;&nbsp;
                {user.location && user.role ? <>&#183;</> : null}&nbsp;&nbsp;
                {user.location ? user.location : null}
              </Typography>
              <Grid sx={{ maxWidth: 200 }} textAlign="justify">
                <Typography variant="caption">
                  {user.description ? user.description : null}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        )}
      </>
    );
  }
}

export default withRouter(Profile);
