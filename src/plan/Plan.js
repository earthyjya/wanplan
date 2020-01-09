import React from "react";
import Share from "./Share";
import Timeline from "./Timeline";
import AttracDes from "./AttracDes";

class Plan extends React.Component {
  state = {
    modal: false,
    days: [1]
  };

  toggle = () => this.setState({ modal: !this.state.modal });

  close = () => {
    if (this.state.modal === true) {
      this.setState({ modal: false });
    }
  };

  componentDidMount() {
    // DO sth
  }

  addDays = () => {
    this.setState({ days: [...this.state.days, this.state.days.length + 1] });
  };

  render() {
    const { isLoading, error, city, trip_overview, trip_detail } = this.props;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Can't find the plan</div>;
    else
      return (
        <div>
          <div className="title-bar">
            <div className="city">{city.city_name}</div>
            <div className="title">{trip_overview.trip_name}</div>
            <div className="days">
              {trip_overview.duration}{" "}
              {trip_overview.duration > 1 ? "Days" : "Day"} Trip
            </div>
            <button className="share" onClick={this.toggle}>
              Share!
              <span style={{ fontSize: "15px" }}>
                <br />
                this plan
              </span>
            </button>
          </div>

          {this.state.modal ? (
            <div className="share-modal">
              <Share close={this.close} />
            </div>
          ) : (
            <div></div>
          )}

          

          {this.state.days.map(day => (
            <Timeline
              {...this.state}
              {...this.props}
              addDays={this.addDays}
              day={day}
              key={day.toString()}
            />
          ))}

          <AttracDes {...this.state} />
        </div>
      );
  }
}

export default Plan;
