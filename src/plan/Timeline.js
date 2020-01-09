import React, { Component } from "react";
import AttCardList from "./AttCardList";
import Request from "../lib/Request";

class Timeline extends React.Component {
  state = {
    day: 1
  };

  componentDidMount() {}

  addDay = () => {
    this.props.addDays(this.props.days.length + 1);
  };
  render() {
    return (
      <div className="Timeline">
        <h2>Day {this.props.day}</h2>
        <Request
          url={
            this.props.serverIP +
            ":" +
            this.props.jsonPort +
            "/trip_detail?trip_id=" +
            this.props.trip_overview.trip_id +
            "&day=" +
            this.props.day
          }
        >
          {result => <AttCardList {...result} {...this.props} />}
        </Request>

        <button onClick={this.addDay}>+</button>

      </div>
    );
  }
}

export default Timeline;
