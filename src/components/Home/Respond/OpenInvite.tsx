import {
  Grid,
  Button,
  Typography,
  Paper,
  Container,
  TextField,
  Box,
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
  showInput: boolean;
}

class OpenInvite extends Component<OpenInviteProps, OpenInviteState> {
  constructor(props: OpenInviteProps) {
    super(props);
    this.state = { showInput: false };
  }

  componentDidMount() {}

  handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if(!formControl.validateName(this.props.name)){
      alert('Please enter your full name!')
      return
    }
    this.props.handleRespond("accept");
  };

  handlePrompt = (): void => {
    this.setState({ showInput: true });
  };
  render() {
    // const buttonGridProps = {
    //   display: "flex",
    //   flexDirection: "row",
    //   justifyContent: "center",
    //   alignItems: "center",
    //   minHeight: 400,
    // };

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
                Do you want to play {this.props.role} on this gig?
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
              {!this.state.showInput && (
                <Button
                  onClick={this.handlePrompt}
                  variant="contained"
                  color="success"
                >
                  ACCEPT
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            {this.state.showInput && (
              <Box
                component="form"
                action="submit"
                id="gig-invite-name-field"
                onSubmit={this.handleSubmit}
                sx={{
                  display: "flex",
                  justifyContent: 'center',
                  alignItems: "center",
                  margin: 1,
                  padding: 1,
                }}
              >
                <div >
                    <Typography variant='overline' >Please enter your full name to accept the gig!</Typography>
                  <div style={{display: "flex", justifyContent: 'space-between'}}>
                    <TextField
                      title="name"
                      label="Name"
                      autoFocus
                      onChange={this.props.handleName}
                      placeholder="Please enter your full name!"
                    />
                    <Button variant="contained" color="success" type="submit">
                      Submit
                    </Button>
                  </div>
                </div>
              </Box>
            )}
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default OpenInvite;
