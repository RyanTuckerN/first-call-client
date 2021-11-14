import * as React from "react";
import { Component } from "react";
import { Post } from "../../../../../../types/API.types";
import { postOrganizer } from "../../../../../_helpers/postOrganizer";
import * as _ from "lodash";
import { Button, Grid, TextField, Paper, Typography, Box } from "@mui/material";
import { Email } from "@mui/icons-material";
import PostComponent from "./Post";
import API_URL from "../../../../../_helpers/environment";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import { Loading } from "../../../../../Skeletons";

interface BoardProps {
  posts: Post[];
  gigId: string | number;
  setPosts: (posts: Post[]) => void;
  fetchPosts: () => Promise<boolean>;
}

interface BoardState {
  posts: Post[];
  emptyBoard: boolean;
  organizedPosts: Post[];
  text: string;
  showBoard: boolean;
}

class Board extends Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    this.state = {
      posts: this.props.posts,
      emptyBoard: _.isEmpty(this.props.posts),
      organizedPosts: postOrganizer(this.props.posts),
      text: "",
      showBoard: false,
    };
  }

  handleText = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ text: e.target.value });

  handleSort = (sort: "createdAt" | "upvotes"): void =>
    this.setState({
      organizedPosts: this.state.organizedPosts.sort((a, b) =>
        sort === "upvotes"
          ? b[sort] - a[sort]
          : new Date(b[sort]).getTime() - new Date(a[sort]).getTime()
      ),
    });

  handleNewPost = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    e.preventDefault();
    if (!this.state.text) return false;
    const json = await fetchHandler({
      url: `${API_URL}/board/${this.props.gigId}/newPost`,
      method: "post",
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
      body: { text: this.state.text },
    });
    this.setState({ text: "" });
    this.props.setPosts([
      ...this.state.posts,
      { ...json.post, user: json.user },
    ]);
    return json.success;
  };

  componentDidUpdate(prevProps: BoardProps, prevState: BoardState) {
    if (prevProps.posts !== this.props.posts) {
      this.setState({ organizedPosts: postOrganizer(this.props.posts) });
    }
    if (prevState.posts !== this.state.posts) {
      this.setState({ organizedPosts: postOrganizer(this.state.posts) });
    }
  }

  componentDidMount() {
    this.setState({ posts: this.props.posts });
  }

  render() {
    return this.state.posts ? (
      <Grid
        container
        item
        xs={12}
        sm={10}
        md={8}
        border={1}
        sx={{ borderColor: "#3f3f3f50" }}
      >
        <Paper
          elevation={12}
          sx={{ padding: 0.5, width: "100%", maxWidth: "100%" }}
        >
          <Grid item xs={12}>
            <Box
              action="submit"
              id="main-input"
              onSubmit={this.handleNewPost}
              component="form"
              noValidate
            >
              <Grid item xs={12} paddingX={3} paddingTop={3}>
                <TextField
                  value={this.state.text}
                  onChange={this.handleText}
                  fullWidth={true}
                  minRows={4}
                  multiline
                />
              </Grid>
              <Grid
                item
                container
                xs={12}
                display="flex"
                flexDirection="row-reverse"
              >
                <Grid
                  item
                  xs={6}
                  display="flex"
                  justifyContent="flex-end"
                  sx={{ pr: 2.2 }}
                >
                  <Button
                    type="submit"
                    sx={{ margin: 1 }}
                    color="success"
                    variant="contained"
                  >
                    POST
                  </Button>
                </Grid>
                <Grid item xs={6} display="flex" alignItems="flex-end">
                  <Button
                    variant="text"
                    onClick={() => this.handleSort("upvotes")}
                  >
                    top<sup>&#9660;</sup>
                  </Button>
                  <Button
                    variant="text"
                    onClick={() => this.handleSort("createdAt")}
                  >
                    new<sup>&#9660;</sup>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          {this.state.organizedPosts.length ? (
            <>
              <Grid
                container
                item
                xs={12}
                display="flex"
                flexDirection="column"
                sx={{
                  padding: -10,
                }}
              >
                {this.state.organizedPosts.map((p, i) => (
                  <PostComponent post={p} key={p.id} i={1} />
                ))}
              </Grid>
              <div style={{ height: 40 }} />
              <Grid item display="flex" justifyContent="center">
                <Button color="error" onClick={() => alert("abuse! abuse!")}>
                  <Email fontSize="small" />
                  <Typography variant="caption">Report abuse</Typography>
                </Button>
              </Grid>
            </>
          ) : (
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button variant="text" disabled>
                No Posts!
              </Button>
              <div style={{ height: 200 }} />
            </Grid>
          )}
        </Paper>
      </Grid>
    ) : (
      <Grid
        container
        item
        xs={12}
        sm={10}
        md={8}
        border={1}
        sx={{ borderColor: "#3f3f3f50" }}
      >
        <Paper
          elevation={12}
          sx={{ padding: 0.5, width: "100%", maxWidth: "100%" }}
        >
          <Loading />
        </Paper>
      </Grid>
    );
  }
}

export default Board;
