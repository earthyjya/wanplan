import React from "react";
import Share from "./Share";
import Timeline from "./Timeline";
import AttInfo from "./AttInfo";
import axios from "axios";

class Plan extends React.Component {
  state = {
    isLoading: true,
    error: null,
    modal: false,
    days: [1]
  };

  toggle = () => this.setState({ modal: !this.state.modal });

  close = () => {
    if (this.state.modal === true) {
      this.setState({ modal: false });
    }
  };

  async componentDidMount() {
    const { serverIP, jsonPort, trip_id } = this.props;
    var url = serverIP + ":" + jsonPort + "/trip_overview?trip_id=" + trip_id;
    await axios
      .get(url)
      .then(result => {
        const [trip_overview, ...rest] = result.data;
        this.setState({ trip_overview });
      })
      .catch(error => this.setState({ error }));
    if (!this.state.trip_overview) {
      this.setState({ isLoading: false, error: true });
      return;
    }

    url =
      serverIP + ":" + jsonPort + "/trip_detail?_sort=order&trip_id=" + trip_id;
    await axios
      .get(url)
      .then(result => this.setState({ trip_detail: result.data }))
      .catch(error => this.setState({ error }));

    url =
      serverIP +
      ":" +
      jsonPort +
      "/city?city_id=" +
      this.state.trip_overview.city_id;
    await axios
      .get(url)
      .then(result => {
        const [city, ...rest] = result.data;
        this.setState({ city, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  addDays = () => {
    this.setState({ days: [...this.state.days, this.state.days.length + 1] });
  };

  render() {
    const { isLoading, error, city, trip_overview, trip_detail } = this.state;
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
              trip_detail={trip_detail.filter(trip => trip.day === day)}
              addDays={this.addDays}
              day={day}
              key={day.toString()}
            />
          ))}

          <AttInfo {...this.state} />
        </div>
      );
  }
}

export default Plan;
