import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

class TransCard extends Component {
  render() {
    const { start, destination } = this.props;
    return (
      <div>
        <div>transport</div>
        <div>
          From {start} to{" " + destination}
        </div>
      </div>
    );
  }
}

export default TransCard;
