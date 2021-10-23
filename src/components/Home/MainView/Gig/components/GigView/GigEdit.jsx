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
  Backspace,
  // Circle
} from "@mui/icons-material";
// import DateTimePicker from "react-datetime-picker";
import { addHours, properizeNoTrim } from "../../../../../_helpers/helpers";
import "../../Gig.css";
import { Box } from "@mui/system";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";
import { UserCtx } from "../../../../../Context/MainContext";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
// import moment from 'moment'
// import DateAdapter from '@mui/lab/AdapterDayjs';
// import DateAdapter from '@mui/lab/AdapterLuxon';
import DateTimePicker from "@mui/lab/DateTimePicker";

class GigEdit extends Component {
  static contextType = UserCtx;

  constructor(props, context) {
    super(props, context);
    this.state = {
      // ...this.props,
      length: this.props.length ?? 1,
      gigId: this.props.id,
      date: this.props.date ?? "",
      description: this.props.description ?? "",
      payment: this.props.payment ?? 0,
      location: this.props.location ?? "",
      photo: this.props.photo ?? "",
      dateVal: new Date(this.props.date),
      optionalKey: "",
      optionalVal: "",
      optionalInfo: this.props.optionalInfo ?? {},
      // testDate: moment(new Date())
    };
  }

  handleTitle = (e) =>
    this.setState({ description: properizeNoTrim(e.target.value) });
  handlePay = (e) =>
    this.setState({ payment: e.target.value < 1 ? 50 : e.target.value });
  handleLength = (e) =>
    this.setState({ length: e.target.value < 0 ? 1 : e.target.value });
  handleDate = (val) =>
    this.setState({ date: new Date(val).toISOString(), dateVal: val });
  handleLocation = (e) =>
    this.setState({ location: properizeNoTrim(e.target.value ?? "") });
  handleKey = (e) =>
    this.setState({ optionalKey: properizeNoTrim(e.target.value ?? "") });
  handleVal = (e) =>
    this.setState({ optionalVal: properizeNoTrim(e.target.value) ?? "" });
  handleOptional = (e) => {
    e.preventDefault();
    if (!this.state.optionalVal || !this.state.optionalKey) return;
    this.setState({
      optionalInfo: {
        ...this.state.optionalInfo,
        [this.state.optionalKey]: this.state.optionalVal,
      },
      optionalKey: "",
      optionalVal: "",
    });
    this.optForm.focus();
  };
  handleOptionalDelete = (key) => {
    const obj = this.state.optionalInfo;
    console.log(obj);
    console.log(key);
    delete obj[key];
    console.log(obj);
    this.setState({ optionalInfo: obj });
  };

  handleSave = async () => {
    const { description, date, payment, location, optionalInfo, gigId } =
      this.state;
    const body = { description, date, payment, location, optionalInfo };
    const json = await fetchHandler({
      url: `${API_URL}/gig/${gigId}`,
      method: "put",
      body,
      auth: localStorage.getItem("token" ?? this.context.token ?? ""),
    });
    alert(json.message);
  };

  render() {
    const { optionalInfo } = this.state;
    const keys = Object.keys(optionalInfo);
    const { height, width } = this.props.windowDimensions;

    return (
      <>
        {/* {width<900 && <Link href='#band'>Band</Link>} */}
        <Grid
          container
          spacing={1}
          padding={2}
          display="flex"
          justifyContent="space-between"
        >
          <Grid item xs={12}>
            <Typography variant="h4">Details</Typography>
          </Grid>
          <Grid item xs={12} sm={9} lg={12}>
            {/* <Typography variant="h6">Title</Typography> */}

            <TextField
              fullWidth
              label="Title"
              placeholder="Add a short, clear title"
              onChange={this.handleTitle}
              value={this.state.description}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            {/* <Typography variant="h6">Pay</Typography> */}
            {/* <AttachMoney /> */}
            <TextField
              type="number"
              fullWidth
              label="Pay"
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
          <Grid item xs={12} sm={6}>
            {/* <Typography variant="h6">Date and Time</Typography> */}
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DateTimePicker
                label="Date and Time"
                fullWidth
                disablePast
                ampmInClock={true}
                value={this.state.dateVal}
                onChange={this.handleDate}
                // onOpen
                // minDate={new Date()}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            {/* <Typography variant="h6">Pay</Typography> */}
            {/* <AttachMoney /> */}
            <TextField
              fullWidth
              type="number"
              label="Length(hrs)"
              // placeholder="2"
              onChange={this.handleLength}
              value={this.state.length}
              InputProps={{
                endAdornment: <></>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            {/* <Typography variant="h6">Location</Typography> */}
            {/* <LocationOn /> */}
            <TextField
              fullWidth
              label="Location"
              placeholder="Include a place or address"
              onChange={this.handleLocation}
              value={this.state.location}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5">Optional Details</Typography>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            display="flex"
            flexDirection="column"
            item
            xs={12}
          >
            <Grid
              item
              container
              xs={12}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
            >
              {keys.map((cat, i) => (
                <React.Fragment key={i}>
                  <Grid item xs={3}>
                    <Typography variant="body1">
                      <strong>{properizeNoTrim(cat)}</strong>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={8}
                    display="flex"
                    justifyContent="space-between"
                  >
                    <Typography variant="body1">
                      {properizeNoTrim(optionalInfo[cat])}
                    </Typography>
                    <IconButton onClick={() => this.handleOptionalDelete(cat)}>
                      <Backspace color="error" />
                    </IconButton>
                  </Grid>
                </React.Fragment>
              ))}
              <form
                action="submit"
                onSubmit={this.handleOptional}
                ref={(i) => (this.optForm = i)}
              >
                <Grid
                  container
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                >
                  <Grid item xs={3}>
                    <TextField
                      ref={(i) => (this.optForm = i)}
                      label="Category"
                      onChange={this.handleKey}
                      value={this.state.optionalKey}
                      placeholder="Meal"
                    />
                  </Grid>
                  {/* <Typography variant="h4">:</Typography> */}
                  <Grid item xs={8}>
                    <TextField
                      label="Info"
                      onChange={this.handleVal}
                      value={this.state.optionalVal}
                      fullWidth
                      placeholder="Surf and turf"
                      InputProps={{
                        endAdornment: (
                          <IconButton type="submit">
                            <Add />
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
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
