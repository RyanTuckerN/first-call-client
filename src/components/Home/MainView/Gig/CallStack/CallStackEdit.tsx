import React, { Component } from "react";
import {
  Grid,
  Typography,
  TextField,
  IconButton,
  Button,
  List,
  ListItemText,
  Box,
} from "@mui/material";
import { Backspace } from "@mui/icons-material";
import { CallStack, Gig } from "../../../../../types/API.types";
import { properize, properizeNoTrim } from "../../../../_helpers/helpers";
import { fetchHandler } from "../../../../_helpers/fetchHandler";
import API_URL from "../../../../_helpers/environment";
import { UserCtx } from "../../../../Context/MainContext";
import { AppState } from "../../../../../App";

interface CallStackEditProps extends CallStack {
  setGig: (gig: Gig) => void;
  gig: Gig;
}

interface CallStackEditState extends CallStack {
  roleVal: string;
  emailVal: string;
  message: string;
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
      message: "",
    };
  }

  handleRole = (e: any) =>
    this.setState({ roleVal: e.target.value.toLowerCase() });

  handleEmail = (e: any) =>
    this.setState({ emailVal: e.target.value.toLowerCase() });

  handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    e.preventDefault();
    try {
      const { roleVal, emailVal } = this.state;
      if (!emailVal || !roleVal) {
        this.setState({ message: "Please fill out both fields" });
        return false;
      }
      if (this.state.stackTable[roleVal]) {
        const { success, callStack } = await fetchHandler({
          url: `${API_URL}/gig/${this.state.gigId}/callStack/addUser/${roleVal}/${emailVal}`,
          method: "post",
          auth: this.context.token ?? localStorage.getItem("token") ?? "",
        });
        // console.log(callStack, success);
        success && this.setState({ stackTable: callStack });
        return success;
      } else {
        const { success, roleStack, message } = await fetchHandler({
          url: `${API_URL}/gig/${this.state.gigId}/callStack/addRole/${roleVal}`,
          method: "post",
          body: { calls: emailVal },
          auth: this.context.token ?? localStorage.getItem("token") ?? "",
        });
        // console.log(roleStack, message);
        success &&
          this.setState({
            stackTable: { ...this.state.stackTable, [roleVal]: roleStack },
          });
        success &&
          this.props.setGig({
            ...this.props.gig,
            callStack: { ...this.state },
          });
        return success;
      }
    } catch (err) {
      console.log(err);
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
      console.log(stack, message);
      success &&
        this.setState({
          stackTable: { ...this.state.stackTable, [role]: stack },
        });
      return success;
    } catch (error) {
      console.log(error);
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
          // justifyContent="space-between"
        >
          <Grid
          >
            <Grid container item xs={12} sx={{ marginTop: 1 }}>
              <Typography variant="h4">Band</Typography>
              {/* <Button onClick={this.saveCallStackToDB}>save</Button> */}
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
              {/* <FormControl > */}
              <Grid
                item
                container
                display="flex"
                justifyContent="space-between"
                xs={12}
                sx={{ marginTop: 1 }}
              >
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    label="Role"
                    value={properizeNoTrim(this.state.roleVal)}
                    onChange={this.handleRole}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={12}>
                  <TextField
                    label="Email"
                    value={this.state.emailVal}
                    onChange={this.handleEmail}
                    fullWidth
                    InputProps={{
                      endAdornment: <Button type="submit">Add</Button>,
                    }}
                  />
                  <Typography variant="caption" color="red">
                    {/* {this.state.message} */}
                  </Typography>
                </Grid>
              </Grid>
              {/* </FormControl> */}
            </form>
            {roles.length ? (
              roles.map((r, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Grid item xs={12} sx={{ marginTop: 1 }}>
                    <Typography variant="h6">{properize(r)}</Typography>
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
          </Grid>
          <div style={{ float: "left", clear: "both" }} />
        </Grid>
      </>
    );
  }
}

export default CallStackEdit;
