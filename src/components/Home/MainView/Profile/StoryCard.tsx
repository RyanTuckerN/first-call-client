import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { Button, Divider, Grid, Paper, TextField } from "@mui/material";
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
import { Story } from "../../../../types/API.types";
import { returnTime } from "../../../_helpers/helpers";
import { AppState } from "../../../../App";
import { fetchHandler } from "../../../_helpers/fetchHandler";
import API_URL from "../../../_helpers/environment";
import { UserCtx } from "../../../Context/MainContext";
import { Box } from "@mui/system";

interface StoryCardProps extends Story {
  // handleLike: (id: number) => Promise<boolean>;
  // author: { name: string; photo: string };
}

interface StoryCardState extends Story {
  storyPostText: string;
  author: { name: string; photo: string };
}

class StoryCard extends React.Component<StoryCardProps, StoryCardState> {
  static contextType = UserCtx;

  constructor(props: StoryCardProps, context: AppState) {
    super(props, context);
    this.state = { ...this.props, storyPostText: "", author: this.props.user };
  }

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

  render() {
    const { createdAt, text, imageUrl, likers, author, posts, storyPostText } =
      this.state;

    const d = new Date(createdAt);
    return (
      <Paper sx={{ width: "51%", minWidth: 320, mb: 3 }} elevation={0}>
        <Grid container>
          <Grid
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: "100%" }}
          >
            {/* <Grid item xs={9}> */}
            <Grid display="flex" alignItems="center">
              <Avatar
                src={author?.photo}
                sx={{ ml: 1, height: 30, width: 30 }}
              />
              <Typography sx={{ ml: 1 }} variant="caption">
                {author?.name}
                {/* {`${d.toLocaleDateString()}, ${returnTime(d)}`}{" "} */}
              </Typography>
            </Grid>
            {/* </Grid> */}
            {/* <Grid item xs={3} display='flex'> */}
            <IconButton>
              <OpenInNew fontSize="small" />
            </IconButton>
            {/* </Grid> */}
          </Grid>
          <Grid container display="flex" justifyContent="center">
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
        </Grid>
        <Grid
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
          container
        >
          {/* <Grid item xs={9}> */}
          <Grid item xs={12}>
            <IconButton onClick={this.handleLike}>
              {likers.includes(this.context.user.id) ? (
                <FavoriteIcon fontSize="small" sx={{ color: "error.light" }} />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
            <Typography sx={{ mb: 0.2667 }} variant="caption">{`${
              likers.length
            } ${
              likers.length === 1 ? "person likes this." : "people like this."
            }`}</Typography>
          </Grid>
          <Grid item xs={12} ml={0.2667}>
            <Typography display="inline" variant="subtitle2">
              {author?.name}
            </Typography>
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
                <Typography variant="body2" ml={2} fontWeight={300}>
                  <i>{`View all ${posts.length} comments.`}</i>
                </Typography>
              )
            : null}
          {posts
            ? posts
                .sort((a, b) => b.voters.length - a.voters.length)
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
                    <Grid>
                      <IconButton onClick={() => this.handlePostLike(post.id)}>
                        {post.voters.includes(this.context.user.id) ? (
                          <FavoriteIcon
                            sx={{ height: 13, width: 13, color: "error.light" }}
                            color="error"
                          />
                        ) : (
                          <FavoriteBorderIcon sx={{ height: 13, width: 13 }} />
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
      </Paper>
    );
  }
}

export default StoryCard;


// interface User{
//   id: number,
//   name: string
// }

// interface FooProps{}

// interface FooState extends User {}

// class Foo extends React.Component<FooProps, FooState>{
  
//   handleFetch = () => {
//     //FETCH
//     this.setState({id: json.id, name: json.name})
//   }

//   componentDidMount() {
//     this.handleFetch()
//   }
  
// }