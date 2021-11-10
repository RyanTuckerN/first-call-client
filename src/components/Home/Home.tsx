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
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Avatar, Grid, ListItemIcon } from "@mui/material";
import {
  Settings,
  Person,
  Home as HomeIcon,
  Logout,
  Add,
  Dashboard,
  DynamicFeed,
} from "@mui/icons-material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { UserCtx } from "../Context/MainContext";
import { Notification, User } from "../../types/API.types";
import { fetchHandler } from "../_helpers/fetchHandler";
import API_URL from "../_helpers/environment";
import { WindowDimensions } from "./Home.types";
import { Paper } from "@mui/material";
import { AppState } from "../../App";
import Story from "./Stories/Story";
import StoryFeed from "./Stories/StoryFeed";
import Logo from "../assets/Logo";
import StoryLoader from "./Stories/StoryLoader";
import { dark, light } from "../Theme/Theme";
import SearchBar from "./components/SearchBar";

interface HomeProps extends RouteComponentProps {
  logout: VoidFunction;
  setAppState: (key: string, value: any) => void;
  setToken: (token: string) => void;
  token: string;
  auth: boolean | null;
  user: User | null;
  darkModeOn: string;
}

interface HomeState {
  anchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  isNotificationsOpen: boolean;
  open: boolean;
  windowDimensions: WindowDimensions;
  notifications: Notification[];
  darkModeOn: boolean;
}

class Home extends Component<HomeProps, HomeState> {
  static contextType = UserCtx;
  menuId: string = "primary-account-menu";
  appBarHeight: number = 75;

  constructor(props: HomeProps, context: AppState) {
    super(props, context);
    this.state = {
      anchorEl: null,
      isMenuOpen: false,
      isNotificationsOpen: false,
      open: true,
      windowDimensions: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
      notifications: [],
      darkModeOn: this.props.darkModeOn === "true",
    };
  }

  setHomeState = (key: string, value: any): void => {
    const stateObj: any = {};
    stateObj[key] = value;
    this.setState(stateObj);
  };

  fetchNotifications = async (): Promise<void> => {
    const json = await fetchHandler({
      url: `${API_URL}/user/notifications`,
      auth: localStorage.getItem("token") ?? this.context.token ?? "",
    });
    json.auth &&
      this.setState({
        notifications: json.notifications,
      });
  };

  handleResize = (): void =>
    this.setState({
      windowDimensions: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
    });

  componentDidMount() {
    this.authorize();
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps: HomeProps, prevState: HomeState) {
    prevProps.darkModeOn !== this.props.darkModeOn &&
      this.setState({
        darkModeOn: this.props.darkModeOn === "true",
      });
  }

  //protect unauthorized views
  authorize = (): void => {
    const { auth } = this.context;
    const pathRoot = this.props.location.pathname.split("/")[1];
    //these paths are allowed
    if (pathRoot === "auth" || pathRoot === "respond") {
      return;
    }
    //otherwise redirect to welcome screen
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
  };

  handleLogout = () => {
    this.props.logout();
    this.handleMenuClose();
    this.props.history.push("/");
  };

  //for the backdrop:
  handleClose = () => this.setState({ open: false });

  render() {
    const logoColor = light.palette.primary.main;
    const { auth } = this.context;
    const routePaperSX = {
      padding: 2,
      marginBottom: 2,
      minHeight: this.state.windowDimensions.height - this.appBarHeight - 50,
      zIndex: 1,
    };
    console.log(dark);

    return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar
            position="fixed"
            sx={{
              backgroundColor: "#000000",
              minHeight: 50,
              height: 50,
              maxHeight: 50,
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            style={{ height: this.appBarHeight }}
            >
            <Toolbar
              variant="dense"
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <Box
                component="div"
                sx={{
                  flexGrow: 1,
                  zIndex: 9999,
                  position: "relative",
                  top: -9,
                  display: "flex",
                }}
              >
                <Link to="/welcome">
                  <Logo
                    height={23}
                    mainfill={light.palette.background.paper}
                    secfill={logoColor}
                  />
                </Link>
              </Box>
              <div style={{ width: 10 }} />
              {auth && (
                <Box
                  component="div"
                  id="search-bar-wrapper"
                  sx={{width: 375, pl: 2}}
                >
                  <SearchBar />
                </Box>
              )}
              {auth ? (
                <>
                  <Box
                    sx={{
                      display: { xs: "flex" },
                      position: "relative",
                      top: -4,
                    }}
                  >
                    <Link to="/main/add" title="Create a Gig">
                      <IconButton
                        size="small"
                        color="inherit"
                        id="add-new-gig"
                        aria-label="create a new gig"
                        style={{ position: "relative", top: 3 }}
                      >
                        <Add />
                      </IconButton>
                    </Link>
                    <Link
                      to={`${this.props.match.path}main/`}
                      title="Gig Dashboard"
                    >
                      <IconButton
                        size="medium"
                        id="dashboard-button"
                        color="inherit"
                      >
                        <Dashboard />
                      </IconButton>
                    </Link>
                    <Link
                      to={`${this.props.match.path}feed/`}
                      title="Gig Story Feed"
                    >
                      <IconButton
                        size="medium"
                        id="feed-button"
                        color="inherit"
                      >
                        <DynamicFeed />
                      </IconButton>
                    </Link>
                    <IconButton
                      size="medium"
                      id="account-menu-button"
                      aria-label="account of current user"
                      aria-controls={this.menuId}
                      aria-haspopup="true"
                      onClick={this.handleProfileMenuOpen}
                      color="inherit"
                      title="Account"
                    >
                      {this.context.user.photo ? (
                        <Avatar
                          src={this.context.user.photo}
                          sx={{
                            height: 26,
                            width: 26,
                            border: "solid white 1px",
                          }}
                        />
                      ) : (
                        <AccountCircle />
                      )}
                    </IconButton>
                  </Box>

                  <Menu
                    anchorEl={this.state.anchorEl}
                    id={this.menuId}
                    keepMounted
                    open={this.state.isMenuOpen}
                    onClose={this.handleMenuClose}
                  >
                    {/* <Link to={`${this.props.match.path}main/`}>
                      <MenuItem onClick={this.handleMenuClose}>
                        <ListItemIcon>
                          <HomeIcon />
                        </ListItemIcon>
                        Home
                      </MenuItem>
                    </Link> */}
                    <Link
                      to={`${this.props.match.path}main/profile/${
                        this.props.user?.id ?? this.context.user.id
                      }`}
                    >
                      <MenuItem onClick={this.handleMenuClose}>
                        <ListItemIcon>
                          <Person />
                        </ListItemIcon>
                        Profile
                      </MenuItem>
                    </Link>
                    <Link to={`${this.props.match.path}main/settings`}>
                      <MenuItem onClick={this.handleMenuClose}>
                        <ListItemIcon>
                          <Settings />
                        </ListItemIcon>
                        Settings
                      </MenuItem>
                    </Link>
                    <MenuItem onClick={this.handleLogout}>
                      <ListItemIcon>
                        <Logout />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
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
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
              )}
            </Toolbar>
          </AppBar>
          <div style={{ minHeight: 50 }} />
        </Box>
        <div style={{ marginTop: 10 }} />
        <>
          <CssBaseline />

          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                return auth ? (
                  <Redirect to="main/" />
                ) : (
                  <Redirect to="welcome" />
                );
              }}
            />
            <Route path="/respond">
              <Container maxWidth="lg" sx={{ height: "100%" }}>
                <Paper sx={routePaperSX}>
                  <Respond />
                </Paper>
              </Container>
            </Route>
            <Route path="/main">
              {this.props.user ? (
                // <Paper sx={routePaperSX}>
                <MainView
                  {...this.props}
                  {...this.state}
                  fetchNotifications={this.fetchNotifications}
                  notifications={this.state.notifications}
                  setHomeState={this.setHomeState}
                  user={this.props.user}
                />
              ) : // </Paper>
              null}
            </Route>

            <Route path="/auth">
              <Container maxWidth="lg" sx={{ height: "calc(100% - 130px)" }}>
                <Auth {...this.props} />
              </Container>
            </Route>
          </Switch>
          <Route path="/welcome">
              <Container maxWidth="xl" sx={{ height: "100%" }}>
            <Welcome />
            </Container>
          </Route>
          <Route path="/story/:storyId">
            <StoryLoader />
          </Route>
          <Route path="/feed">
            <Container maxWidth={"lg"} sx={{ height: "calc(100vh - 130px)" }}>
              <Paper
                elevation={1}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <StoryFeed />
              </Paper>
            </Container>
          </Route>
        </>
      </>
    );
  }
}

export default withRouter(Home);
