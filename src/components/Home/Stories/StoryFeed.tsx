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
      <Container maxWidth={"lg"} >
        <Paper elevation={7} >
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* <ListSubheader
                sx={{
                  mt: 0,
                  py: 0.3333,
                  position: "fixed",
                  zIndex: 9999,
                  top: 40,
                  width: 200,
                  display: "flex",
                  justifyContent: "space-around",
                  bgcolor: 'transparent'
                }}
              >
                <IconButton title='Global Feed'>
                  <Language />
                </IconButton>
                <IconButton title='Personal Feed'>
                  <Groups />
                </IconButton>
              </ListSubheader> */}
              {this.state.stories
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
                .map((story) => (
                  <ListItem key={story.id} sx={{px: .5}} >
                    <StoryCard {...story} />
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default StoryFeed;
