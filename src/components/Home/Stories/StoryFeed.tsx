import {
  Container,
  Paper,
  Grid,
  List,
  ListItem,
  ListSubheader,
  IconButton,
} from "@mui/material";
import { Language, Groups } from "@mui/icons-material";
import React from "react";
import { Story } from "../../../types/API.types";
import API_URL from "../../_helpers/environment";
import { fetchHandler } from "../../_helpers/fetchHandler";
import StoryCard from "./StoryCard";

interface StoryFeedProps {
  dashboard?: boolean;
}

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
      <Grid
        container
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
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 0,
          }}
        >
          {this.state.stories
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((story) => (
              <ListItem
                key={story.id}
                sx={this.props.dashboard ? { p: 0, pb: 2 } : {}}
              >
                <StoryCard {...story} dashboard={this.props.dashboard} />
              </ListItem>
            ))}
        </List>
      </Grid>
      // </Container>
    );
  }
}

export default StoryFeed;
