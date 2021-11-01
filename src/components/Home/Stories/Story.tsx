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
  Paper,
  TextField,
} from "@mui/material";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { ExitToApp, OpenInNew, SentimentSatisfied } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { returnTime, returnTimeDifference } from "../../_helpers/helpers";
import { Box } from "@mui/system";

import React, { Component } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { AppState } from "../../../App";
import { Story } from "../../../types/API.types";
import { UserCtx } from "../../Context/MainContext";
import API_URL from "../../_helpers/environment";
import { fetchHandler } from "../../_helpers/fetchHandler";

interface Params {
  storyId: string;
}

interface StoryComponentProps extends RouteComponentProps<Params> {}

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
        url: `${API_URL}/story/${this.props.match.params.storyId}`,
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

  componentDidMount() {
    this.fetchStory();
  }

  render() {
    if (!this.state) return <div>loading</div>;
    const { createdAt, text, imageUrl, likers, user, posts, storyPostText } =
      this.state;

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
              md={10}
              lg={8}
              display="flex"
              justifyContent="center"
            >
              <img
                src={imageUrl}
                alt={text}
                style={{
                  objectFit: "cover",
                  height: "100%",
                  width: "100%",
                }}
              />
            </Grid>

            <Grid
              display="block"
              // alignItems="center"
              // justifyContent="space-between"

              sx={{ width: "100%" }}
              container
              item
              xs={12}
              md={12}
              lg={4}
            >
              <Grid p={1}>
                <Grid item xs={12} ml={0.2667}>
                  <Avatar
                    src={user?.photo}
                    sx={{ mx: 1, height: 70, width: 70, float: "left" }}
                  />
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
              <Divider sx={{ mb: 4 }} />
              {posts.length ? (
                posts
                  .sort((a, b) => b.voters.length - a.voters.length)
                  .slice(0, posts.length > 8 ? 8 : posts.length)
                  .map((post) => (
                    <Grid key={post.id}>
                      <Grid
                        item
                        container
                        xs={12}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        ml={0.2667}
                      >
                        <Grid>
                          <Grid display="flex">
                            <Avatar
                              sx={{ height: 27, width: 27 }}
                              src={post.user?.photo}
                            />
                            <Typography display="inline" variant="subtitle2">
                              {post.user?.name}
                            </Typography>

                            <Typography
                              display="inline"
                              variant="body2"
                              fontWeight={300}
                              sx={{ ml: 1 }}
                            >
                              {post.text}
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
                    </Grid>
                  ))
              ) : (
                <Typography sx={{ml: 2}} color="GrayText" variant="subtitle2">
                  <i>...There are no comments!</i>
                </Typography>
              )}
              {posts
                ? posts.length > 8 && (
                    <Typography variant="body2" ml={2} fontWeight={300}>
                      <i>{`View all ${posts.length} comments.`}</i>
                    </Typography>
                  )
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
