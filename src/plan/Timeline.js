import React, { Component } from "react";
import AttCardList from "./AttCardList";
import Request from "../lib/Request";

class Timeline extends React.Component {
  state = {
    serverIP: "http://192.168.0.145"
    
  };

  componentDidMount() {
    
  }
  render() {

    return (
      <div className="Timeline">
        <h1>Your wonderful Trip !!!!!!</h1>
        <Request url= {this.state.serverIP + ":3030/trip_detail"}>
                {result => <AttCardList {...result} />}
        </Request>
      </div>
    );
  }
}

export default Timeline;
