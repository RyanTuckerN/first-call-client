import { Container, Paper, Grid } from "@mui/material";
import React from "react";
import { Story } from "../../../types/API.types";
import API_URL from "../../_helpers/environment";
import { fetchHandler } from "../../_helpers/fetchHandler";
import StoryCard from "./StoryCard";

interface StoryFeedProps {}

interface StoryFeedState {
  stories: Story[];
}

class StoryFeed extends React.Component<StoryFeedProps, StoryFeedState> {
  constructor(props: StoryFeedProps) {
    super(props);
    this.state = { stories: [] };
  }

  handleFetch = async (): Promise<boolean> => {
    try {
      const { stories, success, message } = await fetchHandler({
        url: `${API_URL}/story`,
      });
      success && this.setState({ stories });
      console.log(message);
      return success;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  componentDidMount() {
    this.handleFetch();
  }

  render() {
    return (
      <Container maxWidth={"lg"}>
        <Paper elevation={7}>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 0.4781,
            }}
          >
            {this.state.stories
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((story) => (
                <StoryCard {...story} key={story.id} />
              ))}
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default StoryFeed;
