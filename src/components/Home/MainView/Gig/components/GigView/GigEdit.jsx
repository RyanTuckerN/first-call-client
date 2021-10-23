import * as React from "react";
import { Component } from "react";
import { Gig, CallStack, Post } from "../../../../../../types/API.types";
import { DetailedGig } from "../../Gig.types";
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
  List,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Settings,
  AttachMoney,
  LocationOn,
  CalendarToday,
  ChevronRight,
  CheckCircleOutline,
  Circle,
  ErrorOutline,
  Add,
  // Circle
} from "@mui/icons-material";
import DateTimePicker from "react-datetime-picker";
import { addHours } from "../../../../../_helpers/helpers";
import "../../Gig.css";
import { Box } from "@mui/system";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";

// interface GigEditProps extends Gig {
//   details: DetailedGig;
// }

// interface GigEditState {
//   id: number;
//   ownerId: number;
//   description: string;
//   location: string;
//   date: string; //date format
//   payment: number;
//   token: string; //uuid
//   openCalls: string[];
//   photo?: string;
//   optionalInfo?: { [key: string]: string };
//   createdAt?: string;
//   updatedAt?: string;
//   posts?: Post[];
//   callStack?: CallStack;
//   optionalKey?: string;
//   optionalVal?: string;
// }

// class GigEdit extends Component<GigEditProps, GigEditState> {
//   constructor(props: GigEditProps) {
//     super(props);
//     this.state = { ...this.props };
//   }
class GigEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // ...this.props,
      gigId: this.props.id,
      date: this.props.date ?? "",
      description: this.props.description ?? "",
      payment: this.props.payment ?? 0,
      location: this.props.location ?? "",
      photo: this.props.photo ?? "",
      dateValue: new Date(this.props.date ?? ""),
      optionalKey: "",
      optionalVal: "",
      optionalInfo: this.props.optionalInfo ?? {},
    };
  }

  handleDate = (val) => this.setState({ dateValue: val });
  handleTitle = (e) => this.setState({ description: e.target.value });
  handlePay = (e) => this.setState({ payment: e.target.value });
  handleLocation = (e) => this.setState({ location: e.target.value });
  handleKey = (e) => this.setState({ optionalKey: e.target.value });
  handleVal = (e) => this.setState({ optionalVal: e.target.value });
  handleOptional = () => {
    if (!this.state.optionalVal || !this.state.optionalKey) return;
    this.setState({
      optionalInfo: {
        ...this.state.optionalInfo,
        [this.state.optionalKey]: this.state.optionalVal,
      },
      optionalKey: "",
      optionalVal: "",
    });
  };

  handleSave = async () => {
    const { description, date, payment, location, optionalInfo, gigId } = this.state;
    const body = { description, date, payment, location, optionalInfo };
    const json = await fetchHandler({
      url: `${API_URL}/gig/${gigId}`,
      method: "put",
      body,
      auth: localStorage.getItem("token" ?? ""),
    });
    console.log(json);
  };

  render() {
    const { optionalInfo } = this.state;
    const keys = Object.keys(optionalInfo);
    const { height, width } = this.props.windowDimensions;

    return (
      <>
        {/* {width<900 && <Link href='#band'>Band</Link>} */}
        <Grid container spacing={0} padding={2}>
          <Grid item xs={12}>
            <Typography variant="h4">Details</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Title</Typography>

            <TextField
              fullWidth
              // placeholder="Wedding gig, Corporate event, etc... "
              onChange={this.handleTitle}
              value={this.state.description}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <Typography variant="h6">Pay</Typography>
            {/* <AttachMoney /> */}
            <TextField
              type="number"
              onChange={this.handlePay}
              value={this.state.payment}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={7}>
            <Typography variant="h6">Date and Time</Typography>
            {/* <CalendarToday /> */}
            {/* <TextField type="datetime-local" /> */}
            <DateTimePicker
              value={this.state.dateValue}
              onChange={this.handleDate}
              minDate={new Date()}
              disableClock={true}
              // hourPlaceholder={19}
              required={true}
              className="datetime-picker"
              clearIcon={null}
            />
            {/* <div style={{width: '100%'}}> */}
            {/* <input
                value={this.state.dateValue}
                onChange={this.onChange}
                // minDate={new Date()}
                // disableClock={true}
                // hourPlaceholder={19}
                required={true}
                className='datetime-picker'
                // clearIcon={null}
                type='datetime-local'
                min={new Date().toTimeString()}
              /> */}
            {/* </div> */}
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Location</Typography>
            {/* <LocationOn /> */}
            <TextField
              fullWidth
              placeholder='Address or venue, eg. "Biltwell Event Center"'
              onChange={this.handleLocation}
              value={this.state.location}
            />
          </Grid>
          <Typography variant="h6">Optional Details</Typography>
          <Grid
            container
            justifyContent="space-between"
            display="flex"
            flexDirection="column"
            item
            xs={12}
          >
            {keys.map((key, i) => (
              <div key={i}>
                <Typography variant="body1">
                  <strong>{key}:</strong> {optionalInfo[key]}
                </Typography>
              </div>
            ))}
            <Box display="flex" flexDirection="row">
              <IconButton onClick={this.handleOptional}>
                <Add />
              </IconButton>
              <Grid item xs={3}>
                <TextField
                  onChange={this.handleKey}
                  value={this.state.optionalKey}
                  placeholder="Meal"
                />
              </Grid>
              <Typography variant="h4">:</Typography>
              <Grid item xs={6}>
                <TextField
                  onChange={this.handleVal}
                  value={this.state.optionalVal}
                  fullWidth
                  placeholder="Surf and turf"
                />
              </Grid>
            </Box>
          </Grid>
          <Button onClick={this.handleSave}>Save</Button>
          <div id="band">
            CALLSTACK MANIPULATION GO HERE, DIFFERENT FOR CREATING AND EDITING.
          </div>
        </Grid>
      </>
    );
  }
}

export default GigEdit;
