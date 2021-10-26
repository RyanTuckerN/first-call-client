// import * as React from 'react';
import { Component } from "react";
// import EditProfile from './EditProfile';
import { Avatar, Grid, Typography } from "@mui/material";
import { User } from "../../../../types/API.types";
import {withRouter, RouteComponentProps} from 'react-router-dom'
import { fetchHandler } from "../../../_helpers/fetchHandler";
import API_URL from "../../../_helpers/environment";
import { stringAvatar } from "../Settings/Header";

interface RouteParams {
  userId: string;
}

interface ProfileProps extends RouteComponentProps<RouteParams> {}

interface ProfileState {
  user: User | null
}

class Profile extends Component<ProfileProps, ProfileState> {


  constructor(props: ProfileProps) {
    super(props);
    this.state = { user: null  };
  }

  fetchUser = async(): Promise<boolean> =>{
    try {
      const json = await fetchHandler({
        url:`${API_URL}/user/profile/${this.props.match.params.userId}`,
        auth: this.context.token ?? localStorage.getItem('token') ?? ''
      })
      json.success && this.setState({user: json.user})
      return json.success
    } catch (error) {
      alert(error)
      return false
    }
  }

  componentDidMount(){
    this.fetchUser()
  }

  render() {
    const {user} = this.state
    const avatarSize = 175
    return (
    <>
      {user && (
      <Grid container>
        <Grid item xs={4}>
          {user.photo ? <Avatar src={user.photo} sx={{height: avatarSize, width: avatarSize}} alt={user.name} /> : <Avatar {...stringAvatar(user.name , avatarSize)} />}
          <Typography>{user.name}</Typography>
          <Typography>{user.location ? user.location : null}</Typography>
          <Typography>{user.role ? user.role : null}</Typography>
          <Typography>{user.email ? user.email : null}</Typography>
          <Typography>{user.paymentPreference ? <strong>{`${user.paymentPreference.platform} ${user.paymentPreference?.handle}`}</strong> : null }</Typography>
        </Grid>
        <Grid item xs={4}>
          
        </Grid>
      </Grid>  
      )}
    </>);
  }
}

export default withRouter(Profile);
