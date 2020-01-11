import React from "react";
import Share from "./Share";
import Timeline from "./Timeline";
import AttracDes from "./AttracDes";
import AttBar from "./AttBar";
import Request from "../lib/Request.js";

class Plan extends React.Component {
  state = {
    modal: false,
    trip_id: null,
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

  changeDays = n => {
    this.setState({ days: [...this.state.days, n] });
  };

  render() {
    return (
      <div>
        <div className="title-bar">
          <div className="city">{this.state.city_name}</div>
          <div className="title">{this.state.trip_title}</div>
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

        <h1>{this.state.days.length} Day Trip</h1>
        {this.state.days.map(day => {
          return (
            <Timeline
              {...this.state}
              serverIP={this.props.serverIP}
              changeDays={this.changeDays}
              day={day}
            />
          );
        })}

        <Request url={this.props.serverIP + ":3030/attraction"}>
          {result => <AttBar {...result} {...this.state} />}
        </Request>

        <AttracDes {...this.state} />
      </div>
    );
  }
}

export default Plan;
