import * as React from "react";
import { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router";
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
  ListItemText,
  IconButton,
  Chip,
} from "@mui/material";
import { properizeNoTrim } from "../../../../_helpers/helpers";

interface RouteParams {
  gigId: string;
}

interface CallStackCreateProps extends RouteComponentProps<RouteParams> {}

interface CallStackCreateState {
  // gigId: string | null;
  stackTable: { [key: string]: string[] };
  roles: string[];
  // activeRole: string;
  roleVal: string;
  emailVal: string;
}

class CallStackCreate extends Component<
  CallStackCreateProps,
  CallStackCreateState
> {
  constructor(props: CallStackCreateProps) {
    super(props);
    this.state = {
      // gigId: this.props.match.params.gigId,
      stackTable: {},
      roles: [],
      // activeRole: "",
      roleVal: "",
      emailVal: "",
    };
  }

  handleRole = (e: any) =>
    this.setState({ roleVal: e.target.value.toLowerCase() });
  handleEmail = (e: any) => this.setState({ emailVal: e.target.value });
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("hey");
    const obj = this.state.stackTable;
    const arr = obj[this.state.roleVal]
      ? [...obj[this.state.roleVal], this.state.emailVal]
      : [this.state.emailVal];
    // console.log(arr)
    obj[this.state.roleVal] = [...new Set(arr)];
    console.log(obj);
    this.setState({ stackTable: obj, emailVal: "" });
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
          display="flex"
          justifyContent="space-between"
        >
          <Grid item xs={12} sx={{ marginTop: 1 }}>
            <Typography variant="h4">Band</Typography>
          </Grid>
          <form
            action="submit"
            onSubmit={this.handleSubmit}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={5}>
              <TextField
                label="Role"
                value={properizeNoTrim(this.state.roleVal)}
                onChange={this.handleRole}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                value={this.state.emailVal}
                onChange={this.handleEmail}
                fullWidth
                InputProps={{
                  endAdornment: <Button type="submit">Add</Button>,
                }}
              />
            </Grid>
          </form>
          {roles.map((r, i) => (
            <React.Fragment key={i}>
              <Grid item xs={12} sx={{ marginTop: 1 }}>
                <Typography variant="h6">{properizeNoTrim(r)}</Typography>
              </Grid>
              <List>
                {stackTable[r].map((email, i) => (
                  <ListItemText key={i}>
                    <Typography  variant="body2">
                      <strong>{i+1}.)</strong> &nbsp;&nbsp; {email}
                    </Typography>
                  </ListItemText>
                ))}
              </List>
            </React.Fragment>
          ))}
        </Grid>
      </>
    );
  }
}

export default withRouter(CallStackCreate);
