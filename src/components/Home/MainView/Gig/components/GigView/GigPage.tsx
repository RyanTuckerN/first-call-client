import { Grid, Paper, Container } from "@mui/material";
import { Component } from "react";
import { Gig, Post, User } from "../../../../../../types/API.types";
import Board from "./Board";
import GigHeader from "./GigHeader";
import GigInfo from "./GigInfo";
import GigEdit from "./GigEdit";
import {
  RouteComponentProps,
  withRouter,
  Redirect,
  Route,
} from "react-router-dom";
import { DetailedGig } from "../../Gig.types";
import GigInvite from "../GigInvite";
import { UserCtx } from "../../../../../Context/MainContext";
import { AppState } from "../../../../../../App";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";
import CallStackEdit from "../../CallStack/CallStackEdit";

interface RouteParams {
  gigId: string;
}

interface GigPageProps extends RouteComponentProps<RouteParams> {
  detailsHash: { [key: string]: DetailedGig };
  offers: Gig[];
  gigs: Gig[];
  user: User;
  followInfo: any[];
  addGig: (gig: Gig) => void;
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

  setGig = (gig: Gig): void => this.setState({ gig });

  fetchPosts = async (): Promise<boolean> => {
    const json = await fetchHandler({
      url: `${API_URL}/board/${this.state.gigId}`,
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
    });
    json.success && this.setState({ posts: json.posts });
    return json.success;
  };

  setPosts = (posts: Post[]):void => this.setState({posts})

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
    prevProps.gigs !== this.props.gigs &&
      this.setState({
        gig:
          [...this.props.gigs, ...this.props.offers].filter(
            (g) => g.id.toString() === this.state.gigId
          )[0] ?? null,
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
              <Container maxWidth={"xl"} sx={{ minHeight: "100%" }}>
                <Paper
                  sx={{
                    padding: 2,
                    marginBottom: 2,
                    zIndex: 1,
                  }}
                >
                  <Grid container>
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
                      justifyContent="center"
                      flexWrap={
                        this.state.gig?.openCalls.includes(
                          this.props.user.email
                        )
                          ? "wrap-reverse"
                          : "wrap"
                      }
                    >
                      <div
                        id="gig-anchor"
                        style={{ position: "relative", bottom: 300 }}
                      />
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
                          toggleEditMode={this.toggleEditMode}
                        />
                      ) : null}

                      {this.state.gig ? (
                        this.state.gig.openCalls.includes(
                          this.props.user.email
                        ) && this.state.details ? (
                          <Grid
                            container
                            item
                            xs={12}
                            display="flex"
                            justifyContent="center"
                            sx={{ marginTop: 3 }}
                          >
                            <GigInvite
                              {...this.state.gig}
                              addGig={this.props.addGig}
                              user={this.props.user ?? this.context.user}
                              details={this.state.details}
                              setGig={this.setGig}
                            />
                          </Grid>
                        ) : !this.state.editMode && this.state.posts ? (
                          <Grid
                            container
                            item
                            xs={12}
                            display="flex"
                            justifyContent="center"
                            sx={{ my: 3 }}
                          >
                            <Board
                              posts={this.state.posts}
                              fetchPosts={this.fetchPosts}
                              gigId={this.state.gigId}
                              setPosts={this.setPosts}
                            />
                          </Grid>
                        ) : this.state.gig.callStack && this.state.editMode ? (
                          <CallStackEdit
                            {...this.state.gig.callStack}
                            followInfo={this.props.followInfo}
                            setGig={this.setGig}
                            gig={this.state.gig}
                          />
                        ) : null
                      ) : null}
                    </Grid>
                  </Grid>
                </Paper>
              </Container>
            );
          }}
        />
      </>
    );
  }
}

export default withRouter(GigPage);
