import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { AppState } from "../../../App";
import { Story as StoryType } from "../../../types/API.types";
import { UserCtx } from "../../Context/MainContext";
import API_URL from "../../_helpers/environment";
import { fetchHandler } from "../../_helpers/fetchHandler";
import Story from "./Story";

interface Params {
  storyId: string;
}

interface StoryLoaderProps extends RouteComponentProps<Params> {}

interface StoryLoaderState {
  story: StoryType | null;
}

class StoryLoader extends React.Component<StoryLoaderProps, StoryLoaderState> {
  static contextType = UserCtx;

  constructor(props: StoryLoaderProps, context: AppState) {
    super(props, context);
    this.state = { story: null };
  }

  fetchStory = async (): Promise<boolean> => {
    try {
      const { story, success, message } = await fetchHandler({
        url: `${API_URL}/story/id/${this.props.match.params.storyId}`,
        auth: this.context.token ?? localStorage.getItem("token") ?? "",
      });
      success && this.setState({ story });
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
    return !!this.state.story ? (
      <Story
        storyId={parseInt(this.props.match.params.storyId)}
        story={this.state.story}
      />
    ) : (
      <div>Loading...</div>
    );
  }
}

export default withRouter(StoryLoader);
