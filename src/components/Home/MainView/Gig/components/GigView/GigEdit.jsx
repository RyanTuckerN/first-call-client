import * as React from "react";
import { Component } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  AttachMoney,
  Add,
  Backspace,
  AddAPhoto,
  // Circle
} from "@mui/icons-material";
// import DateTimePicker from "react-datetime-picker";
import { withRouter } from "react-router-dom";
import { properizeNoTrim } from "../../../../../_helpers/helpers";
import "../../Gig.css";
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
      gigLocation: this.props.gigLocation ?? "",
      photo: this.props.photo ?? "",
      dateVal: new Date(this.props.date ?? new Date()),
      optionalKey: "",
      optionalVal: "",
      optionalInfo: this.props.optionalInfo ?? {},
      gigCreate: this.props.gigCreate ?? false,
      success: false,
      // toggleEditMode: this.props.toggleEditMode
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
  handlegigLocation = (e) =>
    this.setState({ gigLocation: properizeNoTrim(e.target.value ?? "") });
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
    // console.log(obj);
    // console.log(key);
    delete obj[key];
    // console.log(obj);
    this.setState({ optionalInfo: obj });
  };

  uploadImage = async (e) => {
    try {
      const files = e.target.files;
      if (!files) throw new Error("something went wrong!");
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "lvcrltpx");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpd08wa9g/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const File = await res.json();
      console.log(File);
      
      this.setState({ photo: File.secure_url });
      if (this.state.gigCreate) {
        this.context.handleSnackBar("Done!", "info");
        return;
      }
      const json = await fetchHandler({
        url: `${API_URL}/gig/${this.state.gigId}`,
        method: "put",
        auth: localStorage.getItem("token" ?? this.context.token ?? ""),
        body: { photo: File.secure_url },
      });
      // alert(json.message);
      console.log(json);
      json.success && this.props.setGig(json.gig);
      json.success && this.context.handleSnackBar(json.message, "success");
      return true;
    } catch (err) {
      console.error(err);
      this.context.handleSnackBar("There was an error!", "error");
      return false;
    }
  };

  handleSave = async () => {
    const { description, date, payment, gigLocation, optionalInfo, gigId } =
      this.state;
    const { callStackEmpty, gigCreate } = this.props;
    if (
      !description ||
      !date ||
      !payment ||
      !gigLocation ||
      !optionalInfo
      // !gigId
    ) {
      this.context.handleSnackBar("Empty field(s)!", "warning");
      return;
    }
    if (callStackEmpty && gigCreate) {
      this.context.handleSnackBar(
        "Empty callStack! Fill out at least one role to submit.",
        "warning"
      );
      return;
    }
    const body = {
      description,
      date,
      payment,
      gigLocation,
      optionalInfo,
      [gigCreate? 'photo' : '']: this.state.photo
    };

    const json = await fetchHandler({
      url: `${API_URL}/gig/${this.state.gigCreate ? "" : gigId}`,
      method: this.state.gigCreate ? "post" : "put",
      body,
      auth: localStorage.getItem("token") ?? this.context.token ?? "",
    });
    console.log(json);
    json.success
      ? this.state.gigCreate
        ? this.props.setGigId(json.newGig.id)
        : this.props.setGig(json.gig)
      : null;
    json.success && this.context.handleSnackBar(json.message, "success");
    json.success &&
      this.setState({
        success: true,
        gigId: this.state.gigCreate ? json.newGig.id : json.gig.id,
      });
    // json.success && this.props.addGig(json.newGig)
  };

  componentDidUpdate(prevProps, prevState) {
    this.state.success &&
      setTimeout(() => {
        // alert("redirect here at GigEdit Component did update!");
        this.state.gigCreate
          ? this.props.history.push(`/main/gig/${this.state.gigId}`)
          : this.props.toggleEditMode();
      }, 1750);
  }

  render() {
    const { optionalInfo } = this.state;
    const keys = Object.keys(optionalInfo);

    return (
      <Grid
        item
        xs={this.props.gigCreate ? 12 : 12}
        md={this.props.gigCreate ? 12 : 7}
        lg={this.props.gigCreate ? 12 : 6}
      >
        {/* {width<900 && <Link href='#band'>Band</Link>} */}
        {/* {this.state.photo && <Grid display='flex' item xs={6} justifyContent='center'>
          <Avatar src={this.state.photo} variant='square' sx={{width: '100%', height:'auto'}} />
        </Grid>} */}
        <Grid
          container
          item
          spacing={1}
          padding={2}
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Grid
            item
            container
            xs={12}
            sx={{ marginTop: 1 }}
            display="flex"
            justifyContent="space-between"
          >
            <Typography variant="h4">Details</Typography>
            {/* {!this.state.gigCreate ? ( */}
            <Button
              color="success"
              variant="contained"
              onClick={this.handleSave}
            >
              {this.state.gigCreate ? `CREATE GIG` : `SAVE`}
            </Button>
            {/* ) : null} */}
          </Grid>
          <Grid container item xs={12} sx={{ marginTop: 1, marginLeft: 1 }}>
            <Typography variant="body2">Give us the goods.</Typography>
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
            {/* <Typography variant="h6">gigLocation</Typography> */}
            {/* <gigLocationOn /> */}
            <TextField
              fullWidth
              label="Location"
              placeholder="Include a place or address"
              onChange={this.handlegigLocation}
              value={this.state.gigLocation}
            />
          </Grid>
          <Grid item xs={12} display="flex" alignItems="center">
            <Typography variant="h5">Optional Details</Typography>
            <input
              accept="image/*"
              onChange={this.uploadImage}
              style={{ display: "none" }}
              id="add-image"
              type="file"
            />
            <Button>
              <label htmlFor="add-image" id="add-image">
                <AddAPhoto sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ marginLeft: 0.5 }}>
                  {this.state.photo ? `UPDATE PHOTO?` : `ADD A PHOTO?`}
                </Typography>
              </label>
            </Button>
          </Grid>
          <Grid container item xs={12} sx={{ marginTop: 1, marginLeft: 1 }}>
            <Typography variant="body2">{`This is where you can tell us about the rehearsal, souncheck, box-lunch, etc. Be as detailed as you'd like!`}</Typography>
          </Grid>
          <Grid
            container
            // justifyContent="space-between"
            display="flex"
            flexDirection="column"
            item
            xs={12}
          >
            <Grid
              item
              container
              xs={12}
              // display="flex"
              flexDirection="row"
              // justifyContent="space-between"
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
                    xs={7}
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
                  <Grid item xs={12} sm={5}>
                    <TextField
                      ref={(i) => (this.optForm = i)}
                      label="Category"
                      onChange={this.handleKey}
                      value={this.state.optionalKey}
                      placeholder="Any category"
                      fullWidth
                    />
                  </Grid>
                  {/* <Typography variant="h4">:</Typography> */}
                  <Grid item xs={12} sm={7}>
                    <TextField
                      label="Info"
                      onChange={this.handleVal}
                      value={this.state.optionalVal}
                      fullWidth
                      placeholder="Some details"
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
          {/* <div id="band">
            CALLSTACK MANIPULATION GO HERE, DIFFERENT FOR CREATING AND EDITING.
          </div> */}
        </Grid>
        <Grid display="flex" justifyContent="flex-end" padding={2}>
          <Button color="success" variant="contained" onClick={this.handleSave}>
            {this.state.gigCreate ? `CREATE GIG` : `SAVE`}
          </Button>
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(GigEdit);
