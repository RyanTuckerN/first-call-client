import * as React from "react";
import { Component } from "react";
import { Post } from "../../../../../../types/API.types";
import { postOrganizer } from "../../../../../_helpers/postOrganizer";
import * as _ from "lodash";
import { Button, Grid, Divider, TextField } from "@mui/material";
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
      emptyBoard: !_.isEmpty(this.props.posts.length),
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

  handleNewPost = async (): Promise<boolean> => {
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
      <Grid container display="flex" justifyContent="space-between">
        <Grid item xs={12}>
          <TextField
            value={this.state.text}
            onChange={this.handleText}
            fullWidth={true}
            minRows={4}
            multiline
          />
        </Grid>
        <Grid item xs={8}>
          <Button
            variant="outlined"
            sx={{ margin: 1 }}
            onClick={() => this.handleSort("upvotes")}
          >
            top
          </Button>
          <Button
            variant="outlined"
            sx={{ margin: 1 }}
            onClick={() => this.handleSort("createdAt")}
          >
            new
          </Button>
        </Grid>
        <Grid item xs={4} textAlign="end">
          <Button
            sx={{ margin: 1 }}
            color="success"
            variant="contained"
            onClick={() => this.handleNewPost()}
          >
            POST
          </Button>
        </Grid>
        <Grid container>
          {this.state.organizedPosts.map((p, i) => (
            <React.Fragment key={p.id}>
              <PostComponent
                post={p}
                key={p.id}
                i={1}
                fetchPosts={this.props.fetchPosts}
              />
              {/* {i < this.state.organizedPosts.length ? <Divider /> : null} */}
            </React.Fragment>
          ))}
        </Grid>
      </Grid>
    );
  }
}

export default Board;
