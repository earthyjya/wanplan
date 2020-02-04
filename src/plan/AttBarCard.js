import React, { Component } from "react";

class AttBarCard extends Component {
  render() {
    const {
      attraction_name,
      attraction_type,
      open_time,
      close_time,
      description
    } = this.props;
    return (
      <div className="AttBarCard" >
        <div className="attPhoto2"></div>
        <div style={{ float: "left", margin: "12px" }}>
          <div className="attName2">{attraction_name}</div>
          <div className="attType2">{attraction_type}</div>
          
          <div className="description">
            <div>
              <u> opening hours</u> : {open_time} - {close_time}
            </div>
            <div>{description}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default AttBarCard;
