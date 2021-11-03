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
  List,
  Link,
  InputAdornment,
  ListItemText,
  IconButton,
  Chip,
} from "@mui/material";
import { formControl, properizeNoTrim } from "../../../../_helpers/helpers";
import { Backspace } from "@mui/icons-material";
import { Box } from "@mui/system";
import * as _ from "lodash";
import { fetchHandler } from "../../../../_helpers/fetchHandler";
import API_URL from "../../../../_helpers/environment";
import { UserCtx } from "../../../../Context/MainContext";
import { AppState } from "../../../../../App";
import { Gig } from "../../../../../types/API.types";

interface RouteParams {
  gigId: string;
}

interface CallStackCreateProps extends RouteComponentProps<RouteParams> {
  gigId: number | null;
  setCallStackEmpty: (b:boolean) => void;
  addGig: (gig:Gig)=>void

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

  handleEmail = (e: any) => this.setState({ emailVal: e.target.value.toLowerCase() });

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
    // console.log(arr)
    obj[this.state.roleVal] = [...new Set(arr)];
    console.log(obj);
    this.setState({ stackTable: obj, emailVal: "" });
    this.props.setCallStackEmpty(false)
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
        body: {stackTable: this.state.stackTable},
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      console.log('callStack', json)
      json.success && this.context.handleSnackBar('Success!', 'success');
      json.success && this.props.setCallStackEmpty(true)
      if(json.success){
        const gig = {...json.gig, callStack: json.callStack }
        this.props.addGig(gig)
      }
    } catch (err) {
      this.context.handleSnackBar(err, 'error');
    }
  };

  //NOT WORKING COME BACK TO
  scrollToBottom = () => {
    this.callstackEnd?.scrollIntoView({ behavior: "smooth" });
  };


  componentDidMount() {
    // this.scrollToBottom();
    this.props.setCallStackEmpty(true)
  }

  componentDidUpdate(
    prevProps: CallStackCreateProps,
    prevState: CallStackCreateState
  ) {
    if (prevState.stackTable !== this.state.stackTable) {
      this.scrollToBottom();
    }
    if(prevState.stackTable !== this.state.stackTable){
      this.props.setCallStackEmpty(_.isEmpty(this.state.stackTable))
    }
    if(prevProps.gigId !== this.props.gigId && typeof this.props.gigId==='number'){
      this.saveCallStackToDB()
      // this.props.fetchDetails()
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
            {/* <Button onClick={this.saveCallStackToDB}>save</Button> */}
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
            {/* <FormControl > */}
            <Grid
              item
              container
              display="flex"
              justifyContent="space-between"
              xs={12}
              sx={{ marginTop: 1 }}
            >
              <Grid item xs={6}>
                <TextField
                  label="Instrument"
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
                <Typography variant="caption" color="red">
                  {this.state.message}
                </Typography>
              </Grid>
            </Grid>
            {/* </FormControl> */}
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
                      <Box display="flex" alignItems='center'>
                        <ListItemText key={i}>
                          <Typography variant="body2">
                            <strong>{i + 1}{`.)`}</strong> &nbsp;&nbsp; {email}
                          </Typography>
                        </ListItemText>
                        <IconButton onClick={()=>this.handleDelete(r, email)}>
                          <Backspace color='error' />
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
