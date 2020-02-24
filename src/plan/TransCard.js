import React, { Component } from "react";
import "./TransCard.css";

class TransCard extends Component {
  render() {
    const { start, destination } = this.props;
    return (
     <div className="Transcard">
        <div className="transport">transport  </div>
        <div className="from">
           From
        </div>
        <div className="start">{start} </div>
        <div className="to">  to </div>
        <div className="destination">{" " + destination}</div>


      </div>

    );
  }
}

export default TransCard;
