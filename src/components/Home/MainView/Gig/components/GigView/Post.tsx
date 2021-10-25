import React from "react";
import { AppState } from "../../../../../../App";
import { Post } from "../../../../../../types/API.types";
import { UserCtx } from "../../../../../Context/MainContext";
import {
  Typography,
  Grid,
  Box,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import {
  ArrowDropDown,
  ArrowRight,
  ArrowCircleUp,
  Reply,
  Close,
} from "@mui/icons-material";
import { returnTimeDifference } from "../../../../../_helpers/helpers";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";

interface PostComponentProps {
  post: Post;
  i: number;
  fetchPosts: () => Promise<boolean>;
}

interface PostComponentState {
  isOpen: boolean;
  post: Post;
  showInput: boolean;
  replyText: string;
}

class PostComponent extends React.Component<
  PostComponentProps,
  PostComponentState
> {
  static contextType = UserCtx;
  // context!: React.ContextType<typeof UserCtx>;

  constructor(props: PostComponentProps, context: AppState) {
    super(props);
    this.state = {
      isOpen: true,
      post: this.props.post,
      showInput: false,
      replyText: "",
    };
  }

  toggleOpen = (): void => this.setState({ isOpen: !this.state.isOpen });

  setPost = (post: Post): void => this.setState({ post });

  handleReply = async (): Promise<boolean> => {
    if (!this.state.replyText) return false;
    const json = await fetchHandler({
      url: `${API_URL}/board/${this.state.post.gigId}/newPost/${this.state.post.id}`,
      method: "post",
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
      body: { text: this.state.replyText },
    });
    console.log(json);
    // if(json.success){
    //   const arr = this.state.post.children ? [...this.state.post.children, json.post] : [json.post]
    //   const post = {...this.state.post, children: arr}
    //   this.setState({post})
    // }
    this.setState({
      post: {
        ...this.state.post,
        children: [
          ...(this.state.post?.children ?? []),
          { ...json.post, user: json.user },
        ],
      },
    });
    this.setState({ showInput: false });
    return json.success;
  };

  handleText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ replyText: e.target.value });
  };

  handleLike = async (): Promise<boolean> => {
    if (this.state.post.voters.includes(this.context.user.id)) {
      const json = await fetchHandler({
        url: `${API_URL}/board/${this.state.post.gigId}/post/${this.state.post.id}/removeUpvote`,
        method: "post",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      console.log(json);
      json.success &&
        this.setState({
          post: { ...json.post, children: this.state.post.children },
        });
      // json.success && this.props.fetchPosts()
      return json.success;
    }

    const json = await fetchHandler({
      url: `${API_URL}/board/${this.state.post.gigId}/post/${this.state.post.id}/upvote`,
      method: "post",
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
    });
    console.log(json);
    json.success &&
      this.setState({
        post: { ...json.post, children: this.state.post.children },
      });
    // json.success && this.props.fetchPosts()
    return json.success;
  };

  render() {
    const { post } = this.state;
    const { i } = this.props;
    const { user } = this.context;
    const defaultLineProps = {
      fontSize: "small",
      display: "flex",
      // marginTop:
    };

    return (
      <Grid container spacing={0} item sx={{ position: "relative", left: this.props.i > 1 ? 30 : 0 }}>
        {/* FIRST LINE */}
        <Grid item xs={12} sx={defaultLineProps}>
          {this.state.post.children?.length ? (
            this.state.isOpen ? (
              <ArrowDropDown sx={{ padding: 0.5 }} onClick={this.toggleOpen} />
            ) : (
              <ArrowRight sx={{ padding: 0.5 }} onClick={this.toggleOpen} />
            )
          ) : (
            <ArrowRight
              sx={{ padding: 0.5, color: "rgba(0,0,0,0)" }}
            />
          )}
          <Typography variant="body2" fontWeight={300}>
            {post.user?.name}&#183;
            {returnTimeDifference(
              new Date(),
              new Date(this.state.post.createdAt)
            )}
          </Typography>
        </Grid>
        {/* SECOND LINE */}
        <Grid
          item
          xs={12}
          sx={{ position: "relative", left: 25, marginTop: -1 }}
        >
          <Typography variant="body2" fontWeight={400}>
            {post.text}
          </Typography>
        </Grid>
        {/* THIRD LINE */}
        <Grid
          item
          xs={12}
          sx={{
            position: "relative",
            left: 25,
            display: "flex",
            alignItems: "center",
            marginTop: -1.1,
          }}
        >
          <Typography fontSize={15}>{post.upvotes}</Typography>
          <IconButton onClick={this.handleLike}>
            <ArrowCircleUp
              fontSize="inherit"
              color={post.voters.includes(user.id) ? "success" : undefined}
            />
          </IconButton>
          ...
          <IconButton
            onClick={() => this.setState({ showInput: !this.state.showInput })}
          >
            {this.state.showInput ? (
              <Close fontSize="inherit" />
            ) : (
              <Reply fontSize="inherit" />
            )}
          </IconButton>
        </Grid>
        {this.state.showInput ? (
          <Grid>
            <TextField
              value={this.state.replyText}
              onChange={this.handleText}
            />
            <Button onClick={this.handleReply}>Reply</Button>
          </Grid>
        ) : null}
        {this.state.isOpen && (
          <>
            {post.children?.length
              ? post.children.map((p) => (
                  <PostComponent
                    post={p}
                    key={p.id}
                    i={i + 1}
                    fetchPosts={this.props.fetchPosts}
                  />
                ))
              : null}
          </>
        )}
      </Grid>
    );
  }
}

export default PostComponent;
