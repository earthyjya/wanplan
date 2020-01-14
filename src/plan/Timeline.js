import React, { Component } from "react";
import AttCardList from "./AttCardList";

class Timeline extends Component {
  addDay = () => {
    this.props.addDay(this.props.day);
  };

  delDay = () => {
    this.props.delDay(this.props.day);
  };

  render() {
    const { day } = this.props;
    return (
      <div className="Timeline">
        <div>
          <button className="AddDay" onClick={this.addDay}>
            +
          </button>
          <hr style={{ margin: "0px 30px 30px 30px" }} />
        </div>
        <div style={{}}>
          <button className="DelDay" onClick={this.delDay}>
            &#10005;
          </button>
          <h2>Day {day}</h2>
        </div>
        <AttCardList {...this.props} />
      </div>
    );
  }
}

export default Timeline;
