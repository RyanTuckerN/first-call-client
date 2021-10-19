import * as React from 'react';
import { Component } from 'react';
import Board from './Board';
import GigInfo from './GigInfo';

interface GigPageProps {
  
}
 
interface GigPageState {
  
}
 
class GigPage extends Component<GigPageProps, GigPageState> {
  constructor(props: GigPageProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
      <div>
        Hello From GigPage.tsx!
        <GigInfo />
        <Board />
        
      </div>
     );
  }
}
 
export default GigPage;