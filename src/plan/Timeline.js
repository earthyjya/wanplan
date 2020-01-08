import React, { Component } from "react";
import AttCardList from "./AttCardList";
import Request from "../lib/Request";

class Timeline extends React.Component {
  state = {
    serverIP: "",
    day : 1
  };

  componentDidMount() {
    this.setState({serverIP: this.props.serverIP})
  }

  addDay = () => {
    this.props.changeDays(this.props.days.length + 1)
  }
  render() {

    return (
      <div className="Timeline">
  <h2>Day {this.props.day}</h2>
        <Request url= {this.props.serverIP + ":3030/trip_detail"}>
                {result => <AttCardList {...result} serverIP = {this.props.serverIP} />}
        </Request>
        <button onClick = {this.addDay}>+</button>
      </div>
    );
  }
}

export default Timeline;
