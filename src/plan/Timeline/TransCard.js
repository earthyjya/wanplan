import React, { Component } from "react";
import "../../scss/TransCard.scss";

class TransCard extends Component {
  render() {
    const { start, destination } = this.props;
    return (
      <div className="Transcard">
        <div className="transport">Transport </div>
        <div className="from"> from </div>
        <div className="start">{start.attraction_name} </div>
        <div className="to"> to </div>
        <div className="destination">{" " + destination.attraction_name}</div>
      </div>
    );
  }
}

export default TransCard;
