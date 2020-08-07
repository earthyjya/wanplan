import DayTimeline from "./DayTimeline";
import MobileDayTimeline from "../../mobile/MobileDayTimeline.js"
import React, { Component } from "react";
import {isMobile} from "react-device-detect";

class Timeline extends Component {
  addDay = () => {
    this.props.addDay(0);
  };

  render() {
    const { plan_detail, days, editing, isLoading, error } = this.props;
    if (isLoading) return <div className="Timeline">Loading...</div>;
    if (error) return <div className="Timeline">Something went wrong :(</div>;
    return (
      <div className="Timeline">
        <div>
          {(() => {
            if (editing)
              return (
                <button className="AddDay" onClick={this.addDay}>
                  +
                </button>
              );
          })()}
          <hr style={{ margin: "0px 0px 40px 0px" }} />
        </div>
        { (() => {
          if(isMobile)
            return(
              days.map(day => (
                <MobileDayTimeline
                  {...this.state}
                  {...this.props}
                  plan_detail={plan_detail.filter(plan => plan.day === day)}
                  day={day}
                  key={day.toString()}
                  showDetails={this.props.showDetails}
                />)
              )
            )
          else
            return(
              days.map(day => (
                <DayTimeline
                  {...this.state}
                  {...this.props}
                  plan_detail={plan_detail.filter(plan => plan.day === day)}
                  day={day}
                  key={day.toString()}
                  showDetails={this.props.showDetails}
                />)
              )
            )
          })()
        }
      </div>
    );
  }
}

export default Timeline;
