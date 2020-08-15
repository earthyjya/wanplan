import DayTimeline from "./DayTimeline";
import MobileDayTimeline from "../../mobile/MobileDayTimeline.js";
import React, { Component } from "react";
import { isMobileOnly } from "react-device-detect";

class Timeline extends Component {
  addDay = () => {
    this.props.addDay(0);
  };

  render() {
    const { plan_detail, days, editing, isLoading, error, startdayLoaded } = this.props;
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
        {(() => {
          if (!startdayLoaded) return <div>Loading...</div>;
          else{
          if (isMobileOnly) 
              return days.map((day) => (
                <MobileDayTimeline
                  {...this.state}
                  {...this.props}
                  plan_detail={plan_detail.filter((plan) => plan.day === day)}
                  day={day}
                  key={day.toString()}
                />
              ));
           else
            return days.map((day) => (
              <DayTimeline
                {...this.state}
                {...this.props}
                plan_detail={plan_detail.filter((plan) => plan.day === day)}
                day={day}
                key={day.toString()}
                showDetails={this.props.showDetails}
              />
            ));
          }
        })()}
      </div>
    );
  }
}

export default Timeline;
