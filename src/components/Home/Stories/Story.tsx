import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {
  Button,
  Container,
  Divider,
  Grid,
  List,
  ListSubheader,
  Paper,
  TextField,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { ExitToApp, KeyboardReturn, OpenInNew, SentimentSatisfied } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { returnTime, returnTimeDifference } from "../../_helpers/helpers";
import { Box } from "@mui/system";

import React, { Component } from "react";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import { AppState } from "../../../App";
import { Story } from "../../../types/API.types";
import { UserCtx } from "../../Context/MainContext";
import API_URL from "../../_helpers/environment";
import { fetchHandler } from "../../_helpers/fetchHandler";

interface Params {
  storyId: string;
}

interface StoryComponentProps extends RouteComponentProps<Params> {
  storyId?: number
}

interface StoryComponentState extends Story {
  storyPostText: string;
  showImage: boolean;
}

class StoryComponent extends React.Component<
  StoryComponentProps,
  StoryComponentState
> {
  static contextType = UserCtx;

  constructor(props: StoryComponentProps, context: AppState) {
    super(props, context);
    // this.state = { :  };
  }

  fetchStory = async (): Promise<boolean> => {
    try {
      const { story, success, message } = await fetchHandler({
        url: `${API_URL}/story/${this.props.match.params.storyId ?? this.props.storyId}`,
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      // alert(message);
      success && this.setState({ ...story });
      return success;
    } catch (error) {
      alert(error);
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
    if (!this.state.storyPostText) return false;
    try {
      const text = this.state.storyPostText;
      const { success, post, message } = await fetchHandler({
        url: `${API_URL}/story/${this.state.id}/post`,
        body: { text },
        method: "post",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      // console.log(post, message, respons, response);
      success &&
        this.setState({
          posts: [
            { ...post, user: { ...this.context.user } },
            ...(this.state.posts ?? []),
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

  togglePhoto = (): void => this.setState({ showImage: !this.state.showImage });

  componentDidMount() {
    this.fetchStory();
  }

  componentDidUpdate(
    prevProps: StoryComponentProps,
    prevState: StoryComponentState
  ) {
    prevState?.imageUrl !== this.state?.imageUrl &&
      this.setState({ showImage: true });
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
    } = this.state;

    const d = new Date(createdAt);
    return (
      <Container
        maxWidth={"xl"}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Paper sx={{ width: "100%", minWidth: 320, mb: 3 }} elevation={4}>
          <Grid container>
            {/* <Grid
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            <Grid display="flex" alignItems="center">
              <Avatar
                src={user?.photo}
                sx={{ ml: 1, height: 30, width: 30 }}
              />
              <Typography sx={{ ml: 1 }} variant="caption">
                {user?.name}
              </Typography>
            </Grid>
            <IconButton>
              <OpenInNew fontSize="small" />
            </IconButton>
          </Grid> */}
            <Grid
              container
              item
              xs={12}
              md={12}
              lg={8}
              display={showImage ? "flex" : "none"}
              justifyContent="center"
            >
              <img
                src={imageUrl}
                alt={text}
                style={{
                  objectFit: "cover",
                  alignSelf: "flex-start",
                  height: "100%",
                  width: "100%",
                  maxHeight: "85vh",

                  // maxWidth: 600,
                }}
              />
            </Grid>

            <Grid
              display="block"
              // alignItems="center"
              // justifyContent="space-between"

              sx={{
                width: "100%",
                maxHeight: "85vh",
                height: "100%",
                overflowY: "scroll",
                overflowX: "hidden",
                alignSelf: "flex-start",
                position: 'relative'
              }}
              container
              item
              xs={12}
              md={12}
              lg={showImage ? 4 : 12}
            >
              <List
                sx={{
                  bgcolor: "grey[200]",
                  height: "100%",
                  mb:7
                }}
              >
                <ListSubheader sx={{ mt: -1, p: 0 }}>
                  <Grid p={1}>
                    <Grid item xs={12} ml={0.2667}>
                      <Link to={`/main/profile/${user.id}`}>
                        <Avatar
                          src={user?.photo}
                          sx={{ mx: 1, height: 70, width: 70, float: "left" }}
                        />
                      </Link>
                      <Typography display="inline" variant="subtitle2">
                        {user?.name}
                      </Typography>
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
                    </Grid>
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
                      <Typography sx={{ mb: 0.2667 }} variant="caption">{`${
                        likers.length
                      } ${
                        likers.length === 1
                          ? "person likes this."
                          : "people like this."
                      }`}</Typography>
                    </Grid>
                  </Grid>
                </ListSubheader>
                <Box sx={{ mb: 4 }} />
                {posts.length ? (
                  posts
                    .sort((a, b) => b.voters.length - a.voters.length)
                    .slice(
                      0,
                      //match with showImage or not
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
                          sx={{width: '97%'}}
                          // display="flex"
                          // alignItems="center"
                          // justifyContent="space-between"
                          ml={0.2667}
                        >
                          <Grid>
                            <Grid display="flex">
                              <Link to={`/main/profile/${post.author}`}>
                                <Avatar
                                  sx={{ height: 27, width: 27, mx: 1 }}
                                  src={post.user?.photo}
                                />
                              </Link>
                              <Typography display="inline" variant="subtitle2">
                                {post.user?.name}
                                <Typography
                                  display="inline"
                                  variant="body2"
                                  fontWeight={300}
                                  sx={{ ml: 1 }}
                                >
                                  {post.text}
                                </Typography>
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
                      </Grid>
                    ))
                ) : (
                  <Typography
                    sx={{ ml: 2 }}
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
                <Grid
                  display="flex"
                  // alignItems="center"
                  alignSelf="flex-end"
                  sx={{ width: "100%", position:'sticky', bottom: 0, bgcolor: this.context.darkModeOn === 'true' ? 'black' : 'white', opacity: 1}}
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
                        sx: { fontWeight: 300, height: 20, },
                        fullWidth: true,
                        startAdornment: <SentimentSatisfied fontSize="small" />,
                        endAdornment: (
                          <Button disabled={!Boolean(this.state.storyPostText)}>
                            POST
                          </Button>
                        ),
                      }}
                      variant="standard"
                      size="small"
                      placeholder="    add a comment"
                      value={storyPostText}
                      onChange={this.handleReplyText}
                      fullWidth
                    />
                  </Box>
                </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default withRouter(StoryComponent);
