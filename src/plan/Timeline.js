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
        <Request url= {this.state.serverIP + ":3030/trip_detail"}>
                {result => <AttCardList {...result} />}
        </Request>
      </div>
    );
  }
}

export default Timeline;
