import * as React from "react";
import { Component } from "react";
import CallStackCreate from "./CallStack/CallStackCreate";
import {Grid} from '@mui/material'
import { User } from "../../../../types/API.types";
import GigEdit from "./components/GigView/GigEdit";
import { WindowDimensions } from "../../Home.types";

interface GigCreateProps extends User {
  windowDimensions: WindowDimensions;
}

interface GigCreateState {
  callStackEmpty: boolean;
  gigId: number | null;
}

class GigCreate extends Component<GigCreateProps, GigCreateState> {
  constructor(props: GigCreateProps) {
    super(props);
    this.state = { callStackEmpty: true, gigId: null };
  }

  setCallStackEmpty = (b: boolean) => this.setState({ callStackEmpty: b });
  setGigId = (n: number) => this.setState({ gigId: n });

  render() {
    return (
      <Grid container >
        <Grid item xs={12} lg={6}>
          <GigEdit
            windowDimensions={this.props.windowDimensions}
            gigCreate={true}
            setGigId={this.setGigId}
            callStackEmpty={this.state.callStackEmpty}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CallStackCreate
            setCallStackEmpty={this.setCallStackEmpty}
            gigId={this.state.gigId}
          />
        </Grid>
      </Grid>
    );
  }
}

export default GigCreate;
