// import * as React from "react";
import { Component } from "react";
import {
  Link,
  Switch,
  Route,
  withRouter,
  RouteComponentProps,
  Redirect,
} from "react-router-dom";
import "./Home.css";
import Auth from "./Auth/Auth";
import MainView from "./MainView/MainView";
import Respond from "./Respond/Respond";
import Welcome from "./Welcome/Welcome";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { UserCtx } from "../Context/MainContext";
import Notifications from "./components/Notifications";
import { Notification } from "../../types/API.types";
import { AppState } from "../../App";
import { fetchHandler } from "../_helpers/fetchHandler";
import API_URL from "../_helpers/environment";

interface HomeProps extends RouteComponentProps {
  logout: VoidFunction;
}

interface HomeState {
  anchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  isNotificationsOpen: boolean;
  open: boolean;
  messages: Notification[];
  notifications: Notification[];
}

class Home extends Component<HomeProps, HomeState> {
  static contextType = UserCtx;
  menuId = "primary-account-menu";

  constructor(props: HomeProps) {
    super(props);
    this.state = {
      anchorEl: null,
      isMenuOpen: false,
      isNotificationsOpen: false,
      open: true,
      messages: [],
      notifications: [],
    };
  }

  fetchNotficiations = async () =>{
    const json = await fetchHandler({
      url: `${API_URL}/user/notifications`,
      auth: localStorage.getItem('token') ?? '',
    })
    json.auth && this.setState({
      messages:
        json.notifications?.filter(
          (n: Notification) => n.details.code === 100 || n.details.code >= 300
        ) ?? [],
      notifications:
        json.notifications?.filter(
          (n: Notification) => n.details.code > 100 && n.details.code < 300
        ) ?? [],
    })
  }

  fetchOffers = async() => {
    const json = await fetchHandler({
      url: `${API_URL}/user/offers`,
      auth: localStorage.getItem('token') ?? ''
    })
    console.log(json)
  }

  componentDidMount() {
    this.authorize();
    this.fetchNotficiations()
    this.fetchOffers()
  }

  componentDidUpdate(prevProps: HomeProps, prevState: HomeState) {}

  //protect unauthorized views
  authorize = (): void => {
    const { auth } = this.context;

    const pathRoot = this.props.location.pathname.split("/")[1];
    if (pathRoot === "auth" || pathRoot === "respond") {
      return;
    }
    !auth && this.props.history.push("/welcome");
  };
  handleNotificationsOpen = (event: any) =>
    this.setState({ anchorEl: event.currentTarget, isNotificationsOpen: true });

  handleProfileMenuOpen = (event: any) =>
    this.setState({ anchorEl: event.currentTarget, isMenuOpen: true });

  handleMenuClose = () => {
    this.setState({
      anchorEl: null,
      isMenuOpen: false,
      isNotificationsOpen: false,
    });
    console.log(this.state.anchorEl?.id);
  };

  handleLogout = () => {
    this.props.logout();
    this.handleMenuClose();
    this.props.history.push("/");
  };

  //for the backdrop:
  handleClose = () => this.setState({ open: false });

  render() {
    const { auth } = this.context;

    return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/welcome">FirstCall</Link>
              </Typography>
              {auth ? (
                <>
                  <Box sx={{ display: { xs: "flex" } }}>
                    <IconButton
                      size="large"
                      id="mail-menu-button"
                      aria-label={`show ${this.state.messages.length} new mails`}
                      color="inherit"
                      onClick={this.handleNotificationsOpen}
                    >
                      <Badge
                        badgeContent={this.state.messages.length}
                        color="error"
                      >
                        <MailIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      size="large"
                      id="notification-menu-button"
                      aria-label={`show ${this.state.notifications.length} new notifications`}
                      color="inherit"
                      onClick={this.handleNotificationsOpen}
                    >
                      <Badge
                        badgeContent={this.state.notifications.length}
                        color="error"
                      >
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      size="large"
                      edge="end"
                      id="account-menu-button"
                      aria-label="account of current user"
                      aria-controls={this.menuId}
                      aria-haspopup="true"
                      onClick={this.handleProfileMenuOpen}
                      color="inherit"
                    >
                      <AccountCircle />
                    </IconButton>
                  </Box>
                  <Menu
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    id={this.menuId}
                    keepMounted
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    open={this.state.isMenuOpen}
                    onClose={this.handleMenuClose}
                  >
                    <Link to={`${this.props.match.path}main/`}>
                      <MenuItem onClick={this.handleMenuClose}>Home</MenuItem>
                    </Link>
                    <Link to={`${this.props.match.path}main/profile`}>
                      <MenuItem onClick={this.handleMenuClose}>
                        Profile
                      </MenuItem>
                    </Link>
                    <Link to={`${this.props.match.path}main/settings`}>
                      <MenuItem onClick={this.handleMenuClose}>
                        Settings
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                  </Menu>
                  <Menu
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    id="notifications-menu"
                    PaperProps={{ style: { maxHeight: 500 } }}
                    keepMounted
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    open={this.state.isNotificationsOpen}
                    onClose={this.handleMenuClose}
                  >
                    <Notifications
                      notifications={
                        this.state.anchorEl?.id === "notification-menu-button"
                          ? this.state.notifications
                          : this.state.anchorEl?.id === "mail-menu-button"
                          ? this.state.messages
                          : []
                      }
                    />
                  </Menu>
                </>
              ) : auth === false ? (
                <>
                  <Link to={`${this.props.match.path}auth/login/`}>
                    <Button color="inherit">Login</Button>
                  </Link>
                  <Link to={`${this.props.match.path}auth/signup/`}>
                    <Button color="inherit">Signup</Button>
                  </Link>
                </>
              ) : (
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={this.state.open}
                  // onClick={this.handleClose}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
            </Toolbar>
          </AppBar>
        </Box>
        <div style={{ marginTop: 10 }} />
        <>
          <CssBaseline />

          <Container maxWidth="md">
            {/* box is just to show layout, should be removed */}
            {/* <Box sx={{ bgcolor: "#e6e8eb", minHeight: 50 }} />  */}
            <Switch>
              <Route
                exact
                path="/"
                render={() => {
                  return auth ? (
                    <Redirect to="main" />
                  ) : (
                    <Redirect to="welcome" />
                  );
                }}
              />
              <Route path="/respond">
                <Respond />
              </Route>
              <Route path="/main">
                <MainView />
              </Route>

              <Route path="/welcome">
                <Welcome />
              </Route>

              <Route path="/auth">
                <Auth />
              </Route>
            </Switch>
          </Container>
        </>
      </>
    );
  }
}

export default withRouter(Home);
