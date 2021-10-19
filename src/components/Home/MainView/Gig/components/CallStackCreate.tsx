import * as React from "react";
import { Component } from "react";

interface CallStackCreateProps {}

interface CallStackCreateState {}

class CallStackCreate extends Component<
  CallStackCreateProps,
  CallStackCreateState
> {
  constructor(props: CallStackCreateProps) {
    super(props);
    // this.state = { :  };
  }
  render() {
    return (
    <div>
      Hello From CallStackCreate.tsx
    </div>)
  }
}

export default CallStackCreate;
