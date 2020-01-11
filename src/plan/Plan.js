import React from "react";
import Share from "./Share";
import Timeline from "./Timeline";
import axios from "axios";
import Request from "../lib/Request.js"
import AttBar from "./AttBar.js"

class Plan extends React.Component {
  state = {
    isLoading: true,
    error: null,
    modal: false,
    days: []
  };

  toggle = () => this.setState({ modal: !this.state.modal });

  close = () => {
    if (this.state.modal === true) {
      this.setState({ modal: false });
    }
  };

  addDay = day => {
    var { days, trip_overview, trip_detail } = this.state;
    days = days.concat(days.length + 1);
    trip_overview.duration += 1;
    trip_detail.map(detail => {
      if (detail.day >= day) detail.day += 1;
    });
    this.setState({
      days,
      trip_overview,
      trip_detail
    });
  };

  delDay = day => {
    var { days, trip_overview, trip_detail } = this.state;
    days.pop();
    trip_overview.duration -= 1;
    trip_detail = trip_detail.filter(trip => trip.day !== day);
    trip_detail.map(detail => {
      if (detail.day >= day) detail.day -= 1;
    });
    this.setState({
      days,
      trip_overview,
      trip_detail
    });
  };

  async componentDidMount() {
    // Since it has to fetch three times, we fetch it here and store the data in the state
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
    var [a, ...rest] = Array(this.state.trip_overview.duration + 1).keys();
    this.setState({ days: rest });
  }

  render() {
    const {
      isLoading,
      error,
      city,
      trip_overview,
      trip_detail,
      days,
      modal
    } = this.state;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Can't find the plan</div>;
    else
      return (
        <div>
          <div className="title-bar">
            <div className="city">{city.city_name}</div>
            <div className="title">{trip_overview.trip_name}</div>
            <div className="days">
              {trip_overview.duration > 1
                ? trip_overview.duration + " Days Trip"
                : "One Day Trip"}
            </div>
            <button className="share" onClick={this.toggle}>
              Share!
              <span style={{ fontSize: "15px" }}>
                <br />
                this plan
              </span>
            </button>
          </div>

          {modal ? (
            <div className="share-modal">
              <Share close={this.close} />
            </div>
          ) : (
            <div></div>
          )}

          {days.map(day => (
            <Timeline
              {...this.state}
              {...this.props}
              trip_detail={trip_detail.filter(trip => trip.day === day)}
              addDay={this.addDay}
              delDay={this.delDay}
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

          <Request url = {this.props.serverIP + ":3030/attraction"}>
            {result => <AttBar {...result}/>}
          </Request>

        </div>
      );
  }
}

export default Plan;
