import React from "react";
import { AppState } from "../../../../../../App";
import { Post } from "../../../../../../types/API.types";
import { UserCtx } from "../../../../../Context/MainContext";
import { Link } from "react-router-dom";
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
  Close,
  Edit,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { returnTimeDifference } from "../../../../../_helpers/helpers";
import { fetchHandler } from "../../../../../_helpers/fetchHandler";
import API_URL from "../../../../../_helpers/environment";
import ReplyIcon from "./assets/replySmall.png";
import Arrow from "./assets/Arrow";

interface PostComponentProps {
  post: Post;
  i: number;
}

interface PostComponentState {
  isOpen: boolean;
  post: Post;
  showInput: boolean;
  replyText: string;
  editing: boolean;
  editingText: string;
}

class PostComponent extends React.Component<
  PostComponentProps,
  PostComponentState
> {
  static contextType = UserCtx;

  constructor(props: PostComponentProps, context: AppState) {
    super(props);
    this.state = {
      isOpen: true,
      post: this.props.post,
      showInput: false,
      replyText: "",
      editing: false,
      editingText: this.props.post.text,
    };
  }

  toggleOpen = (): void => this.setState({ isOpen: !this.state.isOpen });

  setPost = (post: Post): void => this.setState({ post });

  handleEdit = (): void => {
    this.setState({ showInput: true, editing: true });
  };

  handleEditSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    e.preventDefault();
    if (!this.state.editingText) return false;
    const json = await fetchHandler({
      url: `${API_URL}/board/${this.state.post.gigId}/post/${this.state.post.id}/edit`,
      method: "put",
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
      body: { text: this.state.editingText },
    });
    json.success &&
      this.setState({
        post: {
          ...this.state.post,
          text: json.post.text,
          details: json.post.details,
        },
        showInput: false,
      });
    return json.success;
  };

  handleReply = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    e.preventDefault();
    if (!this.state.replyText) return false;
    const json = await fetchHandler({
      url: `${API_URL}/board/${this.state.post.gigId}/newPost/${this.state.post.id}`,
      method: "post",
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
      body: { text: this.state.replyText },
    });
    this.setState({
      post: {
        ...this.state.post,
        children: [
          { ...json.post, user: json.user },
          ...(this.state.post?.children ?? []),
        ],
      },
      replyText: ''
    });
    this.setState({ showInput: false });
    return json.success;
  };

  handleText = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.state.editing
      ? this.setState({ editingText: e.target.value })
      : this.setState({ replyText: e.target.value });
  };

  handleLike = async (): Promise<boolean> => {
    if (this.state.post.voters.includes(this.context.user.id)) {
      const json = await fetchHandler({
        url: `${API_URL}/board/${this.state.post.gigId}/post/${this.state.post.id}/removeUpvote`,
        method: "post",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      json.success &&
        this.setState({
          post: { ...json.post, children: this.state.post.children },
        });
      return json.success;
    }

    const json = await fetchHandler({
      url: `${API_URL}/board/${this.state.post.gigId}/post/${this.state.post.id}/upvote`,
      method: "post",
      auth: this.context.token ?? localStorage.getItem("token") ?? "",
    });
    json.success &&
      this.setState({
        post: { ...json.post, children: this.state.post.children },
      });
    return json.success;
  };

  render() {
    const { post } = this.state;
    const { i } = this.props;
    const { user } = this.context;
    const defaultLineProps = {
      fontSize: "small",
      display: "flex",
    };

    return (
      <Grid
        container
        spacing={0}
        item
        sx={{
          marginTop: i === 1 ? 2 : 0,
          position: "relative",
          left: this.props.i > 1 ? 17 : 0,
          borderLeft: i > 1 ? 1 : 0,
          overflow: "hidden",
          borderColor: "divider",
        }}
        xs={12}
      >
        <Grid item xs={12} sx={defaultLineProps} marginBottom={1}>
          {this.state.post.children?.length ? (
            this.state.isOpen ? (
              <ArrowDropDown
                sx={{ padding: i === 1 ? 0 : 0.5 }}
                onClick={this.toggleOpen}
              />
            ) : (
              <ArrowRight
                sx={{ padding: i === 1 ? 0 : 0.5 }}
                onClick={this.toggleOpen}
              />
            )
          ) : (
            <ArrowRight sx={{ padding: 0.5, color: "rgba(0,0,0,0)" }} />
          )}
          <Typography variant={"subtitle2"} fontWeight={300}>
            &nbsp;
            <Link to={`/main/profile/${this.props.post.author}`}>
              {post.user?.name}
            </Link>
            &nbsp;&#183;&nbsp;
            {returnTimeDifference(
              new Date(),
              new Date(this.state.post.createdAt)
            )}
          </Typography>
          {post.details.edited && (
            <Typography variant="body2" fontWeight={300}>
              &nbsp;&nbsp;<i>edited</i>
            </Typography>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            position: "relative",
            left: 25,
            marginTop: -1,
            maxWidth: `calc(100% - (${(i - 1) * 22}px))`,
          }}
        >
          <Typography
            variant="body2"
            fontWeight={400}
            sx={{ pr: 5 }}
            style={{ wordWrap: "break-word" }}
          >
            {post.text}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            position: "relative",
            left: 12,
            display: "flex",
            alignItems: "center",
            marginTop: -1.1,
          }}
        >
          <IconButton onClick={this.handleLike}>
            {post.voters.includes(user.id) ? (
              <Arrow fillColor="#ff4500" borderColor={"#00000000"} />
            ) : (
              <Arrow fillColor="#ff450000" borderColor={this.context.darkModeOn === 'true' ? "#ffffff80" : '#00000080'} />
            )}
          </IconButton>
          <Typography variant="caption" fontFamily='monospace' fontSize={12}>
            {post.upvotes}{" "}
          </Typography>
          <IconButton
            onClick={() =>
              this.setState({
                showInput: !this.state.showInput,
                editing: false,
              })
            }
          >
            {this.state.showInput ? (
              <>
                <Close fontSize="inherit" />
                <Typography variant="caption">close</Typography>
              </>
            ) : (
              <>
                <img
                  src={ReplyIcon}
                  alt="reply-icon"
                  style={{
                    height: 15,
                    width: 20,
                    filter:
                      this.context.darkModeOn === "true"
                        ? "invert(100%) saturate(5%) hue-rotate(327deg) brightness(98%) contrast(81%)"
                        : "",
                  }}
                />
                <Typography variant="caption">reply</Typography>
              </>
            )}
          </IconButton>
          {this.context.user.id === post.author && (
            <IconButton onClick={this.handleEdit}>
              <Edit sx={{ padding: 0.6 }} color="inherit" />
            </IconButton>
          )}
        </Grid>
        {this.state.showInput ? (
          <Grid
            item
            xs={12}
            sx={{
              position: "relative",
              left: 25,
              marginTop: -1,
              maxWidth: `calc(100% - (${(i - 1) * 22}px))`,
            }}
          >
            <Box
              component="form"
              action="submit"
              id="reply-input"
              noValidate
              onSubmit={
                this.state.editing ? this.handleEditSubmit : this.handleReply
              }
            >
              <TextField
                autoFocus
                value={
                  this.state.editing
                    ? this.state.editingText
                    : this.state.replyText
                }
                onChange={this.handleText}
                style={{
                  zIndex: 9999,
                }}
                InputProps={{
                  endAdornment:
              <Button
                type="submit"
                disabled={this.state.editing ? !this.state.editingText : !this.state.replyText }
                color={this.state.editing ? "success" : "primary"}
              >
                {this.state.editing ? "SAVE" : "REPLY"}
              </Button>
                  
                  }}
              />
            </Box>
          </Grid>
        ) : null}
        <Grid item xs={12}>
          {this.state.isOpen && (
            <>
              {post.children?.length
                ? post.children.map((p) => (
                    <PostComponent post={p} key={p.id} i={i + 1} />
                  ))
                : null}
            </>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default PostComponent;
