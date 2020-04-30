import "../../scss/TransCard.scss";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TransCard extends Component {
  render() {
    const { start, destination, transport } = this.props;
    if (!start || !destination)
      return (
        <div className="Transcard">
          <div className="transport">Place not defined</div>
        </div>
      );
    return (
      <div className="Transcard">
        {(() => {
          if (transport) {
            if (transport.text === "No transportation data")
              return <div className="transport">{transport.text}</div>;
            return (
              <React.Fragment>
                <div>
                  from A to B
                </div>
                <div>
                  800m
                  <FontAwesomeIcon icon="walking" size="sm" /> 10min
                  <FontAwesomeIcon icon="train" size="sm" /> 5min
                  <FontAwesomeIcon icon="car" size="sm" /> 2min
                </div>
                <div>
                  Google Map
                </div>
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
