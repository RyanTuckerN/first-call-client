import * as React from 'react';
import { Component } from 'react';
import EditProfile from './EditProfile';

interface ProfileProps {
  
}
 
interface ProfileState {
  
}
 
class Profile extends Component<ProfileProps, ProfileState> {
  constructor(props: ProfileProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
      <div>
        Hello from Profile.tsx
        <EditProfile />
      </div>
     );
  }
}
 
export default Profile;