import * as React from "react";
import {
  Button,
  Divider,
  Grid,
  Paper,
  Popover,
  TextField,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { OpenInNew, SentimentSatisfied } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Link } from "react-router-dom";
import { Story } from "../../../types/API.types";
import { AppState } from "../../../App";
import { fetchHandler } from "../../_helpers/fetchHandler";
import API_URL from "../../_helpers/environment";
import { UserCtx } from "../../Context/MainContext";
import { Box } from "@mui/system";
import { returnTimeDifference } from "../../_helpers/helpers";
import Picker from "emoji-picker-react";
import "./emojiPicker.css";

interface StoryCardProps extends Story {
  dashboard?: boolean;
  // handleLike: (id: number) => Promise<boolean>;
  // author: { name: string; photo: string };
}

interface StoryCardState extends Story {
  storyPostText: string;
  author: { name: string; photo: string; id: number };
  anchorEl: HTMLButtonElement | null;
}

class StoryCard extends React.Component<StoryCardProps, StoryCardState> {
  static contextType = UserCtx;

  constructor(props: StoryCardProps, context: AppState) {
    super(props, context);
    this.state = {
      ...this.props,
      storyPostText: "",
      author: this.props.user,
      anchorEl: null,
    };
  }

  handlePickerClose = () => this.setState({ anchorEl: null });
  handlePicker = (event: React.MouseEvent<HTMLButtonElement>) =>
    this.setState({ anchorEl: event.currentTarget });

  handlePick = (e: any, emoji: any): void => {
    this.setState({
      storyPostText: this.state.storyPostText + emoji.emoji,
      anchorEl: null,
    });
  };

  handleLike = async (): Promise<boolean> => {
    try {
      const { story, success, message } = await fetchHandler({
        url: `${API_URL}/story/vote/${this.state.id}`,
        method: "post",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      success && this.setState({ ...this.state, ...story });
      console.log(message);
      return success;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  handleReplyText = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ storyPostText: e.target.value });

  handleNewPost = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    e.preventDefault();
    try {
      const text = this.state.storyPostText;
      const { success, post, message } = await fetchHandler({
        url: `${API_URL}/story/${this.state.id}/post`,
        body: { text },
        method: "post",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      success &&
        this.setState({
          posts: [
            ...(this.state.posts ?? []),
            { ...post, user: { ...this.context.user } },
          ],
          storyPostText: "",
        });
      return success;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  handlePostLike = async (postId: number): Promise<boolean> => {
    try {
      const { success, post, message } = await fetchHandler({
        url: `${API_URL}/story/${this.state.id}/post/${postId}`,
        method: "post",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      console.log(post);
      // alert(message)
      if (success) {
        const newPosts = [...this.state.posts!];
        newPosts[newPosts.map((p) => p.id).indexOf(post.id)] = post;
        this.setState({ posts: newPosts });
      }
      return success;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  componentDidUpdate(prevProps: StoryCardProps, prevState: StoryCardState) {
    this.context.darkModeOn === "true" && require("./Dark.css");
    prevState?.posts === null &&
      !!this.state.posts &&
      this.setState({
        posts: [
          ...this.state.posts.sort((a, b) => b.voters.length - a.voters.length),
        ],
      });
  }

  componentDidMount() {}

  render() {
    const {
      createdAt,
      text,
      imageUrl,
      likers,
      author,
      posts,
      storyPostText,
      id,
      anchorEl,
    } = this.state;

    const d = new Date(createdAt);
    const pickerOpen = !!anchorEl;
    const menuId = pickerOpen ? "emoji-picker-for-story-comment" : undefined;

    return (
      <Grid 
      container 
      border={1} 
      borderColor="divider"
      >
        <Paper
          sx={
            this.props.dashboard
              ? {
                  width: "100%",
                  p: 0.5,
                  maxHeight: 200,
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "100%",
                  backgroundBlendMode: "soft-light",
                }
              : { width: "100%", maxWidth: 720, minWidth: 250, p: 1, pb: 2 }
          }
          elevation={0}
        >
          <Grid container>
            <Grid
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ width: "100%", height: 35 }}
            >
              <Link to={`/main/profile/${author.id}`}>
                <Grid display="flex" alignItems="center">
                  <Avatar
                    src={author?.photo}
                    sx={{ ml: 1, height: 30, width: 30 }}
                  />
                  <Typography sx={{ ml: 1 }} variant="caption">
                    {author?.name}
                  </Typography>
                </Grid>
              </Link>
              <Link to={`/story/${id}`}>
                <OpenInNew fontSize="small" />
              </Link>
            </Grid>
            <Grid container display="flex" justifyContent="center">
              <Link to={`/story/${id}`}>
                <Box
                  component="img"
                  src={imageUrl}
                  alt={text}
                  style={{
                    objectFit: "cover",
                    height: "100%",
                    width: "100%",
                    display: this.props.dashboard ? "none" : "",
                  }}
                />
              </Link>
            </Grid>
          </Grid>
          <Grid
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
            container
          >
            <Grid item xs={6}>
              <IconButton onClick={this.handleLike}>
                {likers.includes(this.context.user.id) ? (
                  <FavoriteIcon
                    fontSize="small"
                    sx={{ color: "error.light" }}
                  />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </IconButton>
              <Typography sx={{ mb: 0.2667 }} variant="caption">
                {!!likers.length &&
                  `${likers.length} ${
                    likers.length === 1
                      ? "person likes this."
                      : likers.length
                      ? "people like this."
                      : null
                  }`}
              </Typography>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="flex-end" pr={2}>
              <Typography variant={"caption"}>
                <i>
                  {returnTimeDifference(new Date(createdAt), new Date())} ago
                </i>
              </Typography>
            </Grid>
            <Grid item xs={12} ml={0.2667}>
              <Link to={`/main/profile/${author.id}`}>
                <Typography display="inline" variant="subtitle2">
                  {author?.name}
                </Typography>
              </Link>
              <Typography
                display="inline"
                variant="body2"
                fontWeight={300}
                sx={{ ml: 1 }}
              >
                <>{text}</>
              </Typography>
            </Grid>
            {posts
              ? posts.length > 1 && (
                  <Link to={`/story/${id}`}>
                    <Typography variant="body2" ml={2} fontWeight={300}>
                      <i>{`View all ${posts.length} comments.`}</i>
                    </Typography>
                  </Link>
                )
              : null}
            {posts
              ? posts
                  // .sort((a, b) => b.voters.length - a.voters.length)
                  .slice(0, 1)
                  .map((post) => (
                    <Grid
                      item
                      container
                      key={post.id}
                      xs={12}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      ml={0.2667}
                    >
                      <Grid>
                        <Link to={`/main/profile/${post.user?.id}`}>
                          <Typography display="inline" variant="subtitle2">
                            {post.user?.name}
                          </Typography>
                        </Link>
                        <Typography
                          display="inline"
                          variant="body2"
                          fontWeight={300}
                          sx={{ ml: 1 }}
                        >
                          {post.text.length > 250
                            ? post.text.slice(0, 200)
                            : post.text}
                          <Link to={`/story/${id}`}>
                            <strong> &nbsp;...</strong>
                          </Link>
                        </Typography>
                      </Grid>
                      <Grid>
                        <IconButton
                          onClick={() => this.handlePostLike(post.id)}
                        >
                          {post.voters.includes(this.context.user.id) ? (
                            <FavoriteIcon
                              sx={{
                                height: 13,
                                width: 13,
                                color: "error.light",
                              }}
                              color="error"
                            />
                          ) : (
                            <FavoriteBorderIcon
                              sx={{ height: 13, width: 13 }}
                            />
                          )}
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))
              : null}
            <Divider sx={{ width: "100%", mt: 1 }} />
            <Grid
              display="flex"
              alignItems="center"
              ml={0.2667}
              sx={{ width: "100%" }}
            >
              <Box
                component="form"
                onSubmit={this.handleNewPost}
                sx={{ width: "100%" }}
              >
                <TextField
                  InputProps={{
                    disableUnderline: true,
                    sx: { fontWeight: 300 },
                    fullWidth: true,
                    startAdornment: (
                      <IconButton onClick={this.handlePicker}>
                        <SentimentSatisfied
                          fontSize="small"
                          sx={{ marginRight: 0, marginLeft: 0 }}
                        />
                      </IconButton>
                    ),
                    endAdornment: (
                      <Button
                        disabled={!Boolean(this.state.storyPostText)}
                        type="submit"
                      >
                        POST
                      </Button>
                    ),
                  }}
                  variant="standard"
                  size="small"
                  placeholder=" add a comment"
                  value={storyPostText}
                  onChange={this.handleReplyText}
                  fullWidth
                />
              </Box>
            </Grid>
          </Grid>
          <Popover
            onClose={this.handlePickerClose}
            open={pickerOpen}
            id={menuId}
            anchorEl={anchorEl}
            className={this.context.darkModeOn === "true" ? "emoji-dark" : ""}
            transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Picker
              onEmojiClick={this.handlePick}
              preload={false}
              groupVisibility={{
                flags: false,
                animals_nature: false,
                food_drink: false,
                travel_places: false,
                activities: false,
                objects: false,
                symbols: false,
              }}
            />
          </Popover>
        </Paper>
      </Grid>
    );
  }
}

export default StoryCard;
