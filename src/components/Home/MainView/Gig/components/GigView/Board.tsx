import * as React from "react";
import { Component } from "react";

interface BoardProps {}

interface BoardState {}

class Board extends Component<BoardProps, BoardState> {
  constructor(props: BoardProps) {
    super(props);
    // this.state = { :  };
  }
  render() {
    return <div>Hello from Board.tsx!</div>;
  }
}

export default Board;
