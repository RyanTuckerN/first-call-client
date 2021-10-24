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
import { Avatar, ListItemIcon } from "@mui/material";
import {
  Settings,
  Person,
  Home as HomeIcon,
  Logout,
  ArrowDropDown,
  Add,
  Dashboard,
} from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
// import HomeIcon from "@mui/icons-material/Home";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { UserCtx } from "../Context/MainContext";
import Notifications from "./components/Notifications";
import { Notification, User } from "../../types/API.types";
// import { AppState } from "../../App";
import { fetchHandler } from "../_helpers/fetchHandler";
// import { MainViewProps } from "./MainView/MainView";
import API_URL from "../_helpers/environment";
import { HomeFunctions, WindowDimensions } from "./Home.types";
import { Paper } from "@mui/material";
import { DetailedGig } from "./MainView/Gig/Gig.types";
import { AppState } from "../../App";

interface HomeProps extends RouteComponentProps {
  logout: VoidFunction;
  setAppState: (key: string, value: any) => void;
  setToken: (token: string)=>void;
  token: string;
  auth: boolean | null;
  user: User | null
}

interface HomeState {
  anchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  isNotificationsOpen: boolean;
  open: boolean;
  windowDimensions: WindowDimensions;
  notifications: Notification[];
  detailsHash: {[key:string|number]: DetailedGig} | null
}

class Home extends Component<HomeProps, HomeState> {
  static contextType = UserCtx;
  menuId: string = "primary-account-menu";
  appBarHeight: number = 75;

  constructor(props: HomeProps, context: AppState) {
    super(props, context);
    this.state = {
      detailsHash: null,
      anchorEl: null,
      isMenuOpen: false,
      isNotificationsOpen: false,
      open: true,
      windowDimensions: {
        height: window.innerHeight,
        width: window.innerWidth,
      },
      notifications: [],
    };
  }

  setHomeState = (key: string, value: any):void =>{
    const stateObj:any={}
    stateObj[key]=value
    this.setState(stateObj)
  }

  fetchNotifications =  async (): Promise<void> => {
      const json = await fetchHandler({
        url: `${API_URL}/user/notifications`,
        auth: localStorage.getItem("token") ?? this.context.token ?? '',
      });
      json.auth &&
        this.setState({
          notifications: json.notifications,
        });
  }

    // fetchOffers: async (): Promise<any> => {
    //   const json = await fetchHandler({
    //     url: `${API_URL}/user/offers`,
    //     auth: localStorage.getItem("token") ?? "",
    //   });
    //   this.setState({})
    // },

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

  componentDidUpdate(prevProps: HomeProps, prevState: HomeState) {}

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
    // console.log(this.state.anchorEl?.id);
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
          <AppBar
            position="static"
            color="secondary"
            style={{ height: this.appBarHeight }}
          >
            <Toolbar>
              <Typography
                variant="h6"
                component="div"
                sx={{ flexGrow: 1, zIndex: 9999 }}
              >
                <Link to="/welcome">FirstCall</Link>
              </Typography>
              {auth ? (
                <>
                  <Box sx={{ display: { xs: "flex" } }}>
                    <Link to={`${this.props.match.path}main/`}>
                      <IconButton
                        size="medium"
                        id="home-button"
                        color="inherit"
                      >
                        <Dashboard />
                      </IconButton>
                    </Link>
                    <IconButton
                      size="medium"
                      edge="end"
                      id="account-menu-button"
                      aria-label="account of current user"
                      aria-controls={this.menuId}
                      aria-haspopup="true"
                      onClick={this.handleProfileMenuOpen}
                      color="inherit"
                    >
                      {this.context.user.photo ? (
                        <Avatar
                          src={this.context.user.photo}
                          sx={{ height: 26, width: 26, border: 'solid white 1px' }}
                        />
                      ) : (
                        <AccountCircle />
                      )}
                    </IconButton>
                    <ArrowDropDown
                      className="arrow-dropdown"
                      fontSize="small"
                    />
                    <Link to='/main/gig/new'>
                      <IconButton
                        size="small"
                        edge="end"
                        color='inherit'
                        id="add-new-gig"
                        aria-label="create a new gig"
                        style={{ marginLeft: -10 }}
                      >
                        <Add />
                      </IconButton>
                      <ArrowDropDown
                        className="arrow-dropdown"
                        fontSize="small"
                      />
                    </Link>
                  </Box>
                  <Menu
                    anchorEl={this.state.anchorEl}
                    id={this.menuId}
                    keepMounted
                    open={this.state.isMenuOpen}
                    onClose={this.handleMenuClose}
                  >
                    <Link to={`${this.props.match.path}main/`}>
                      <MenuItem onClick={this.handleMenuClose}>
                        <ListItemIcon>
                          <HomeIcon />
                        </ListItemIcon>
                        Home
                      </MenuItem>
                    </Link>
                    <Link to={`${this.props.match.path}main/profile`}>
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

          <Container maxWidth="lg">
            {/* box is just to show layout, should be removed */}
            <Paper
              sx={{
                padding: 1,
                marginBottom: 2,
                minHeight:
                  this.state.windowDimensions.height - this.appBarHeight - 30,
                zIndex: 1,
              }}
            >
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
                  {this.props.user ? <MainView
                    {...this.props} {...this.state}
                    fetchNotifications={this.fetchNotifications}
                    notifications={this.state.notifications}
                    setHomeState={this.setHomeState}
                    user={this.props.user}
                  /> : null}
                </Route>

                <Route path="/welcome">
                  <Welcome />
                </Route>

                <Route path="/auth">
                  <Auth {...this.props} />
                </Route>
              </Switch>
            </Paper>
          </Container>
        </>
      </>
    );
  }
}

export default withRouter(Home);
