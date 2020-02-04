import React, { Component } from "react";
import DayTimeline from "./DayTimeline";

class Timeline extends Component {
  addDay = () => {
    this.props.addDay(this.props.day);
  };

  delDay = () => {
    this.props.delDay(this.props.day);
  };

  render() {
    const {
      trip_detail,
      days,
      isLoading,
      error
    } = this.props;
    if (isLoading) return <div className="Timeline">Loading...</div>;
    if (error) return <div className="Timeline">Something went wrong :(</div>;
    return (
      <div className="Timeline">
        {days.map(day => (
          <DayTimeline
            {...this.state}
            {...this.props}
            trip_detail={trip_detail.filter(trip => trip.day === day)}
            day={day}
            key={day.toString()}
          />
        ))}
        <div>
          <button className="AddDay" onClick={this.addDay}>
            +
          </button>
          <hr style={{ margin: "0px 30px 30px 30px" }} />
        </div>

      </div>
    );
  }
}

export default Timeline;
