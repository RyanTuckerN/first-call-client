import { Component } from "react";
import CallStackCreate from "./CallStack/CallStackCreate";
import { Grid } from "@mui/material";
import { Gig, User } from "../../../../types/API.types";
import GigEdit from "./components/GigView/GigEdit";

interface GigCreateProps extends User {
  addGig: (gig: Gig) => void;
  fetchDetails: () => Promise<void>;
  setMainState: (key: string, value: any) => void;
  followInfo: any[];
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

  componentDidMount() {
    this.props.setMainState("dashboardRoute", "notifications");
  }

  setCallStackEmpty = (b: boolean) => this.setState({ callStackEmpty: b });
  setGigId = (n: number) => this.setState({ gigId: n });

  render() {
    return (
      <Grid container>
        <Grid item xs={12} lg={6}>
          <GigEdit
            gigCreate={true}
            setGigId={this.setGigId}
            callStackEmpty={this.state.callStackEmpty}
            addGig={this.props.addGig}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <CallStackCreate
            setCallStackEmpty={this.setCallStackEmpty}
            gigId={this.state.gigId}
            addGig={this.props.addGig}
            followInfo={this.props.followInfo}
          />
        </Grid>
      </Grid>
    );
  }
}

export default GigCreate;
