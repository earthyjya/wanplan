import "../../scss/TransCard.scss";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TransCard extends Component {
  state = {
    mode: "driving",
    text: "",
  };

  changeMode = (e) => {
    const { day, order } = this.props;
    this.props.changeTransportMode(day, order, e.target.value);
  };

  changeText = (e) => {
    const { day, order } = this.props;
    this.props.changeTransportText(day, order, e.target.value * 5 + " mins");
  };

  static getDerivedStateFromProps(NextProps) {
    return {
      mode: NextProps.transport ? NextProps.transport.mode : "driving",
      text: NextProps.transport ? NextProps.transport.text : "",
    };
  }

  render() {
    const { start, destination, transport, transLoaded, editing } = this.props;
    const { mode, text } = this.state;
    if (!start && destination.attraction_name === "Hotel")
      return (
        <div className="TransCardTimeContainer">
          <div className="Transcard">
            <div className="no-transport">Place not defined</div>
          </div>
        </div>
      );
    else if (!start || !transport)
      return (
        <div className="TransCardTimeContainer">
          <div className="Transcard">
            <div className="no-transport">No transportation data</div>{" "}
          </div>
        </div>
      );
    return (
      <div className="TransCardTimeContainer">
        <div className="Transcard">
          {(() => {
            if (transport && transLoaded) {
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
                      if (!editing) {
                        if (mode === "driving")
                          return (
                            <span>
                              <FontAwesomeIcon icon="car" size="sm" />
                              <span> {text} </span>
                            </span>
                          );
                        if (mode === "transit")
                          return (
                            <span>
                              <FontAwesomeIcon icon="train" size="sm" />
                              <span> {text} </span>
                            </span>
                          );
                        if (mode === "walking")
                          return (
                            <span>
                              <FontAwesomeIcon icon="walking" size="sm" />
                              <span> {text} </span>
                            </span>
                          );
                      } else {
                        return (
                          <span>
                            <select
                              style={{ fontFamily: "FontAwesome" }}
                              value={mode}
                              onChange={this.changeMode}
                            >
                              <option value="transit" key="transit">
                                &#xf238;
                              </option>
                              <option value="driving" key="driving">
                                &#xf1b9;
                              </option>
                              <option value="walking" key="walking">
                                &#xf554;
                              </option>
                            </select>
                            <select
                              value={Math.ceil(text.split(" ")[0] / 5)}
                              onChange={this.changeText}
                            >
                              {[...Array(100).keys()].map((key) => (
                                <option value={key} key={key}>
                                  {key * 5} mins
                                </option>
                              ))}
                            </select>
                          </span>
                        );
                      }
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
