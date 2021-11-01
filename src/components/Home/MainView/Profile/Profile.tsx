// import * as React from 'react';
import { Component } from "react";
// import EditProfile from './EditProfile';
import {
  Avatar,
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  IconButton,
  Popover,
  Container,
  TextField,
} from "@mui/material";
import { Story, User } from "../../../../types/API.types";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { fetchHandler } from "../../../_helpers/fetchHandler";
import API_URL from "../../../_helpers/environment";
import { stringAvatar } from "../Settings/Header";
import { UserCtx } from "../../../Context/MainContext";
import { AppState } from "../../../../App";
import {
  PersonAdd,
  Edit,
  Add,
  MailOutline,
  AttachMoney,
  Settings,
  Image,
  ChatBubble,
  Favorite,
} from "@mui/icons-material";
import BasicModal from "../../components/BasicModal";
import StoryCard from "./StoryCard";
import "./Profile.css";

const gigImages = [
  "https://images.unsplash.com/photo-1600779547877-be592ef5aad3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1597158520886-43e23f1acb1e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/flagged/photo-1561203490-e032d2d1f4f9?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
  "https://images.unsplash.com/photo-1546367791-e7447b431084?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1617174512292-aadc4a85151c?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1176&q=80",
  "https://images.unsplash.com/photo-1582068019586-fd236dbad5e3?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGdpZ3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
];

interface RouteParams {
  userId: string;
}

interface ProfileProps extends RouteComponentProps<RouteParams> {}

interface ProfileState {
  user: User | null;
  anchorEl: HTMLButtonElement | null;
  modalOpen: boolean;
  storyImage: string;
  storyText: string;
  storyError: string;
  stories: Story[];
}

class Profile extends Component<ProfileProps, ProfileState> {
  static contextType = UserCtx!;

  constructor(props: ProfileProps, context: AppState) {
    super(props, context);
    this.state = {
      user: null,
      anchorEl: null,
      modalOpen: false,
      storyImage: "",
      storyText: "",
      storyError: "",
      stories: [],
    };
  }

  fetchUser = async (): Promise<boolean> => {
    try {
      const json = await fetchHandler({
        url: `${API_URL}/user/profile/${this.props.match.params.userId}`,
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      json.success &&
        this.setState({ user: json.user, stories: json.user.stories });
      return json.success;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (): void => this.setState({ anchorEl: null });

  componentDidMount() {
    this.fetchUser();
  }

  uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<boolean> => {
    try {
      this.setState({ storyError: "" });
      const files = e.target.files;
      if (!files) throw new Error("something went wrong!");
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "lvcrltpx");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpd08wa9g/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const File = await res.json();
      console.log(File);
      this.setState({ storyImage: File.secure_url });
      return true;
    } catch (err) {
      console.error(err);
      alert("There was an error! Please try again");
      return false;
    }
  };

  setModalOpen = (b: boolean): void => this.setState({ modalOpen: b });

  handleStoryText = (e: React.ChangeEvent<HTMLInputElement>): void =>
    this.setState({ storyText: e.target.value, storyError: "" });

  handleNewStory = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<boolean> => {
    e.preventDefault();
    if (!this.state.storyImage) {
      this.setState({ storyError: "Please choose an image." });
      return false;
    }
    if (!this.state.storyText) {
      this.setState({ storyError: "Please write a caption" });
      return false;
    }
    try {
      const { success, story, message } = await fetchHandler({
        url: `${API_URL}/story/`,
        method: "post",
        body: {
          text: this.state.storyText,
          imageUrl: this.state.storyImage,
        },
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      alert(message);
      // success && this.setState({})
      success &&
        this.setState({
          stories: [...this.state.stories, story],
          modalOpen: false,
          storyError: "",
          storyImage: "",
          storyText: "",
        });
      return success;
    } catch (err) {
      console.log(err);
      return false;
    }
    // return true;
  };
  componentDidUpdate(prevProps: ProfileProps, prevState: ProfileState) {
    prevProps.match.params.userId !== this.props.match.params.userId &&
      this.fetchUser();
  }

  render() {
    const { user } = this.state;
    // const {token} = this.context
    const avatarSize = 175;
    const open = Boolean(this.state.anchorEl);
    const id = open ? "simple-popover" : undefined;

    return (
      <>
        {user && (
          <Grid container>
            <Grid item xs={12} sx={{ height: 100 }}>
              <img
                src="https://picsum.photos/800"
                alt="random placeholder"
                style={{ width: "100%", objectFit: "cover", height: 200 }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="flex-end"
            >
              {user.photo ? (
                <Avatar
                  src={user.photo}
                  sx={{
                    height: avatarSize,
                    width: avatarSize,
                    border: 3,
                    borderColor: "white",
                  }}
                  alt={user.name}
                />
              ) : (
                <Avatar {...stringAvatar(user.name, avatarSize)} />
              )}
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="flex-end"
            >
              {this.context.user.id === user.id ? (
                <IconButton
                  onClick={() => this.setModalOpen(true)}
                  sx={{ position: "relative", right: 45, bottom: 20 }}
                >
                  <Add />
                </IconButton>
              ) : (
                <Link to="#">
                  <MailOutline
                    sx={{ position: "relative", right: 36, bottom: 24 }}
                  />
                </Link>
              )}
              {this.context.user.id === user.id ? (
                <Link to="/main/settings">
                  <Edit sx={{ position: "relative", left: 45, bottom: 20 }} />
                </Link>
              ) : (
                <>
                  <IconButton
                    sx={{ position: "relative", left: 45, bottom: 20 }}
                  >
                    <PersonAdd />
                  </IconButton>
                </>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              {(!user.role ||
                !user.location ||
                !user.paymentPreference ||
                !user.photo) &&
              this.context.user.id === user.id ? (
                <Link to="/main/settings">
                  <Typography variant="caption">
                    {/* <Settings sx={{fontSize: 'small'}} />&nbsp; */}
                    <i>Finish setting up your profile?</i>
                  </Typography>
                </Link>
              ) : null}
              <Typography variant="h4">
                {user.name}
                {user.paymentPreference ? (
                  <>
                    <IconButton
                      // sx={{ position: "relative", left: 53, bottom: 20 }}
                      aria-describedby={id}
                      // variant="contained"
                      onClick={this.handleClick}
                    >
                      <AttachMoney fontSize="small" color="success" />
                    </IconButton>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={this.state.anchorEl}
                      onClose={this.handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                    >
                      {Object.keys(user.paymentPreference).map((p, i) => {
                        const platform = p;
                        const handle = user.paymentPreference![p];
                        return (
                          <Paper sx={{ p: 2 }} key={i}>
                            <Typography variant="body1">
                              {platform}: &nbsp; {handle}
                            </Typography>
                          </Paper>
                        );
                      })}
                    </Popover>
                  </>
                ) : null}
              </Typography>
              <Typography sx={{ p: 0 }} variant="body1">
                {user.role ? user.role : null}&nbsp;&nbsp;
                {user.location && user.role ? <>&#183;</> : null}&nbsp;&nbsp;
                {user.location ? user.location : null}
              </Typography>
              {/* <Grid sx={{ maxWidth: 200 }} textAlign="justify">
                <Typography variant="caption">
                  {user.description ? user.description : null}
                </Typography>
              </Grid> */}
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        )}
        <div style={{ height: 40, width: "100%" }} />

        <Container>
          <Grid
            container
            display="flex"
            flexWrap="wrap"
            justifyContent="space-around"
          >
            {this.state.stories.reverse().map((story, i) => (
              <Grid
                key={i}
                item
                xs={12}
                sm={6}
                md={4}
                sx={{ p: 2 }}
                display="flex"
                flexDirection="column"
                alignItems="center"
              >
                {/* <Paper elevation={0}> */}
                <Link
                  to={`/story/${story.id}`}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexWrap: "wrap",
                    height: 300,
                    width: 300,
                    overflow: "hidden",
                  }}
                >
                  <img
                    className="image-thumbnail"
                    src={story.imageUrl}
                    alt={story.text}
                    style={{
                      zIndex: 999,
                      objectFit: "cover",
                      height: 300,
                      width: 300,
                    }}
                  />
                  <div
                    style={{
                      backgroundColor: "white",
                      zIndex: 997,
                      objectFit: "cover",
                      position: "absolute",
                      height: 300,
                      width: 300,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ zIndex: 1000, color: "#00000060" }}
                    >
                      {story.likers.length} <Favorite />{" "}
                      &nbsp;&nbsp;&nbsp;&nbsp; {story.posts.length}{" "}
                      <ChatBubble />
                    </Typography>
                  </div>
                </Link>
                {/* </Paper> */}
              </Grid>
              // <StoryCard
              //   key={story.id}
              //   {...story}
              // />
            ))}
          </Grid>
        </Container>
        <BasicModal
          open={this.state.modalOpen}
          setOpen={this.setModalOpen}
          modalTitle="new-post"
        >
          <Box component="form" onSubmit={this.handleNewStory}>
            <Paper sx={{ p: 3 }}>
              {this.state.storyImage ? (
                <img
                  src={this.state.storyImage}
                  alt="new-story-post-image"
                  style={{ height: 280, width: 280, objectFit: "cover" }}
                />
              ) : (
                <>
                  <input
                    accept="image/*"
                    onChange={this.uploadImage}
                    style={{ display: "none" }}
                    id="add-story-post"
                    type="file"
                  />
                  <Button>
                    <Box
                      component="label"
                      sx={{ cursor: "pointer" }}
                      htmlFor="add-story-post"
                      id="add-image"
                    >
                      <Image sx={{ height: 280, width: 280 }} />
                    </Box>
                  </Button>
                </>
              )}
              <TextField
                sx={{ pt: 3 }}
                fullWidth
                value={this.state.storyText}
                onChange={this.handleStoryText}
                title="Caption"
                placeholder="Add a caption"
                name="caption"
              />
              <Grid display="flex" justifyContent="space-around" sx={{ pt: 3 }}>
                <Button
                  onClick={() => {
                    this.setState({
                      modalOpen: false,
                      storyText: "",
                      storyImage: "",
                    });
                  }}
                  variant="contained"
                  color="error"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="success">
                  Post
                </Button>
              </Grid>
              <Grid display="flex" justifyContent="center" sx={{ pt: 2 }}>
                <Typography variant="caption" textAlign="center" color="red">
                  {this.state.storyError}
                </Typography>
              </Grid>
            </Paper>
          </Box>
        </BasicModal>
      </>
    );
  }
}

export default withRouter(Profile);
