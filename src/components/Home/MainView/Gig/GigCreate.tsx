import * as React from "react";
import { Component } from "react";
import CallStackCreate from "./CallStack/CallStackCreate";
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
      <div>
        <GigEdit
          windowDimensions={this.props.windowDimensions}
          gigCreate={true}
          setGigId={this.setGigId}
          callStackEmpty={this.state.callStackEmpty}
        />
        <CallStackCreate
          setCallStackEmpty={this.setCallStackEmpty}
          gigId={this.state.gigId}
        />
      </div>
    );
  }
}

export default GigCreate;
