import * as React from 'react';
import { Component } from 'react';

interface RespondProps {
  
}
 
interface RespondState {
  
}
 
class Respond extends Component<RespondProps, RespondState> {
  constructor(props: RespondProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
      <div>
        Hello from Respond.tsx!
      </div>
     );
  }
}
 
export default Respond;