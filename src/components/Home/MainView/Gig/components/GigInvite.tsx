import { Grid, Button, Typography, Paper, Container } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import { Component } from "react";
import { AppState } from "../../../../../App";
import { Gig, User } from "../../../../../types/API.types";
import { UserCtx } from "../../../../Context/MainContext";
import API_URL from "../../../../_helpers/environment";
import { fetchHandler } from "../../../../_helpers/fetchHandler";
import { DetailedGig } from "../Gig.types";

interface GigInviteProps extends Gig {
  user: User;
  details: DetailedGig;
  setGig: (gig: Gig) => void;
}

interface GigInviteState {
  role: string;
}

class GigInvite extends Component<GigInviteProps, GigInviteState> {
  static contextType = UserCtx;

  constructor(props: GigInviteProps, context: AppState) {
    super(props, context);
    this.state = { role: "" };
  }

  handleRole = () => {
    const roles = Object.keys(this.props.callStack?.stackTable ?? {});
    const role =
      roles.find(
        (r) =>
          this.props.callStack?.stackTable[r].onCall === this.props.user.email
      ) ?? "";
    this.setState({ role });
  };

  handleAccept = async (): Promise<void> => {
    const json = await fetchHandler({
      url: `${API_URL}/gig/${this.props.id}/accept/${this.props.user.id}/${this.state.role}`,
      method: "post",
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
    });
    console.log(json);
    // json.success && alert(json.message)
    json.success && this.props.setGig(json.gig);
    json.success && this.context.handleSnackBar("Gig accepted!", "success");
    this.context.authenticate(
      this.context.token ?? localStorage.getItem("token") ?? ""
    );
  };

  handleDecline = async (): Promise<void> => {
    const json = await fetchHandler({
      url: `${API_URL}/gig/${this.props.id}/decline/${this.props.user.id}/${this.state.role}`,
      method: "post",
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
    });
    console.log(json);
    // json.success && alert(json.message)
    json.success && this.props.setGig(json.gig);
    this.context.handleSnackBar("Gig declined", "info");
    this.context.authenticate(
      this.context.token ?? localStorage.getItem("token") ?? ""
    );
  };

  componentDidMount() {
    this.handleRole();
  }

  render() {
    const buttonGridProps = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 400,
    };

    return (
      <Container
        sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}
      >
        <Paper elevation={12} sx={{ minWidth: "70%", borderRadius: 3 }}>
          <Grid container justifyContent="center" padding={4} spacing={0}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h5">
                {this.props.details.bandLeader.name.split(" ")[0]} has sent you
                an offer!
              </Typography>
            </Grid>
            <div style={{ height: 55 }} />
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="subtitle2">
                Do you want to play {this.state.role} on this gig?
              </Typography>
            </Grid>
            <div style={{ height: 90 }} />
            <Grid
              display="flex"
              justifyContent="center"
              alignItems="center"
              item
              xs={6}
            >
              <Button
                onClick={this.handleDecline}
                variant="contained"
                color="error"
              >
                DECLINE
              </Button>
            </Grid>
            <Grid
              display="flex"
              justifyContent="center"
              alignItems="center"
              item
              xs={6}
            >
              <Button
                onClick={this.handleAccept}
                variant="contained"
                color="success"
              >
                ACCEPT
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default GigInvite;
