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
import NotificationsIcon from "@mui/icons-material/Notifications";

interface HomeProps extends RouteComponentProps {}

interface HomeState {
  anchorEl: HTMLElement | null;
  userAuth: boolean;
  isMenuOpen: boolean;
}

class Home extends Component<HomeProps, HomeState> {
  menuId = "primary-account-menu";

  constructor(props: HomeProps) {
    super(props);
    this.state = {
      anchorEl: null,
      userAuth: false,
      // userAuth: true,
      isMenuOpen: false,
    };
  }

  componentDidMount() {
    console.log(this.props);
  }
  handleProfileMenuOpen = (event: any) =>
    this.setState({ anchorEl: event.currentTarget, isMenuOpen: true });

  handleMenuClose = () => this.setState({ anchorEl: null, isMenuOpen: false });

  render() {
    return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" color='secondary'>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/">FirstCall</Link>
              </Typography>
              {this.state.userAuth ? (
                <>
                  <Box sx={{ display: { xs: "flex" } }}>
                    <IconButton
                      size="large"
                      aria-label="show 4 new mails"
                      color="inherit"
                    >
                      <Badge badgeContent={4} color="error">
                        <MailIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      size="large"
                      aria-label="show 17 new notifications"
                      color="inherit"
                    >
                      <Badge badgeContent={17} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    <IconButton
                      size="large"
                      edge="end"
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
                    <MenuItem onClick={this.handleMenuClose}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Link to={`${this.props.match.path}auth/login/`}>
                    <Button color="inherit">Login</Button>
                  </Link>
                  <Link to={`${this.props.match.path}auth/signup/`}>
                    <Button color="inherit">Signup</Button>
                  </Link>
                </>
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
                  return this.state.userAuth ? (
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
