import "../../scss/TransCard.scss";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TransCard extends Component {
  render() {
    const { start, destination, transport } = this.props;
    if (!start || !destination)
      return (
        <div className="TransCardTimeContainer">
          <div className="Transcard">
            <div className="no-transport">Place not defined</div>
          </div>
        </div>
      );
    return (
      <div className="TransCardTimeContainer">
        <div className="Transcard">
          {(() => {
            if (transport) {
              if (transport.text === "No transportation data")
                return (
                  <div className="no-transport">No transportation data</div>
                );
              return (
                <React.Fragment>
                  {/* <div className="fromTo">
                     <span> from </span>
                     <span> {start.attraction_name} </span>
                     <span> to </span>
                    <span> {destination.attraction_name} </span>
                  </div>*/}
                  <div className="transport">
                    <span> {transport.distance} </span>
                    {(() => {
                      if (transport.mode === "driving")
                        return (
                          <span>
                            <FontAwesomeIcon icon="car" size="sm" />
                            <span>{transport.text}</span>
                          </span>
                        );
                      if (transport.mode === "transit")
                        return (
                          <span>
                            <FontAwesomeIcon icon="train" size="sm" />
                            <span>{transport.text}</span>
                          </span>
                        );
                      if (transport.mode === "walking")
                        return (
                          <span>
                            <FontAwesomeIcon icon="walking" size="sm" />
                            <span>{transport.text}</span>
                          </span>
                        );
                    })()}
                  </div>
                  <a
                    className="map"
                    href={
                      "https://www.google.com/maps/dir/?api=1&origin=" +
                      start.attraction_name +
                      "&origin_place_id=" +
                      start.google_place_id +
                      "&destination=" +
                      destination.attraction_name +
                      "&destination_place_id=" +
                      destination.google_place_id
                    }
                    target="_blank"
                  >
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
      </div>
    );
  }
}

export default TransCard;
