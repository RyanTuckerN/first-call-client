import React from "react";
import {
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListSubheader,
  Paper,
  TextField,
  Dialog,
  Popover,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import {
  CancelOutlined,
  Delete,
  KeyboardReturn,
  SentimentSatisfied,
} from "@mui/icons-material";
import API_URL from "../../_helpers/environment";
import Picker from "emoji-picker-react";
import Swal from "sweetalert2";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { returnTimeDifference, smallImage } from "../../_helpers/helpers";
import { Box } from "@mui/system";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import { AppState } from "../../../App";
import { Story } from "../../../types/API.types";
import { UserCtx } from "../../Context/MainContext";
import { fetchHandler } from "../../_helpers/fetchHandler";
import "./Stories.css";
import "./Dark.css";

interface StoryComponentProps extends RouteComponentProps {
  storyId: number;
  story: Story;
}

interface StoryComponentState extends Story {
  storyPostText: string;
  showImage: boolean;
  anchorEl: HTMLButtonElement | null;
  photoDialogOpen: boolean;
}

class StoryComponent extends React.Component<
  StoryComponentProps,
  StoryComponentState
> {
  static contextType = UserCtx;
  messagesEndRef = React.createRef<HTMLDivElement>();

  constructor(props: StoryComponentProps, context: AppState) {
    super(props, context);
    this.state = {
      ...this.props.story,
      storyPostText: "",
      showImage: true,
      photoDialogOpen: false,
      anchorEl: null,
    };
  }

  scrollToBottom = (): void =>
    this.messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  handlePickerClose = () => this.setState({ anchorEl: null });
  handlePicker = (event: React.MouseEvent<HTMLButtonElement>) =>
    this.setState({ anchorEl: event.currentTarget });

  handlePick = (e: any, emoji: any): void => {
    this.setState({
      storyPostText: this.state.storyPostText + emoji.emoji,
      anchorEl: null,
    });
  };

  handleDelete = async (storyId: number): Promise<boolean> => {
    try {
      const { result, success, message } = await fetchHandler({
        url: `${API_URL}/story/${storyId}`,
        method: "delete",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      success &&
        Swal.fire({
          title: "Story Deleted",
          icon: "success",
          customClass: {
            container:
              this.context.darkModeOn === "true" ? "dark-mode-swal" : "",
          },
        });
      success &&
        this.props.history.push(
          `/main/profile/${this.context.user.id ?? this.state.userId}`
        );
      return success;
    } catch (error) {
      return false;
    }
  };

  handleLike = async (): Promise<boolean> => {
    try {
      const { story, success, message } = await fetchHandler({
        url: `${API_URL}/story/vote/${this.state.id}`,
        method: "post",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      success && this.setState({ ...this.state, ...story });
      return success;
    } catch (error) {
      return false;
    }
  };

  handleReplyText = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ storyPostText: e.target.value });

  handleNewPost = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    e.preventDefault();
    if (!this.state.storyPostText) return false;
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

  togglePhoto = (): void => this.setState({ showImage: !this.state.showImage });

  componentDidUpdate(
    prevProps: StoryComponentProps,
    prevState: StoryComponentState
  ) {
    this.context.darkModeOn === "true" && require("./Dark.css");
    prevState?.imageUrl !== this.state?.imageUrl &&
      this.setState({ showImage: true });
    prevState?.posts === null &&
      !!this.state.posts &&
      this.setState({
        posts: [
          ...this.state.posts.sort((a, b) => b.voters.length - a.voters.length),
        ],
      });
    prevState?.posts?.length < this.state?.posts?.length &&
      this.scrollToBottom();
    prevState?.storyPostText === null && this.setState({ storyPostText: "" });
  }

  render() {
    if (!this.state) return <div>loading</div>;
    const {
      createdAt,
      text,
      imageUrl,
      likers,
      user,
      posts,
      storyPostText,
      showImage,
      anchorEl,
      id,
    } = this.state;

    const d = new Date(createdAt);
    const pickerOpen = !!anchorEl;
    const menuId = pickerOpen ? "emoji-picker-for-story-comment" : undefined;

    return (
      <Container
        maxWidth={"xl"}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Paper sx={{ width: "100%", minWidth: 320, mb: 3 }} elevation={4}>
          <Grid container border={1} borderColor="divider">
            <Grid
              container
              item
              xs={12}
              md={12}
              lg={8}
              display={showImage ? "flex" : "none"}
              justifyContent="center"
              bgcolor={this.context.darkModeOn === "true" ? "black" : "white"}
            >
              <img
                id="click-to-zoom"
                src={imageUrl}
                alt={text}
                onClick={() => this.setState({ photoDialogOpen: true })}
                style={{
                  objectFit: "cover",
                  alignSelf: "center",
                  height: "100",
                  width: "100%",
                  maxHeight: "75vh",
                }}
              />
              <Dialog
                open={this.state?.photoDialogOpen ?? false}
                fullWidth
                maxWidth="xl"
                onClose={() => this.setState({ photoDialogOpen: false })}
                sx={{ overflow: "auto" }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  <IconButton
                    onClick={() => this.setState({ photoDialogOpen: false })}
                  >
                    <CancelOutlined />
                  </IconButton>
                </Box>
                <img
                  src={imageUrl}
                  alt={text}
                  onClick={() => this.setState({ photoDialogOpen: true })}
                  style={{
                    height: "100",
                    width: "100%",
                  }}
                />
              </Dialog>
            </Grid>

            <Grid
              display="block"
              sx={{
                width: "100%",
                height: { xs: "", lg: "75vh" },
                alignSelf: "flex-start",
                position: "relative",
              }}
              container
              item
              xs={12}
              md={12}
              lg={showImage ? 4 : 12}
            >
              <Grid container item xs={12} sx={{ position: "relative" }}>
                <List
                  sx={{
                    bgcolor: "grey[200]",
                    height: "100%",
                    width: "100%",
                    maxHeight: "71vh",
                    overflowY: "auto",
                    pt: 0,
                    p: 0,
                  }}
                >
                  <ListSubheader
                    sx={{ mt: 0, p: 0, width: "100%", lineHeight: 0 }}
                  >
                    <Grid item xs={12} display="flex" justifyContent="flex-end">
                      {!showImage && (
                        <IconButton
                          onClick={() => this.setState({ showImage: true })}
                        >
                          <CancelOutlined />
                        </IconButton>
                      )}
                    </Grid>
                    <Grid p={1} container display="flex">
                      <Grid item xs={12} ml={0.2667}>
                        <Link to={`/main/profile/${user.id}`}>
                          <Avatar
                            src={smallImage(user?.photo ?? "")}
                            alt={user.name}
                            sx={{ mx: 1, height: 70, width: 70, float: "left" }}
                          />
                          <Typography display="inline" variant="subtitle2">
                            {user?.name}
                          </Typography>
                        </Link>
                        <Typography
                          sx={{ ml: 0.443 }}
                          variant="subtitle2"
                          display="inline"
                          color={"GrayText"}
                        >
                          {returnTimeDifference(d, new Date())}
                        </Typography>
                        <Typography
                          display="inline"
                          variant="body1"
                          fontWeight={300}
                          sx={{ ml: 1 }}
                        >
                          <>{text}</>
                        </Typography>
                        <Grid item xs={12}>
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
                          {this.context.user.id === user.id && (
                            <IconButton
                              sx={{ float: "right" }}
                              onClick={() => this.handleDelete(id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </ListSubheader>
                  <Box sx={{ mb: 4 }} />
                  {posts.length ? (
                    posts
                      .slice(
                        0,
                        showImage
                          ? posts.length > 8
                            ? 8
                            : posts.length
                          : posts.length
                      )
                      .map((post, i, arr) => (
                        <Grid key={post.id}>
                          <Grid
                            item
                            container
                            xs={12}
                            sx={{ width: "97%" }}
                            ml={0.2667}
                          >
                            <Grid>
                              <Grid display="flex">
                                <Link to={`/main/profile/${post.author}`}>
                                  <Avatar
                                    sx={{ height: 27, width: 27, mx: 1 }}
                                    src={smallImage(post.user?.photo ?? "", 30)}
                                  />
                                </Link>
                                <Typography
                                  display="inline"
                                  variant="subtitle2"
                                >
                                  <Link to={`/main/profile/${post.author}`}>
                                    {post.user?.name}
                                  </Link>
                                  <Box
                                    component="span"
                                    display="inline"
                                    fontFamily="lato"
                                    fontSize={14}
                                    fontWeight={300}
                                    sx={{ ml: 1 }}
                                  >
                                    {post.text}
                                  </Box>
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <Grid ml={2}>
                              <Typography variant="caption" color="GrayText">
                                {returnTimeDifference(
                                  new Date(),
                                  new Date(post.createdAt)
                                )}{" "}
                                ago
                              </Typography>
                              <IconButton
                                disableRipple
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
                              <Typography
                                sx={{
                                  color: "GrayText",
                                  position: "relative",
                                  left: 1,
                                  bottom: 1,
                                }}
                                variant="caption"
                              >{`${post.voters.length} ${
                                post.voters.length === 1 ? "like" : "likes"
                              }`}</Typography>
                            </Grid>
                          </Grid>
                          {i !== arr.length - 1 && (
                            <Divider sx={{ opacity: 0.53, my: 1 }} />
                          )}
                          {i === arr.length - 1 && (
                            <div style={{ width: "100%", height: 32 }} />
                          )}
                        </Grid>
                      ))
                  ) : (
                    <Typography
                      sx={{ ml: 2, mb: 6 }}
                      color="GrayText"
                      variant="subtitle2"
                    >
                      <i>...There are no comments!</i>
                    </Typography>
                  )}
                  {posts
                    ? posts.length > 8 && (
                        <Button onClick={this.togglePhoto}>
                          <Typography variant="body2" ml={2} fontWeight={300}>
                            {showImage ? (
                              <i>{`View all ${posts.length} comments.`}</i>
                            ) : (
                              <KeyboardReturn />
                            )}
                          </Typography>
                        </Button>
                      )
                    : null}
                </List>
              </Grid>
              <Box sx={{ mb: 4 }} ref={this.messagesEndRef} />

              <Grid
                item
                xs={12}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  bgcolor:
                    this.context.darkModeOn === "true" ? "black" : "white",
                  width: "100%",
                  overflowY: "hidden",
                  pb: 2,
                }}
              >
                <Box
                  component="form"
                  onSubmit={this.handleNewPost}
                  sx={{ width: "100%" }}
                >
                  <Box sx={{ width: "100%", mt: 1 }} />
                  <TextField
                    InputProps={{
                      disableUnderline: true,
                      sx: { fontWeight: 300, height: 20 },
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
                          type="submit"
                          disabled={!Boolean(this.state.storyPostText)}
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
          </Grid>
        </Paper>
        <Popover
          onClose={this.handlePickerClose}
          open={pickerOpen}
          id={menuId}
          anchorEl={anchorEl}
          transformOrigin={{ vertical: "bottom", horizontal: "center" }}
          className={this.context.darkModeOn === "true" ? "emoji-dark" : ""}
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
      </Container>
    );
  }
}

export default withRouter(StoryComponent);
