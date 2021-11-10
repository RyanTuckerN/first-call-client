import * as React from "react";
import { Component } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { fetchHandler } from "../../../_helpers/fetchHandler";
import API_URL from "../../../_helpers/environment";
import { UserCtx } from "../../../Context/MainContext";
import { formControl } from "../../../_helpers/helpers";
import { AppState } from "../../../../App";

interface ChangePassProps extends RouteComponentProps {}

interface ChangePassState {
  currentPass: string;
  new1: string;
  new2: string;
  snackBarOpen: boolean;
  success: boolean | null;
  passwordsMatch: boolean | null;
}

class ChangePass extends Component<ChangePassProps, ChangePassState> {
  static contextType = UserCtx;
  timeout: any = null;

  constructor(props: ChangePassProps, context: AppState) {
    super(props, context);
    this.state = {
      currentPass: "",
      new1: "",
      new2: "",
      snackBarOpen: false,
      success: null,
      passwordsMatch: null,
    };
  }

  handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const stateObj: any = {};
    stateObj[e.target.id] = e.target.value;
    this.setState(stateObj);
  };

  handleSubmit = async (): Promise<boolean> => {
    if (!formControl.validatePasswordsMatch(this.state.new1, this.state.new2)) {
      this.setState({ snackBarOpen: true });
      return false;
    }
    try {
      const json = await fetchHandler({
        url: `${API_URL}/user/update-password`,
        method: "post",
        auth: localStorage.getItem("token") ?? this.context.token ?? "",
        body: {
          password: this.state.currentPass,
          newPassword: this.state.new1,
        },
      });
      this.setState({
        success: json.success,
        snackBarOpen: true,
        currentPass: "",
        new1: "",
        new2: "",
      });
      json.success && this.context.handleSnackBar("Success.", "success");
      !json.success &&
        this.context.handleSnackBar("Incorrect Password.", "warning");
      return json.success;
    } catch (err) {
      this.context.handleSnackBar("Something went wrong.", "error");
      return false;
    }
  };

  handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackBarOpen: false, success: null });
  };

  componentDidUpdate(prevProps: ChangePassProps, prevState: ChangePassState) {
    if (this.state.success) {
      this.timeout = setTimeout(() => {
        this.props.history.push("/main/settings");
      }, 2500);
    }
    if (
      prevState.new1 !== this.state.new1 ||
      prevState.new2 !== this.state.new2
    ) {
      this.setState({
        passwordsMatch: formControl.validatePasswordsMatch(
          this.state.new1,
          this.state.new2
        ),
      });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    return (
      <Grid container justifyContent="center">
        <Typography variant="h5">Change Your Password</Typography>
        <Grid item container xs={10} justifyContent="center">
          <Grid item xs={9} sx={{ paddingTop: 3 }}>
            <Typography variant="caption">Enter your password*</Typography>
            <TextField
              id="currentPass"
              required
              aria-required
              fullWidth
              onChange={this.handleInput}
              type="password"
            />
          </Grid>
          <Grid item xs={4} sx={{ paddingTop: 3 }}>
            <Typography variant="caption">New password*</Typography>
            <TextField
              id="new1"
              fullWidth
              required
              aria-required
              onChange={this.handleInput}
              type="password"
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={4} sx={{ paddingTop: 3 }}>
            <Typography
              variant="caption"
              color={this.state.passwordsMatch === false ? "red" : "inherit"}
            >
              {this.state.passwordsMatch === false
                ? "Passwords must match*"
                : "Repeat password*"}
            </Typography>
            <TextField
              id="new2"
              fullWidth
              required
              variant="outlined"
              aria-required
              color={this.state.passwordsMatch === false ? "error" : "primary"}
              onChange={this.handleInput}
              type="password"
            />
          </Grid>
          <Grid
            container
            item
            xs={9}
            justifyContent="flex-end"
            sx={{ paddingTop: 1 }}
          >
            <Grid item xs={12}>
              <Typography variant="caption">Required*</Typography>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="contained"
                color="success"
                onClick={this.handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(ChangePass);
