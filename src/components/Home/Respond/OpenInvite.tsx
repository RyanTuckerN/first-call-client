import {
  Grid,
  Button,
  Typography,
  Paper,
  Container,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import * as React from "react";
import { Component } from "react";
import { Gig } from "../../../types/API.types";
import { formControl } from "../../_helpers/helpers";
import { DetailedGig } from "../MainView/Gig/Gig.types";

interface OpenInviteProps extends Gig {
  details: DetailedGig;
  role: string;
  name: string;
  handleRespond: (res: "accept" | "decline") => Promise<boolean>;
  handleName: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface OpenInviteState {
  error: boolean;
  showInput: boolean;
}

class OpenInvite extends Component<OpenInviteProps, OpenInviteState> {
  constructor(props: OpenInviteProps) {
    super(props);
    this.state = { error: false, showInput: false };
  }

  componentDidMount() {}

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!formControl.validateName(this.props.name)) {
      this.setState({ error: true });
      return;
    }
    this.props.handleRespond("accept");
    this.handleClose();
  };

  handlePrompt = (): void => {
    this.setState({ showInput: true });
  };

  handleClose = () => this.setState({ showInput: false });

  render() {
    return (
      <Container
        sx={{ display: "flex", justifyContent: "center", marginTop: 10 }}
      >
        <Paper elevation={12} sx={{ minWidth: "70%" }}>
          <Grid container justifyContent="center" padding={4} spacing={0}>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h5">
                {this.props.details.bandLeader.name} has sent you an offer!
              </Typography>
            </Grid>
            <div style={{ height: 55 }} />
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="subtitle2">
                Do you want to play {decodeURI(this.props.role)} on this gig?
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
                onClick={() => this.props.handleRespond("decline")}
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
                onClick={this.handlePrompt}
                variant="contained"
                color="success"
              >
                ACCEPT
              </Button>
              <Dialog open={this.state.showInput} onClose={this.handleClose}>
                <DialogTitle>Accept</DialogTitle>
                <Box
                  component="form"
                  action="submit"
                  id="name"
                  onSubmit={this.handleSubmit}
                >
                  <DialogContent>
                    <DialogContentText>
                      <Typography
                        variant="inherit"
                        color={this.state.error ? "red" : ""}
                      >
                        Please enter your full name to accept this gig offer.
                      </Typography>
                    </DialogContentText>
                    <TextField
                      title="name"
                      id="name"
                      type="name"
                      label="Name"
                      autoFocus
                      variant="standard"
                      fullWidth
                      onChange={this.props.handleName}
                      placeholder="Please enter your full name!"
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={this.handleClose}>Cancel</Button>
                    <Button type="submit">Subscribe</Button>
                  </DialogActions>
                </Box>
              </Dialog>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default OpenInvite;
