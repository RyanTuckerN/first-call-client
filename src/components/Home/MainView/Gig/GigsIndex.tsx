import * as React from 'react';
import { Component } from 'react';
import GigCreate from './GigCreate';
import GigEdit from './GigEdit';
import GigInvite from './GigInvite';
import GigPage from './GigPage';

interface GigIndexProps {
  
}
 
interface GigIndexState {
  
}
 
class GigIndex extends Component<GigIndexProps, GigIndexState> {
  constructor(props: GigIndexProps) {
    super(props);
    // this.state = { :  };
  }
  render() { 
    return ( 
    <div>
      Hello from GigsIndex.tsx
      <GigPage />
      <GigCreate />
      <GigInvite />
      <GigEdit />
    </div> );
  }
}
 
export default GigIndex;