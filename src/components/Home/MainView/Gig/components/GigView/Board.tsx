import * as React from "react";
import { Component } from "react";
import { Post } from "../../../../../../types/API.types";
import { postOrganizer } from "../../../../../_helpers/postOrganizer";
import * as _ from "lodash";
import {
  Button,
  Grid,
  Divider,
  TextField,
  Paper,
  Typography,
} from "@mui/material";
import PostComponent from "./Post";
import API_URL from "../../../../../_helpers/environment";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
interface BoardProps {
  posts: Post[];
  gigId: string | number;
  fetchPosts: () => Promise<boolean>;
}

interface BoardState {
  posts: Post[];
  emptyBoard: boolean;
  organizedPosts: Post[];
  text: string;
}

class Board extends Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    this.state = {
      posts: this.props.posts,
      emptyBoard: !_.isEmpty(this.props.posts),
      organizedPosts: postOrganizer(this.props.posts),
      text: "",
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
    console.log(json);
    this.setState({
      posts: [...this.state.posts, { ...json.post, user: json.user }],
      text: "",
    });
    return json.success;
  };

  // handleEventListener = (): void => {
  //   window.addEventListener("keydown", this.logEvent);
  // };
  // removeEL = (): void => window.removeEventListener("keydown", this.logEvent);

  // logEvent = (e: any): void => console.log(e.key);

  componentDidUpdate(prevProps: BoardProps, prevState: BoardState) {
    if (prevProps.posts !== this.props.posts) {
      this.setState({ organizedPosts: postOrganizer(this.props.posts) });
    }
    if (prevState.posts !== this.state.posts) {
      this.setState({ organizedPosts: postOrganizer(this.state.posts) });
    }
  }

  render() {
    return (
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
          {/* <Box border={1}  sx={{borderColor: '#3f3f3f50', padding: 3}}> */}
          <Grid item xs={12}>
            <form
              action="submit"
              id="main-input"
              onSubmit={this.handleNewPost}
              // onFocus={this.handleEventListener}
              // onBlur={this.removeEL}
            >
              <Paper elevation={7}>
                <Grid item xs={12} paddingX={1.2} paddingTop={3}>
                  <TextField
                    value={this.state.text}
                    onChange={this.handleText}
                    fullWidth={true}
                    minRows={4}
                    multiline
                  />
                </Grid>
              </Paper>
              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="flex-end"
                marginBottom={-6}
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
            </form>
          </Grid>
          {/* <Divider /> */}
          {/* <div style={{height: 15}} /> */}
          {this.state.organizedPosts.length ? (
            <>
              <Grid item xs={12} display="flex" alignItems="center">
                <Typography variant="button">sort by:</Typography>
                <Button
                  variant="text"
                  sx={{ margin: 1 }}
                  onClick={() => this.handleSort("upvotes")}
                >
                  top
                </Button>
                <Button
                  variant="text"
                  sx={{ margin: 1 }}
                  onClick={() => this.handleSort("createdAt")}
                >
                  new
                </Button>
              </Grid>
              <Grid
                container
                item
                xs={12}
                display="flex"
                flexDirection="column"
                sx={{
                  padding: -10,
                  // position: "relative", left: -8,
                }}
              >
                {this.state.organizedPosts.map((p, i) => (
                  // <React.Fragment key={p.id}>
                  <PostComponent post={p} key={p.id} i={1} />
                ))}
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
          {/* </Box> */}
        </Paper>
      </Grid>
    );
  }
}

export default Board;
