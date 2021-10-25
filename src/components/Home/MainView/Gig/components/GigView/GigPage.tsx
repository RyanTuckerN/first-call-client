import { Grid, Paper } from "@mui/material";
import * as React from "react";
import { Component } from "react";
// import { RouteComponentProps, withRouter } from 'react-router';
import { Gig, Post, User } from "../../../../../../types/API.types";
import { GigIndexState } from "../../GigsIndex";
import Board from "./Board";
import GigHeader from "./GigHeader";
import GigInfo from "./GigInfo";
import GigEdit from "./GigEdit";
import {
  RouteComponentProps,
  withRouter,
  Redirect,
  Route,
  NavLink,
} from "react-router-dom";
import { DetailedGig } from "../../Gig.types";
import CallStackCreate from "../../CallStack/CallStackCreate";
import GigInvite from "../GigInvite";
import { UserCtx } from "../../../../../Context/MainContext";
import { AppState } from "../../../../../../App";
import { posts } from "../../../../../_helpers/postOrganizer";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";

interface RouteParams {
  gigId: string;
}

interface GigPageProps extends RouteComponentProps<RouteParams> {
  detailsHash: { [key: string]: DetailedGig };
  offers: Gig[];
  gigs: Gig[];
  user: User;
}

export interface GigPageState {
  authorizedView: boolean;
  editMode: boolean;
  gigId: string | number;
  details: DetailedGig | null;
  gig: Gig | null;
  posts: Post[];
}

class GigPage extends Component<GigPageProps, GigPageState> {
  static contextType = UserCtx;
  constructor(props: GigPageProps, context: AppState) {
    super(props, context);
    this.state = {
      gig: null,
      gigId: this.props.match.params.gigId,
      details: null,
      authorizedView: false,
      editMode: false,
      posts: [],
    };
  }
  setAuthorizedView = (b: boolean) => this.setState({ authorizedView: b });

  // gigInfoProps = {
  //   user: this.props.user,
  //   authorizedView: this.state.authorizedView,
  //   editMode: this.state.editMode,
  //   gigId: this.state.gigId,
  //   setAuth: this.setAuthorizedView
  // }

  setGig = (gig: Gig): void => this.setState({ gig });

  fetchPosts = async (): Promise<boolean> => {
    const json = await fetchHandler({
      url: `${API_URL}/board/${this.state.gigId}`,
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
    });
    console.log(json);
    json.success && this.setState({ posts: json.posts });
    return json.success;
  };

  toggleEditMode = (): void =>
    this.setState({ editMode: !this.state.editMode });

  componentDidUpdate(prevProps: GigPageProps, prevState: GigPageState) {
    prevProps.detailsHash !== this.props.detailsHash &&
      this.setState({
        details: this.props.detailsHash[this.state.gigId],
      });

    prevProps !== this.props &&
      this.setState({
        authorizedView: this.state.gig?.ownerId === this.props.user.id,
      });
  }

  componentDidMount() {
    this.fetchPosts();
    this.setState({
      details: this.props.detailsHash[this.props.match.params.gigId],
      authorizedView: this.state.gigId === this.state.gig?.id.toString(),
      gig:
        [...this.props.gigs, ...this.props.offers].filter(
          (g) => g.id.toString() === this.state.gigId
        )[0] ?? null,
    });
  }

  render() {
    return (
      <>
        <Route
          exact
          path={`/main/gig/${this.state.gig?.id ?? 0}/`}
          render={() => {
            return ![...this.props.gigs, ...this.props.offers]
              .map((g) => g.id)
              .includes(this.state.gig?.id ?? 0) ? (
              <Redirect to="" />
            ) : (
              <Grid 
                container 
                // sx={{backgroundColor: 'red'}}
              >
                {/* Hello From GigPage.tsx! */}
                {this.state.gig && (
                  <GigHeader
                    {...this.state}
                    gig={this.state.gig}
                    toggleEditMode={this.toggleEditMode}
                  />
                )}
                <Grid
                container
                  display="flex"
                  flexWrap={
                    this.state.gig?.openCalls.includes(this.props.user.email)
                      ? "wrap-reverse"
                      : "wrap"
                  }
                >
                  {/* <Grid item xs={12} sx={{ marginTop: 3 }}> */}
                    {/* <Paper elevation={12} sx={{ }}> */}
                    {this.state.details &&
                    !this.state.editMode &&
                    this.state.gig ? (
                      <GigInfo
                        {...{
                          user: this.props.user,
                          authorizedView: this.state.authorizedView,
                          editMode: this.state.editMode,
                          gigId: this.state.gigId,
                          setAuth: this.setAuthorizedView,
                          posts: this.state.posts,
                        }}
                        toggleEditMode={this.toggleEditMode}
                        details={this.state.details}
                        gig={this.state.gig}
                      />
                    ) : this.state.details &&
                      this.state.editMode &&
                      this.state.gig ? (
                      <GigEdit
                        {...this.state.gig}
                        details={this.state.details}
                        setGig={this.setGig}
                      />
                    ) : null}
                    {/* </Paper> */}
                  {/* </Grid> */}
                  <Grid container item xs={12} display='flex' justifyContent='center' sx={{ marginTop: 3}}>
                    {/* <CallStackCreate /> */}
                    {this.state.gig ? (
                      this.state.gig.openCalls.includes(
                        this.props.user.email
                      ) && this.state.details ? (
                        <GigInvite
                          {...this.state.gig}
                          user={this.props.user ?? this.context.user}
                          details={this.state.details}
                          setGig={this.setGig}
                        />
                      ) : !this.state.editMode && this.state.posts ? (
                        <Board
                          posts={this.state.posts}
                          fetchPosts={this.fetchPosts}
                          gigId={this.state.gigId}
                        />
                      ) : <div>loading</div>
                    ) : null}
                  </Grid>
                </Grid>
              </Grid>
            );
          }}
        />
      </>
    );
  }
}

export default withRouter(GigPage);
