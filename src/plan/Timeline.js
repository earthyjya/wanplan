import React, { Component } from "react";
import AttCardList from "./AttCardList";
import Request from "../lib/Request";

class Timeline extends React.Component {
  state = {
    serverIP: ""
    
  };

  componentDidMount() {
    this.setState({serverIP: this.props.serverIP})
  }
  render() {

    return (
      <div className="Timeline">
        <h1>Your wonderful Trip !!!!!!</h1>
        <Request url= {this.props.serverIP + ":3030/trip_detail"}>
                {result => <AttCardList {...result} serverIP = {this.props.serverIP} />}
        </Request>
      </div>
    );
  }
}

export default Timeline;
