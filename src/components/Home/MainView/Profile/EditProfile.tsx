import * as React from "react";
import { Component } from "react";
import { UserCtx } from "../../../Context/MainContext";
import { properize, properizeNoTrim } from "../../../_helpers/helpers";
import { Prompt } from "react-router-dom";
import {
  FormControl,
  FormHelperText,
  Input,
  Button,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import { User } from "../../../../types/API.types";
import Swal from "sweetalert2";

// const payment = {
//   venmo: "nick-tucker-12",
//   zelle: "3175138076",
//   cashApp: "$nicktuckerbass",
// };
// const keys = Object.entries(payment)

interface EditProfileProps {}

interface EditProfileState extends User {
  handle?: string;
  platform?: string;
  snackBarOpen: boolean;
  success: boolean | null;
  // stateChanged: boolean
  // user: User
}

//state-agnostic flag
// let stateChanged: boolean = false;

class EditProfile extends Component<EditProfileProps, EditProfileState> {
  static contextType = UserCtx;
  stateChanged: boolean = false

  constructor(props: EditProfileProps, context: any) {
    super(props, context);
    this.state = {
      ...this.context.user,
      handle: this.context.user.paymentPreference?.handle ?? "",
      platform: this.context.user.paymentPreference?.platform ?? "",
      snackBarOpen: false,
      success: null,
      // stateChanged: false
      // user: this.
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
  handleBio = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ description: e.target.value });
  handlePlatform = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ platform: e.target.value });
  handleHandle = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ handle: e.target.value });
  // addPayment = ()

  handleSave = async (): Promise<void> => {
    if (!this.stateChanged) return;
    const user: EditProfileState = {
      ...this.state,
      paymentPreference: {
        handle: this.state.handle ?? "",
        platform: this.state.platform ?? "",
      },
    };
    const { name, email, location, description, paymentPreference, role } =
      user;
    const body = {
      name,
      email,
      location,
      description,
      paymentPreference,
      role,
    };
    if (await this.context.updateProfile(body)) {
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

  // componentWillUnmount() {
  //   stateChanged &&
  //     Swal.fire({ text: "You have unsaved changed!", icon: "question" });
  // }
  // shou

  handleSuccess = () => this.setState({ success: true, snackBarOpen: true });
  handleFailure = () => this.setState({ success: false, snackBarOpen: true });
  handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackBarOpen: false });
  };

  render() {
    // console.log("STATE HERE HERE HEARE!!", this.state);
    console.log(this.stateChanged);
    // const { user } = this.context;
    return (
      <Grid container spacing={2}>
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
            // label="Name"
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Typography variant="h6">Role</Typography>
          <TextField
            onChange={this.handleRole}
            fullWidth
            variant="outlined"
            placeholder="Guitarist"
            id="role"
            name="role"
            value={this.state.role ? properize(this.state.role) : ""}
            // label="Name"
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
            // label="Name"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Bio</Typography>
          <Typography variant="subtitle2">
            Briefly describe yourself!
          </Typography>
          <TextField
            onChange={this.handleBio}
            multiline
            placeholder="I like long walks on the beach..."
            minRows={3}
            fullWidth
            variant="outlined"
            id="bio"
            name="bio"
            value={this.state.description}
            // label="Name"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Payment Preference</Typography>
        </Grid>
        {/* {this.state.paymentPreference && Object.entries(this.state.paymentPreference) */}
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">platform</Typography>
          <TextField
            onChange={this.handlePlatform}
            fullWidth
            variant="standard"
            placeholder="Venmo, Cashapp, etc..."
            id="payment-platform"
            name="payment-platform"
            value={
              this.state.platform?.length ? properize(this.state.platform) : ""
            }

            // label="Name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption">handle</Typography>
          <TextField
            onChange={this.handleHandle}
            fullWidth
            variant="standard"
            placeholder="your-name-12"
            id="payment-handle"
            name="payment-handle"
            value={this.state.handle}
            // label="Name"
          />
        </Grid>
        <Grid container justifyContent="flex-end" sx={{ padding: 3 }}>
          <Button color="success" variant="contained" onClick={this.handleSave}>
            Save Changes
          </Button>
        </Grid>
        {/* </> */}
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
