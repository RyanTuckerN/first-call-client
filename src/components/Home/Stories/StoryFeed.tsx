import { Grid, List, ListItem, Typography } from "@mui/material";
import React from "react";
import { Story } from "../../../types/API.types";
import API_URL from "../../_helpers/environment";
import { fetchHandler } from "../../_helpers/fetchHandler";
import StoryCard from "./StoryCard";
import { Box } from "@mui/system";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingFeed } from "../../Skeletons";

interface StoryFeedProps {
  dashboard?: boolean;
}

interface StoryFeedState {
  stories: Story[];
  moreToLoad: boolean;
}

class StoryFeed extends React.Component<StoryFeedProps, StoryFeedState> {
  constructor(props: StoryFeedProps) {
    super(props);
    this.state = { stories: [], moreToLoad: true };
  }

  handleFetch = async (): Promise<boolean> => {
    try {
      const { stories, success, message } = await fetchHandler({
        url: `${API_URL}/story/${
          this.props.dashboard
            ? "dashboard"
            : this.state.stories.length
            ? `?lt=${Math.min(...this.state.stories.map((s) => s.id))}`
            : ""
        }`,
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      success && !stories.length && this.setState({ moreToLoad: false });
      success &&
        this.setState({ stories: [...this.state.stories, ...stories] });
      return success;
    } catch (error) {
      return false;
    }
  };

  componentDidMount() {
    this.handleFetch();
  }

  render() {
    return (
      <>
        <Grid
          sx={
            !this.props.dashboard
              ? {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  maxHeight: "100%",
                }
              : {}
          }
        >
          {!this.props.dashboard && (
            <Box component="div" width="100%" maxWidth={720}>
              <Typography variant="h5" fontWeight={100} sx={{ p: 2 }}>
                <i>Discover</i>
              </Typography>
            </Box>
          )}
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 0,
            }}
          >
            <InfiniteScroll
              dataLength={this.state.stories.length}
              next={this.handleFetch}
              hasMore={this.state.moreToLoad}
              loader={<LoadingFeed />}
              endMessage={
                <Box
                  component="div"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    mt: !this.props.dashboard ? 3 : 0,
                  }}
                >
                  <Typography
                    variant="overline"
                    textAlign="center"
                    fontWeight={200}
                  >
                    <i>No more posts!</i>
                  </Typography>
                </Box>
              }
            >
              {this.state.stories.map((story) => (
                <ListItem
                  key={story.id}
                  sx={this.props.dashboard ? { p: 0, pb: 2 } : { p: 0, pb: 2 }}
                >
                  <StoryCard {...story} dashboard={this.props.dashboard} />
                </ListItem>
              ))}
            </InfiniteScroll>
          </List>
          {!this.props.dashboard && (
            <div style={{ width: "100%", height: 50 }} />
          )}
        </Grid>
      </>
    );
  }
}

export default StoryFeed;
