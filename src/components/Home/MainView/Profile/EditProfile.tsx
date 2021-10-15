import * as React from 'react';
import { Component } from 'react';

interface EditProfileProps {
  
}
 
interface EditProfileState {
  
}
 
class EditProfile extends Component<EditProfileProps, EditProfileState> {
  constructor(props: EditProfileProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
      <div>
        Hello From EditProfile.tsx!
      </div>
     );
  }
}
 
export default EditProfile;