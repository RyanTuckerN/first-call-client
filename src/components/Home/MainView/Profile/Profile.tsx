import React, { Component } from "react";
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
  Divider,
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
  PersonRemove,
  Edit,
  Add,
  MailOutline,
  AttachMoney,
  Image,
  ChatBubble,
  Favorite,
} from "@mui/icons-material";
import BasicModal from "../../components/BasicModal";
import "./Profile.css";
import StoryComponent from "../../Stories/Story";
import Swal from "sweetalert2";
import { dark } from "../../../Theme/Theme";

interface RouteParams {
  userId: string;
}

interface ProfileProps extends RouteComponentProps<RouteParams> {
  modalOpen?: boolean;
  setMainState: (key: string, value: any) => void;
}

interface ProfileState {
  user: User | null;
  anchorEl: HTMLButtonElement | null;
  followAnchor: any | null;
  modalOpen: boolean;
  followInfo: any[];
  storyImage: string;
  storyText: string;
  storyError: string;
  stories: Story[];
  storyModalOpen: boolean;
  storyModalId: number;
  followModalOpen: "followers" | "following" | null;
}

class Profile extends Component<ProfileProps, ProfileState> {
  static contextType = UserCtx!;

  constructor(props: ProfileProps, context: AppState) {
    super(props, context);
    this.state = {
      user: null,
      anchorEl: null,
      modalOpen: this.props.modalOpen ?? false,
      followInfo: [],
      storyImage: "",
      storyText: "",
      storyError: "",
      stories: [],
      storyModalOpen: false,
      storyModalId: 0,
      followModalOpen: null,
      followAnchor: null,
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
      const { success, users, message } = await fetchHandler({
        url: `${API_URL}/user/follows/${json.user.id}`,
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      console.log("USERS --> ", users);
      success && this.setState({ followInfo: users });
      return json.success && success;
    } catch (error) {
      alert(error);
      return false;
    }
  };

  handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = (): void => this.setState({ anchorEl: null });

  handleFollow = async (id: number): Promise<boolean> => {
    try {
      const json = await fetchHandler({
        url: `${API_URL}/user/${
          !!this.context.user?.following?.includes(id) ? "un" : ""
        }follow/${id}`,
        method: "post",
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      const { success, message, followers, following } = json;
      console.log(message, json);
      this.setState({ user: { ...this.state.user!, followers } });
      this.context.setAppState("user", { ...this.context.user, following });
      return success;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
  componentDidMount() {
    this.fetchUser();
    this.props.setMainState("profileModalOpen", false);
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

  setFollowModalOpen = (open: "followers" | "following" | null): void =>
    this.setState({ followModalOpen: open });

  setModalOpen = (b: boolean): void => this.setState({ modalOpen: b });
  setStoryModalOpen = (b: boolean): void =>
    this.setState({ storyModalOpen: b });

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
      success &&
        Swal.fire({
          title: message,
          icon: "success",
          customClass: {
            container:
              this.context.darkModeOn === "true" ? "dark-mode-swal" : "",
          },
          returnFocus: false,
        });
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

  // fetchFollowsInfo = async (): Promise<boolean> => {
  //   try {
  //     const { success, users, message } = await fetchHandler({
  //       url: `${API_URL}/user/follows/${this.state.user.id}`,
  //       auth: this.context.token ?? localStorage.getItem("token") ?? "",
  //     });
  //     console.log("USERS --> ", users);
  //     success && this.setState({ followInfo: users });
  //     return success;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // };

  componentDidUpdate(prevProps: ProfileProps, prevState: ProfileState) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.setState({ followAnchor: null, followModalOpen: null });
      this.fetchUser();
    }
    prevState.storyModalOpen &&
      !this.state.storyModalOpen &&
      this.setState({ storyModalId: 0 });
  }

  render() {
    const { user } = this.state;
    // const {token} = this.context
    const avatarSize = 280;
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
              {/* {user.photo ? (
                <Avatar
                  src={user.photo}
                  sx={{
                    height: avatarSize,
                    width: avatarSize,
                    border: 3,
                    borderColor: "white",
                  }}
                  alt={user.name}
                />800
              ) : (
                <Avatar {...stringAvatar(user.name, avatarSize)} />
              )} */}
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
                  title="Add a Gig Story"
                >
                  <Add />
                </IconButton>
              ) : (
                // <Link to="#">
                <MailOutline
                  sx={{
                    position: "relative",
                    right: 36,
                    bottom: 24,
                    color: "#00000000",
                  }}
                />
                // </Link>
              )}
              {this.context.user.id === user.id ? (
                <Link to="/main/settings" title="Edit Profile">
                  <Edit sx={{ position: "relative", left: 45, bottom: 20 }} />
                </Link>
              ) : (
                <>
                  <IconButton
                    sx={{ position: "relative", left: 45, bottom: 20 }}
                    onClick={() => this.handleFollow(user.id)}
                    title={
                      this.context.user?.following?.includes(user.id)
                        ? `Unfollow ${user.name.split(" ")[0]}`
                        : `Follow ${user.name.split(" ")[0]}`
                    }
                  >
                    {this.context.user.following.includes(user.id) ? (
                      <PersonRemove />
                    ) : (
                      <PersonAdd sx={{ transform: "scaleX(-1)" }} />
                    )}
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
                {!!user.paymentPreference && <>&nbsp;&nbsp;&nbsp;&nbsp;</>}
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
              <Typography sx={{ p: 0 }} variant="body1" fontWeight={500}>
                {user.role ? user.role : null}&nbsp;&nbsp;
                {user.location && user.role ? <>&#183;</> : null}&nbsp;&nbsp;
                {user.location ? user.location : null}
              </Typography>
              <Box
                component="div"
                sx={{ p: 0.3333, fontSize: 16 }}
                display="flex"
              >
                {!!user.stories.length && (
                  <>
                    <Typography style={{ fontWeight: 900 }}>
                      {user.stories.length}
                    </Typography>
                    &nbsp; stories &nbsp;
                  </>
                )}
                {!!user.stories.length && <>&#183;&nbsp;&nbsp;</>}
                <Typography
                  style={{ fontWeight: 900 }}
                  sx={{ cursor: user.followers.length ? "pointer" : '' }}
                  aria-owns={
                    this.state.followModalOpen
                      ? "mouse-over-popover"
                      : undefined
                  }
                  aria-haspopup="true"
                  onClick={(e: any) => {
                    console.log(e.target);
                    !!user.followers.length && this.setState({
                      followModalOpen: "followers",
                      followAnchor: e.target,
                    });
                  }}
                >
                  {user.followers.length}
                </Typography>
                &nbsp; followers &nbsp; &#183;&nbsp;&nbsp;
                <Typography
                  style={{ fontWeight: 900 }}
                  sx={{ cursor: user.following.length ? "pointer" : '' }}
                  aria-owns={
                    this.state.followModalOpen
                      ? "mouse-over-popover"
                      : undefined
                  }
                  aria-haspopup="true"
                  onClick={(e: any) => {
                    console.log(e.target);
                    !!user.following.length && this.setState({
                      followModalOpen: "following",
                      followAnchor: e.target,
                    });
                  }}
                >
                  {user.following.length}
                </Typography>
                &nbsp; following
              </Box>
              <Popover
                open={this.state.followModalOpen !== null}
                anchorEl={this.state.followAnchor}
                disableRestoreFocus
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                onClose={() =>
                  this.setState({ followModalOpen: null, anchorEl: null })
                }
                PaperProps={{
                  sx: {
                    bgcolor: dark.palette.background.default,
                    color: "white",
                    width: 300,
                    p: 1,
                  },
                }}
              >
                {!!this.state.followInfo &&
                  !!this.state.followModalOpen &&
                  user?.[this.state.followModalOpen]?.map((userId, i) => {
                    const u =
                      !!this.state.followInfo?.length &&
                      this.state.followInfo
                        ?.slice(0, 10)
                        .filter((u: any) => u.id === userId)[0];
                    if (!u) return <React.Fragment />;
                    return (
                      <Link to={`/main/profile/${u.id}`} key={u.id}>
                        <Box
                          component="li"
                          display="flex"
                          alignItems="center"
                          pl={2}
                          justifyContent="space-between"
                          className="list-link"
                        >
                          <Box
                            component="div"
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Avatar
                              src={u.photo}
                              alt=""
                              sx={{ height: 20, width: 20 }}
                            />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Typography variant="subtitle1">
                              {u.name}
                            </Typography>{" "}
                          </Box>
                          {/* &nbsp;&nbsp; */}
                          <Typography variant="body2" pr={1} fontWeight={300}>
                            {u.role}
                          </Typography>
                        </Box>
                      </Link>
                      //   <Box component="li"  {...props}>
                      //   <Avatar
                      //     src={option.photo}
                      //     alt=""
                      //   />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      //   <Typography variant='subtitle1'>{option.name}</Typography> &nbsp;&nbsp;
                      //   <Typography variant='body1'>{option.role}</Typography>
                      // </Box>
                    );
                  })}
                {!!this.state.followModalOpen &&
                  user?.[this.state.followModalOpen]?.length > 10 && (
                    <Link to="/feed">
                      <Box
                        component="li"
                        display="flex"
                        alignItems="center"
                        pl={2}
                        justifyContent="space-between"
                        className="list-link"
                      >
                        <Typography variant="caption" fontWeight={300}>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...and{" "}
                          {user?.[this.state.followModalOpen]?.length - 10}{" "}
                          others.
                        </Typography>
                      </Box>
                    </Link>
                  )}
              </Popover>
              {/* <Grid sx={{ maxWidth: 200 }} textAlign="justify">
                <Typography variant="caption">
                  {user.description ? user.description : null}
                </Typography>
              </Grid> */}
            </Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        )}
        {/* <div style={{ height: 40, width: "100%" }} /> */}

        <Grid container display="flex" justifyContent="center">
          <Divider sx={{ width: 150, my: 3, alignSelf: "center" }} />
        </Grid>
        <Container>
          <Grid
            container
            display="flex"
            flexWrap="wrap"
            justifyContent="space-around"
          >
            {this.state.stories.length ? (
              this.state.stories.reverse().map((story, i) => (
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
                    // to={`/story/${story.id}`}
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
                        &nbsp;&nbsp;&nbsp;&nbsp; {story.posts?.length ?? 0}{" "}
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
              ))
            ) : (
              <Grid display="flex" flexDirection="column" alignItems="center">
                <Typography variant="overline" fontWeight={300}>
                  No stories to display!
                </Typography>
                {this.state.user?.id === this.context.user.id && (
                  <Typography variant="subtitle1" fontWeight={100}>
                    <IconButton
                      onClick={() => this.setModalOpen(true)}
                      title="Add a Gig Story"
                    >
                      <Add />
                    </IconButton>
                    <i>Add one?</i>{" "}
                  </Typography>
                )}
              </Grid>
            )}
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
        <BasicModal
          modalTitle="story-full-info"
          setOpen={this.setStoryModalOpen}
          open={this.state.storyModalOpen}
        >
          <StoryComponent
            storyId={this.state.storyModalId}
            story={
              this.state.stories.find(
                (story) => story.id === this.state.storyModalId
              )!
            }
          />
        </BasicModal>
      </>
    );
  }
}

export default withRouter(Profile);
