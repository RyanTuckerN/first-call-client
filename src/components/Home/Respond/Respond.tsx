import * as React from "react";
import { Component } from "react";
import { Gig } from "../../../types/API.types";
import API_URL from "../../_helpers/environment";
import { fetchHandler } from "../../_helpers/fetchHandler";
import { DetailedGig } from "../MainView/Gig/Gig.types";
import { Grid } from "@mui/material";
import OpenGigInfo from "./OpenGigInfo";
import OpenInvite from "./OpenInvite";
import { properizeName } from "../../_helpers/helpers";
import Swal from "sweetalert2";
import { UserCtx } from "../../Context/MainContext";
import { AppState } from "../../../App";
import { RouteComponentProps, withRouter } from "react-router";

interface RespondProps extends RouteComponentProps {}

interface QueryParams {
  gigId: string | null;
  token: string | null;
  email: string | null;
  role: string | null;
}
interface RespondState {
  queryParams: QueryParams;
  gig: Gig | null;
  details: DetailedGig | null;
  name: string;
}

class Respond extends Component<RespondProps, RespondState> {
  static contextType = UserCtx;

  constructor(props: RespondProps, context: AppState) {
    super(props, context);
    this.state = {
      queryParams: { gigId: null, token: null, email: null, role: null },
      gig: null,
      details: null,
      name: "",
    };
  }

  returnParams = () => {
    return window.location.search
      .slice(1)
      .split("&")
      .reduce((a: any, b: string) => {
        const arr = b.split("=");
        const [key, val] = [arr[0], arr[1]];
        a[key] = val;
        return a;
      }, {});
  };

  fetchGig = async (): Promise<boolean> => {
    const json = await fetchHandler({
      url: `${API_URL}/open/${this.state.queryParams.gigId}/${this.state.queryParams.token}`,
    });
    json.success && this.setState({ gig: json.gig, details: json.details });
    return json.success;
  };

  handleRespond = async (res: "accept" | "decline"): Promise<boolean> => {
    try {
      const { name } = this.state;
      const { gigId, token, email, role } = this.state.queryParams;
      const json = await fetchHandler({
        url: `${API_URL}/open/${gigId}/${res}/${email}/${role}/${token}`,
        method: "post",
        body: { name: properizeName(name) },
      });
      console.log(properizeName(name));
      this.context.handleSnackBar(
        json.message,
        json.success ? "success" : "error"
      );
      console.log("SUCCESS: ", json.success);
      console.log("ACCEPT OR DECLINE JSON: ", json);
      json.success &&
        Swal.fire(
          res === "accept"
            ? {
                title: "Gig Accepted!",
                text: "Thanks! Consider signing up for FirstCall!",
                icon: "success",
              }
            : {
                title: "Gig Declined",
                text: "Maybe next time! Consider signing up for FirstCall!",
              }
        );
      this.props.history.push(
        res === "accept"
          ? `/auth/signup/?email=${json.confirmed.email}&first=${
              json.confirmed.name.split(" ")[0]
            }&last=${json.confirmed.name.split(" ").slice(1).join(" ")}`
          : "/auth/signup/"
      );
      return json.success;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  handleName = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ name: e.target.value });

  componentDidUpdate(prevProps: RespondProps, prevState: RespondState) {
    if (prevState.queryParams !== this.state.queryParams) {
      this.fetchGig();
    }
  }

  componentDidMount() {
    console.log(this.returnParams());
    this.setState({ queryParams: this.returnParams() });
  }

  render() {
    return (
      <Grid container>
        {this.state.details && this.state.queryParams.role && this.state.gig ? (
          <>
            <Grid item xs={12}>
              <OpenInvite
                {...this.state.gig}
                details={this.state.details}
                role={this.state.queryParams.role}
                handleRespond={this.handleRespond}
                handleName={this.handleName}
                name={this.state.name}
              />
            </Grid>
            <Grid item xs={12}>
              <OpenGigInfo gig={this.state.gig} details={this.state.details} />
            </Grid>
          </>
        ) : (
          <div>Loading</div>
        )}
      </Grid>
    );
  }
}

export default withRouter(Respond);
