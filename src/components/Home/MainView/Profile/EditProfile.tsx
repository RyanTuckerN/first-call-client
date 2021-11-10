import * as React from "react";
import { Component } from "react";
import { UserCtx } from "../../../Context/MainContext";
import { properize, properizeNoTrim } from "../../../_helpers/helpers";
import { Prompt } from "react-router-dom";
import {
  Button,
  Grid,
  TextField,
  Typography,
  IconButton,
  Autocomplete,
  Box,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { User } from "../../../../types/API.types";

import {
  instrumentOptions,
  paymentPlatforms,
} from "../../../../types/AutocompleteOptions";
import * as _ from "lodash";
import { Add, DragHandle, Cancel, Reply } from "@mui/icons-material";

interface EditProfileProps {
  updateProfile: (prop: any) => Promise<boolean>;
  user: User;
}

interface EditProfileState extends User {
  platform?: string;
  handle?: string;
  snackBarOpen: boolean;
  success: boolean | null;
  paymentEditTarget: string;
}

class EditProfile extends Component<EditProfileProps, EditProfileState> {
  static contextType = UserCtx;
  stateChanged: boolean = false;

  constructor(props: EditProfileProps, context: any) {
    super(props, context);
    this.state = {
      ...this.props.user,

      handle: this.props.user.paymentPreference?.handle ?? "",
      platform: this.props.user.paymentPreference?.platform ?? "",
      snackBarOpen: false,
      success: null,
      paymentEditTarget: "",
    };
  }

  handleName = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ name: e.target.value });
  handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ email: e.target.value });
  handleRole = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ role: e.target.value });
  handleLocation = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ location: e.target.value });
  handlePlatform = (e: any): void =>
    this.setState({ platform: e.target.value });
  handleHandle = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ handle: e.target.value });

  handleAddPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!this.state.handle || !this.state.platform) return;
    this.setState({
      paymentPreference: {
        ...this.state.paymentPreference,
        [this.state.platform]: this.state.handle,
      },
      handle: "",
      platform: "",
    });
  };

  handleSave = async (): Promise<void> => {
    if (!this.stateChanged) return;
    const { name, email, location, paymentPreference, role } = this.state;
    const body = {
      name,
      email,
      location,
      paymentPreference,
      role,
    };
    if (await this.props.updateProfile(body)) {
      this.stateChanged = false;
      this.handleSuccess();
    } else this.handleFailure();
  };

  componentDidMount() {
    this.stateChanged = false;
  }
  componentDidUpdate(prevProps: EditProfileProps, prevState: EditProfileState) {
    if (prevState !== this.state) {
      this.stateChanged = true;
    }
  }

  handleSuccess = () => this.setState({ success: true, snackBarOpen: true });
  handleFailure = () => this.setState({ success: false, snackBarOpen: true });
  handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackBarOpen: false });
    this.stateChanged = false;
  };

  render() {
    return (
      <Grid container spacing={2}>
        <Grid container justifyContent="flex-end" sx={{ padding: 3 }}>
          <Button color="success" variant="contained" onClick={this.handleSave}>
            Save Changes
          </Button>
        </Grid>
        <Prompt
          when={this.stateChanged}
          message={"You have unsaved changes! Continue anyway?"}
        />
        <Grid item xs={12} sm={7}>
          <Typography variant="h6">Name</Typography>
          <TextField
            onChange={this.handleName}
            fullWidth
            variant="outlined"
            id="name"
            name="name"
            value={this.state.name}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Typography variant="h6">Instrument</Typography>
          <Autocomplete
            id="instrument-input"
            freeSolo
            onChange={(e: any, newVal: string | null) => {
              this.setState({ role: newVal ?? "" });
            }}
            value={this.state.role ? properize(this.state.role) : ""}
            options={instrumentOptions.map((i) => i)}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={this.handleRole}
                fullWidth
                variant="outlined"
                placeholder="Guitar"
                id="instrument"
                name="instrument"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Typography variant="h6">Email Address</Typography>
          <TextField
            onChange={this.handleEmail}
            fullWidth
            variant="outlined"
            id="email-address"
            name="email-address"
            value={this.state.email}
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <Typography variant="h6">Location</Typography>
          <TextField
            fullWidth
            onChange={this.handleLocation}
            variant="outlined"
            id="location"
            placeholder="Chicago, IL"
            name="location"
            value={
              this.state.location ? properizeNoTrim(this.state.location) : ""
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Payment Preferences</Typography>
          <Typography variant="caption">
            {`Add as many platforms as you'd like. These will be displayed 
            on your profile and sent to bandleaders after gigs.`}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">platform</Typography>
          <Autocomplete
            id="payment-platform-input"
            freeSolo
            onChange={(e: any, newVal: string | null) => {
              this.setState({ platform: newVal ?? "" });
            }}
            value={
              this.state.platform?.length ? properize(this.state.platform) : ""
            }
            options={paymentPlatforms.map((pp) => pp)}
            renderInput={(params) => (
              <TextField
                {...params}
                onChange={this.handlePlatform}
                fullWidth
                variant="standard"
                placeholder="Venmo, Cashapp, etc..."
                id="payment-platform"
                name="payment-platform"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">handle</Typography>
          <Box
            component="form"
            action="submit"
            onSubmit={this.handleAddPayment}
          >
            <TextField
              onChange={this.handleHandle}
              fullWidth
              variant="standard"
              placeholder="your-name-12"
              id="payment-handle"
              name="payment-handle"
              value={this.state.handle}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <InputAdornment position="end">
                      <Add />
                    </InputAdornment>
                  </IconButton>
                ),
              }}
            />
          </Box>
        </Grid>
        {this.state.paymentPreference &&
        !_.isEmpty(this.state.paymentPreference)
          ? Object.keys(this.state.paymentPreference).map((p, i) => {
              const platform = p;
              const preferece = this.state.paymentPreference![platform];
              return (
                <Grid item xs={12} key={i} display="flex" alignItems="center">
                  <IconButton
                    onClick={() => {
                      this.state.paymentEditTarget === platform
                        ? this.setState({ paymentEditTarget: "" })
                        : this.setState({ paymentEditTarget: platform });
                    }}
                  >
                    {this.state.paymentEditTarget === platform ? (
                      <Reply fontSize="small" />
                    ) : (
                      <DragHandle fontSize="small" />
                    )}
                  </IconButton>

                  <Typography variant="body2">
                    <strong>{platform}:</strong>&nbsp;&nbsp;{preferece}
                  </Typography>
                  {this.state.paymentEditTarget === platform && (
                    <IconButton
                      onClick={() => {
                        const obj = { ...this.state.paymentPreference };
                        delete obj[platform];
                        this.setState({ paymentPreference: obj });
                      }}
                    >
                      <Cancel color="error" fontSize="small" />
                    </IconButton>
                  )}
                </Grid>
              );
            })
          : null}
        <Grid container justifyContent="flex-end" sx={{ padding: 3 }}>
          <Button color="success" variant="contained" onClick={this.handleSave}>
            Save Changes
          </Button>
        </Grid>
        <Snackbar
          open={this.state.snackBarOpen}
          autoHideDuration={6000}
          onClose={this.handleClose}
        >
          {this.state.success ? (
            <Alert severity="success">Success! Profile updated.</Alert>
          ) : (
            <Alert severity="error">Something went wrong.</Alert>
          )}
        </Snackbar>
      </Grid>
    );
  }
}

export default EditProfile;
