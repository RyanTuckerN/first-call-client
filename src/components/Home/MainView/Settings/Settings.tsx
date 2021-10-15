import * as React from 'react';
import { Component } from 'react';
import ChangePass from './ChangePass';

interface SettingsProps {
  
}
 
interface SettingsState {
  
}
 
class Settings extends Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
      <div>
        Hello from Settings.tsx!
        <ChangePass />
      </div>
     );
  }
}
 
export default Settings;