import * as React from "react";
import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Autocomplete,
  List,
  InputAdornment,
  ListItemText,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  formControl,
  properize,
  properizeNoTrim,
} from "../../../../_helpers/helpers";
import { Backspace } from "@mui/icons-material";
import { Box } from "@mui/system";
import * as _ from "lodash";
import { fetchHandler } from "../../../../_helpers/fetchHandler";
import API_URL from "../../../../_helpers/environment";
import { UserCtx } from "../../../../Context/MainContext";
import { AppState } from "../../../../../App";
import { Gig } from "../../../../../types/API.types";
import { instrumentOptions } from "../../../../../types/AutocompleteOptions";

interface RouteParams {
  gigId: string;
}

interface CallStackCreateProps extends RouteComponentProps<RouteParams> {
  gigId: number | null;
  setCallStackEmpty: (b: boolean) => void;
  addGig: (gig: Gig) => void;

  followInfo: any[];
}

interface CallStackCreateState {
  stackTable: { [key: string]: string[] };
  roles: string[];
  roleVal: string;
  emailVal: string;
  message: string;
}

class CallStackCreate extends Component<
  CallStackCreateProps,
  CallStackCreateState
> {
  static contextType = UserCtx;
  callstackEnd: any = null;
  constructor(props: CallStackCreateProps, context: AppState) {
    super(props, context);
    this.state = {
      stackTable: {},
      roles: [],
      roleVal: "",
      emailVal: "",
      message: "",
    };
  }

  handleRole = (e: any) =>
    this.setState({ roleVal: e.target.value.toLowerCase() });

  handleEmail = (e: any) =>
    this.setState({ emailVal: e.target.value.toLowerCase() });

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    this.setState({ message: "" });
    if (!this.state.roleVal) return;
    if (!formControl.validateEmail(this.state.emailVal)) {
      this.setState({ message: "Choose a valid email address" });
      return;
    }
    const obj = this.state.stackTable;
    const arr = obj[this.state.roleVal]
      ? [...obj[this.state.roleVal], this.state.emailVal]
      : [this.state.emailVal];
    obj[this.state.roleVal] = [...new Set(arr)];
    this.setState({ stackTable: obj, emailVal: "" });
    this.props.setCallStackEmpty(false);
  };

  handleDelete = (role: string, email: string): void => {
    const arr = this.state.stackTable[role].filter((e) => e !== email);
    if (!arr.length) {
      const obj = { ...this.state.stackTable };
      delete obj[role];
      this.setState({ stackTable: obj });
    } else {
      this.setState({ stackTable: { ...this.state.stackTable, [role]: arr } });
    }
  };

  saveCallStackToDB = async () => {
    if (_.isEmpty(this.state.stackTable)) return;
    try {
      const json = await fetchHandler({
        url: `${API_URL}/gig/${this.props.gigId}/callStack`,
        method: "post",
        body: { stackTable: this.state.stackTable },
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      json.success && this.context.handleSnackBar("Success!", "success");
      json.success && this.props.setCallStackEmpty(true);
      if (json.success) {
        const gig = { ...json.gig, callStack: json.callStack };
        this.props.addGig(gig);
      }
    } catch (err) {
      this.context.handleSnackBar(err, "error");
    }
  };

  componentDidMount() {
    this.props.setCallStackEmpty(true);
  }

  componentDidUpdate(
    prevProps: CallStackCreateProps,
    prevState: CallStackCreateState
  ) {
    if (prevState.stackTable !== this.state.stackTable) {
      this.props.setCallStackEmpty(_.isEmpty(this.state.stackTable));
    }
    if (
      prevProps.gigId !== this.props.gigId &&
      typeof this.props.gigId === "number"
    ) {
      this.saveCallStackToDB();
    }
  }

  render() {
    const { stackTable } = this.state;
    const roles = Object.keys(stackTable);

    return (
      <>
        <Grid
          container
          spacing={1}
          padding={2}
          display="flex"
          justifyContent="space-between"
        >
          <Grid container item xs={12} sx={{ marginTop: 1 }}>
            <Typography variant="h4">Band</Typography>
          </Grid>
          <Grid container item xs={12} sx={{ marginTop: 1, marginLeft: 1 }}>
            <Typography variant="body2">
              {`Add your call lists here. 
              Tell us which instruments you need and 
              give a list of email addresses and we'll 
              handle the rest! Please order your 
              lists, if the first person declines, 
              we will invite the next person, and so 
              on. They dont have to be members of FirstCall!`}
            </Typography>
          </Grid>
          <form
            action="submit"
            onSubmit={this.handleSubmit}
            style={{ width: "100%" }}
          >
            <Grid
              item
              container
              display="flex"
              justifyContent="space-between"
              xs={12}
              sx={{ marginTop: 1, }}
            >
              <Grid item xs={12} sm={5} sx={{}}>
                <Autocomplete
                  id="instrument-input"
                  freeSolo
                  onChange={(e: any, newVal: string | null) => {
                    this.setState({ roleVal: newVal?.toLowerCase() ?? "" });
                  }}
                  value={
                    this.state.roleVal ? properize(this.state.roleVal) : ""
                  }
                  options={[
                    ...new Set([
                      ...instrumentOptions.map((i) => i),
                      ...roles.map((r) => properize(r)),
                    ]),
                  ].sort()}
                  onInputChange={(e: any, newVal: string | null) => {
                    this.setState({ roleVal: newVal?.toLowerCase() ?? "" });
                  }}
                  openOnFocus
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      title="Instrument"
                      label="Instrument"
                      variant="outlined"
                      id="instrument"
                      name="instrument"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={7} sx={{pl: {xs: 0, sm:1}, mt: {xs: 1, sm:0}}}>
                <Autocomplete
                  id="email-input"
                  freeSolo
                  openOnFocus
                  value={this.state.emailVal?.toLowerCase() ?? ""}
                  getOptionLabel={() => this.state.emailVal}
                  options={this.props.followInfo.filter(
                    (user) =>
                      user.role?.toLowerCase() ===
                      this.state.roleVal?.toLowerCase()
                  )}
                  onChange={(e: any, option: any) => {
                    this.setState({
                      emailVal: option?.email?.toLowerCase() ?? "",
                    });
                  }}
                  onInputChange={(e: any, option: any) => {
                    this.setState({ emailVal: option?.toLowerCase() ?? "" });
                  }}
                  renderOption={(props, option) => {
                    return (
                      <Box component="li" {...props} key={option.id}>
                        <Avatar src={option.photo} alt="" />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <Typography variant="subtitle1">
                          {option.name}
                        </Typography>{" "}
                        &nbsp;&nbsp;
                        <Typography variant="body1">{option.role}</Typography>
                      </Box>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Email"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            <InputAdornment position="end">
                              <Button
                                type="submit"
                                sx={{position:'relative', left:50}}
                                disabled={
                                  !this.state.emailVal || !this.state.roleVal
                                }
                              >
                                Add
                              </Button>
                            </InputAdornment>
                          </>
                        ),
                      }}
                    />
                  )}
                />
                <Typography variant="caption" color="red">
                  {this.state.message}
                </Typography>
              </Grid>
            </Grid>
          </form>
          {roles.length ? (
            roles.map((r, i) => (
              <Grid item xs={6} key={i}>
                <Grid item xs={12} sx={{ marginTop: 1 }}>
                  <Typography variant="h6">{properizeNoTrim(r)}</Typography>
                </Grid>
                <List>
                  {stackTable[r].map((email, i) => (
                    <React.Fragment key={i}>
                      <Box display="flex" alignItems="center">
                        <ListItemText key={i}>
                          <Typography variant="body2">
                            <strong>
                              {i + 1}
                              {`.)`}
                            </strong>{" "}
                            &nbsp;&nbsp; {email}
                          </Typography>
                        </ListItemText>
                        <IconButton onClick={() => this.handleDelete(r, email)}>
                          <Backspace color="error" />
                        </IconButton>
                      </Box>
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            ))
          ) : (
            <Box height={200} />
          )}
          <div
            style={{ float: "left", clear: "both" }}
            ref={(el) => {
              this.callstackEnd = el;
            }}
          />
        </Grid>
      </>
    );
  }
}

export default withRouter(CallStackCreate);
