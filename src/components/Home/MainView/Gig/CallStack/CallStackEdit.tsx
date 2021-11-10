import React, { Component } from "react";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  Button,
  List,
  Autocomplete,
  ListItemText,
  InputAdornment,
  Box,
  Avatar,
} from "@mui/material";
import { instrumentOptions } from "../../../../../types/AutocompleteOptions";
import { Backspace } from "@mui/icons-material";
import { CallStack, Gig } from "../../../../../types/API.types";
import { formControl, properize } from "../../../../_helpers/helpers";
import { fetchHandler } from "../../../../_helpers/fetchHandler";
import API_URL from "../../../../_helpers/environment";
import { UserCtx } from "../../../../Context/MainContext";
import { AppState } from "../../../../../App";

interface CallStackEditProps extends CallStack {
  setGig: (gig: Gig) => void;
  followInfo: any[];
  gig: Gig;
}

interface CallStackEditState extends CallStack {
  roleVal: string | null;
  emailVal: string | null;
}

class CallStackEdit extends React.Component<
  CallStackEditProps,
  CallStackEditState
> {
  static contextType = UserCtx;

  constructor(props: CallStackEditProps, context: AppState) {
    super(props, context);
    this.state = {
      ...this.props,
      roleVal: "",
      emailVal: "",
    };
  }

  handleRole = (e: any) =>
    this.setState({ roleVal: e.target.value.toLowerCase() });

  handleEmail = (e: any) => this.setState({ emailVal: e.target.value });

  handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    e.preventDefault();
    try {
      const { roleVal, emailVal } = this.state;
      if (!emailVal || !roleVal) {
        // this.setState({ message: "Please fill out both fields" });
        this.context.handleSnackBar("Please fill out both fields!", "warning");
        return false;
      }
      if (!formControl.validateEmail(emailVal)) {
        this.context.handleSnackBar("Please choose a valid email!", "warning");
        return false;
      }
      if (this.state.stackTable[roleVal]) {
        const { success, callStack } = await fetchHandler({
          url: `${API_URL}/gig/${this.state.gigId}/callStack/addUser/${roleVal}/${emailVal}`,
          method: "post",
          auth: this.context.token ?? localStorage.getItem("token") ?? "",
        });
        success && this.setState({ stackTable: callStack });
        success &&
          this.props.setGig({
            ...this.props.gig,
            callStack: { ...this.state, stackTable: callStack },
          });
        return success;
      } else {
        const { success, roleStack, message } = await fetchHandler({
          url: `${API_URL}/gig/${this.state.gigId}/callStack/addRole/${roleVal}`,
          method: "post",
          body: { calls: emailVal },
          auth: this.context.token ?? localStorage.getItem("token") ?? "",
        });
        success &&
          this.setState({
            stackTable: { ...this.state.stackTable, [roleVal]: roleStack },
          });
        success &&
          this.props.setGig({
            ...this.props.gig,
            callStack: {
              ...this.state,
              stackTable: { ...this.state.stackTable, [roleVal]: roleStack },
            },
          });
        return success;
      }
    } catch (err) {
      return false;
    }
  };

  handleDelete = async (role: string, email: string): Promise<boolean> => {
    try {
      const { message, success, stack } = await fetchHandler({
        url: `${API_URL}/gig/${this.state.gigId}/callStack/remove/${role}/${email}`,
        method: "delete",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      success &&
        this.setState({
          stackTable: { ...this.state.stackTable, [role]: stack },
        });
      success &&
        this.props.setGig({
          ...this.props.gig,
          callStack: { ...this.state },
        });

      return success;
    } catch (error) {
      return false;
    }
  };

  handleSendToNext = async (role: string): Promise<boolean> => {
    try {
      const json = await fetchHandler({
        url: `${API_URL}/gig/${this.state.gigId}/callStack/sendToNext/${role}`,
        method: "post",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      json.success && this.setState({ ...this.state, ...json.callStack });
      json.success && this.props.setGig(json.gig);
      return json.success;
    } catch (error) {
      return false;
    }
  };

  render() {
    const { stackTable } = this.state;
    const roles = Object.keys(stackTable);

    return (
      <>
        <Grid
          container
          spacing={1}
          padding={2}
          item
          xs={12}
          md={5}
          lg={6}
          display="flex"
        >
          <Grid>
            <Grid container item xs={12} sx={{ marginTop: 1 }}>
              <Typography variant="h4">Band</Typography>
            </Grid>
            <Grid container item xs={12} sx={{ marginTop: 1, marginLeft: 1 }}>
              <Typography variant="body2">
                {`Below is the status of your call lists. You can add backups here. They dont have to be members of FirstCall!`}
              </Typography>
              <Typography variant="caption">
                {`Note: if your call list is empty, adding someone will immediately invite them to the gig. `}
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
                sx={{ marginTop: 1 }}
              >
                <Grid item xs={12} sm={5}>
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
                <Grid item xs={12} sm={7} pl={1}>
                  <Autocomplete
                    id="email-input"
                    freeSolo
                    openOnFocus
                    value={this.state.emailVal?.toLowerCase() ?? ""}
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
                        <Box component="li" {...props}>
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
                                  sx={{ position: "relative", left: 50 }}
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
                </Grid>
              </Grid>
            </form>
            <Grid item container xs={12}>
              {roles.length ? (
                roles.map((r, i) => (
                  <Grid item xs={6} sm={6} key={i}>
                    <Grid item xs={12} sx={{ marginTop: 1 }}>
                      <Typography variant="h6">{properize(r)}</Typography>
                      {stackTable[r].onCall !== null && (
                        <Button onClick={() => this.handleSendToNext(r)}>
                          Remove on call
                        </Button>
                      )}
                      <Typography variant="subtitle2">
                        <strong>Confirmed: </strong>
                        {stackTable[r].confirmed?.name ??
                          stackTable[r].confirmed?.email ??
                          stackTable[r].confirmed ?? <i>n/a</i>}
                      </Typography>
                      <Typography variant="subtitle2">
                        <strong>On Call: </strong>
                        {stackTable[r].onCall ?? <i>n/a</i>}
                      </Typography>
                    </Grid>
                    <List>
                      {stackTable[r].calls.map((email: string, i: number) => (
                        <React.Fragment key={i}>
                          <Box display="flex" alignItems="center">
                            <ListItemText>
                              <Typography variant="body2">
                                <strong>
                                  {i + 1}
                                  {`.)`}
                                </strong>{" "}
                                &nbsp;&nbsp; {email}
                              </Typography>
                            </ListItemText>
                            <IconButton
                              onClick={() => this.handleDelete(r, email)}
                            >
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
            </Grid>
          </Grid>
          <div style={{ float: "left", clear: "both" }} />
        </Grid>
      </>
    );
  }
}

export default CallStackEdit;
