import "../../scss/TransCard.scss";
import React, { Component } from "react";

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
                <div className="start">{transport.text}</div>
                <div className="transport" style={{ marginLeft: "5px" }}>
                  {" "}
                  by {transport.mode}
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
