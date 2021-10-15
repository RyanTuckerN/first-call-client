import * as React from 'react';
import { Component } from 'react';
import CallStackCreate from './CallStackCreate';

interface GigCreateProps {
  
}
 
interface GigCreateState {
  
}
 
class GigCreate extends Component<GigCreateProps, GigCreateState> {
  constructor(props: GigCreateProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
      <div>
        Hello From GigCreate.tsx!
        <CallStackCreate />
      </div>
     );
  }
}
 
export default GigCreate;