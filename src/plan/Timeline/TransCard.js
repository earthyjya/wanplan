import React, { Component } from "react";
import "../../scss/TransCard.scss";

class TransCard extends Component {
  render() {
    const { start, destination } = this.props;
    return (
     <div className="Transcard">
        <div className="transport">transport  </div>
        <div className="from">
           From
        </div>
        <div className="start">{start.attraction_name} </div>
        <div className="to">  to </div>
        <div className="destination">{" " + destination.attraction_name}</div>


      </div>

    );
  }
}

export default TransCard;
