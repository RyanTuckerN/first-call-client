import { Component } from "react";
import {
  Button,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { AttachMoney, Add, Backspace, AddAPhoto } from "@mui/icons-material";
import { withRouter } from "react-router-dom";
import { properizeNoTrim, addHours } from "../../../../../_helpers/helpers";
import "../../Gig.css";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";
import { UserCtx } from "../../../../../Context/MainContext";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterMoment";
import DateTimePicker from "@mui/lab/DateTimePicker";
import { Fade } from "react-reveal";
import Swal from "sweetalert2";

class GigEdit extends Component {
  static contextType = UserCtx;

  constructor(props, context) {
    super(props, context);
    this.state = {
      length: this.props.length ?? 1,
      gigId: this.props.id,
      date: this.props.date ?? addHours(new Date(), 24 * 7),
      description: this.props.description ?? "",
      payment: this.props.payment ?? 0,
      gigLocation: this.props.gigLocation ?? "",
      photo: this.props.photo ?? "",
      optionalKey: "",
      optionalVal: "",
      optionalInfo: this.props.optionalInfo ?? {},
      gigCreate: this.props.gigCreate ?? false,
      success: false,
    };
  }

  handleTitle = (e) =>
    this.setState({ description: properizeNoTrim(e.target.value) });
  handlePay = (e) =>
    this.setState({ payment: e.target.value < 1 ? 50 : e.target.value });
  handleLength = (e) =>
    this.setState({ length: e.target.value < 0 ? 1 : e.target.value });
  handleDate = (val) => this.setState({ date: val });

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
    delete obj[key];
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
    if (!description || !payment || !gigLocation || !optionalInfo) {
      this.context.handleSnackBar("Empty field(s)!", "warning");
      return;
    }

    if (callStackEmpty && gigCreate) {
      this.context.handleSnackBar(
        "Empty callStack! Add at least one instrument to submit.",
        "warning"
      );
      return;
    }
    const body = {
      description,
      date: new Date(date).toISOString(),
      payment: Math.floor(payment),
      gigLocation,
      optionalInfo,
      [gigCreate ? "photo" : ""]: this.state.photo,
    };

    const json = await fetchHandler({
      url: `${API_URL}/gig/${this.state.gigCreate ? "" : gigId}`,
      method: this.state.gigCreate ? "post" : "put",
      body,
      auth: localStorage.getItem("token") ?? this.context.token ?? "",
    });
    json.success
      ? this.state.gigCreate
        ? this.props.setGigId(json.newGig.id)
        : this.props.setGig(json.gig)
      : null;
    json.success &&
      !this.state.gigCreate &&
      this.context.handleSnackBar(json.message, "success");
    json.success &&
      this.state.gigCreate &&
      Swal.fire({
        title: "Gig Created!",
        icon: "success",
        customClass: {
          container: this.context.darkModeOn === "true" ? "dark-mode-swal" : "",
        },
      });

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
        this.state.gigCreate
          ? this.props.history.push(`/main/gig/${this.state.gigId}`)
          : this.props.toggleEditMode();
      }, 1000);
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
            {!!this.state.date &&
              !!this.state.description &&
              !!this.state.gigLocation &&
              !!this.state.payment && (
                <Button
                  color="success"
                  variant="contained"
                  onClick={this.handleSave}
                >
                  {this.state.gigCreate ? `CREATE GIG` : `SAVE`}
                </Button>
              )}
          </Grid>
          <Grid container item xs={12} sx={{ marginTop: 1, marginLeft: 1 }}>
            <Typography variant="body2">Give us the goods.</Typography>
          </Grid>

          <Grid item xs={12} sm={9} lg={12}>
            <TextField
              fullWidth
              label="Title"
              placeholder="Add a short, clear title"
              onChange={this.handleTitle}
              value={this.state.description}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DateTimePicker
                label="Date and Time"
                fullWidth
                disablePast
                ampmInClock={true}
                value={this.state.date}
                onChange={this.handleDate}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <TextField
              fullWidth
              type="number"
              label="Length(hrs)"
              onChange={this.handleLength}
              value={this.state.length}
              InputProps={{
                endAdornment: <></>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
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
          <Grid container display="flex" flexDirection="column" item xs={12}>
            {keys.map((cat, i) => (
              <Fade key={i}>
                <Grid item container xs={12}>
                  <Grid item xs={6}>
                    <Typography variant="body1">
                      <strong>{properizeNoTrim(cat)}</strong>
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
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
                </Grid>
              </Fade>
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
                    sx={{ pr: 1 }}
                  />
                </Grid>
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
        <Grid display="flex" justifyContent="flex-end" padding={2}>
          {!!this.state.date &&
            !!this.state.description &&
            !!this.state.gigLocation &&
            !!this.state.payment && (
              <Button
                color="success"
                variant="contained"
                onClick={this.handleSave}
              >
                {this.state.gigCreate ? `CREATE GIG` : `SAVE`}
              </Button>
            )}
        </Grid>
      </Grid>
    );
  }
}

export default withRouter(GigEdit);
