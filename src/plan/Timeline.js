import React, { Component } from "react";
import AttCardList from "./AttCardList";
import Request from "../lib/Request";

class Timeline extends Component {
  addDay = () => {
    this.props.addDays(this.props.days.length + 1);
  };
  render() {
    return (
      <div className="Timeline">
        <h2 style={{padding: "10px 0px 5px 10px"}}>Day {this.props.day}</h2>
        <hr />
        <AttCardList {...this.props} />

        <button className="AddDay" onClick={this.addDay}>+</button>
      </div>
    );
  }
}

export default Timeline;
