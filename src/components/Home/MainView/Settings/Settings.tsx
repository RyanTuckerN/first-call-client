// import * as React from "react";
import { Component } from "react";
// import ChangePass from "./ChangePass";
import { Typography, Switch, IconButton,   } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { UserCtx } from "../../../Context/MainContext";
import Swal from 'sweetalert2'

interface SettingsProps {}

interface SettingsState {}

class Settings extends Component<SettingsProps, SettingsState> {
  static contextType = UserCtx;

  constructor(props: SettingsProps) {
    super(props);
    // this.state = { :  };
  }

  handleInfo = ():Promise<any> => Swal.fire({icon: 'question', text:'FirstCall will never send promotional materials, but email is a great way to stay informed about any changes to your gigs. Opt out anytime!'})
  // handleEmail = ():void => 

  componentDidMount() {
    console.log(this.context);
  }
  render() {
    return (
      <>
        {/* Hello from Settings.tsx! */}
        <div>
          <Typography variant="h5">Dark Mode</Typography>
            <Switch
              onChange={this.context.toggleDark}
              checked={this.context.darkModeOn === 'true' ? true : false}
            />
            <Typography display='inline'>{this.context.darkModeOn === 'true' ? 'On' : 'Off'}</Typography>
        </div>
        <div>
          <Typography display='inline' variant='h5'>Receive Emails?</Typography>
          <IconButton sx={{position: 'relative', bottom:6 }} onClick={this.handleInfo} ><HelpOutlineIcon fontSize='small' /></IconButton>
          {/* <Typography variant='body1'>First call will send emails by default to keep you in the loop about any changes in the status of your gigs, but you can opt out if you wish!</Typography> */}
          <div>
            <Switch
                onChange={this.context.toggleEmail}
                checked={this.context.user.emails}
              />
            <Typography display='inline'>{this.context.user.emails ? 'On' : 'Off'}</Typography>
          </div>
        </div>

        {/* <ChangePass /> */}

      </>
    );
  }
}

export default Settings;
