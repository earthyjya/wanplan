import "../../scss/TransCard.scss";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TransCard extends Component {
  render() {
    const { start, destination, transport } = this.props;
    if (!start || !destination)
      return (
        <div className="Transcard">
          <div className="no-transport">Place not defined</div>
        </div>
      );
    return (
      <div className="Transcard">
        {(() => {
          if (transport) {
            if (transport.text === "No transportation data")
              return <div className="no-transport">{transport.text}</div>;
            return (
              <React.Fragment>
                <div className="fromTo">
                  <span> from </span>
                  <span> {start.attraction_name} </span>
                  <span> to </span>
                  <span> {destination.attraction_name} </span>
                </div>
                <div className="transport">
                  <span> 800m </span>
                  <span> <FontAwesomeIcon icon="walking" size="sm" /> <span>10min</span></span>
                  <span> <FontAwesomeIcon icon="train" size="sm" /> <span>5min</span></span>
                  <span> <FontAwesomeIcon icon="car" size="sm" /> <span>2min</span></span>
                </div>
                <a className="map" href="https://www.google.com/maps">
                  Google Map
                </a>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment>
              <div className="transport">Loading..</div>
            </React.Fragment>
          );
        })()}
      </div>
    );
  }
}

export default TransCard;
