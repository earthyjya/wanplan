import React, { Component } from "react";
import AttCard from "./AttCard";
import Request from "../lib/Request";

class AttCardList extends Component {
  render() {
    if (this.props.isLoading) return <div className="AttList">Loading...</div>;
    if (this.props.error)
      return <div className="AttList">Something went wrong :(</div>;
    return (
      <div className="AttList">
        {this.props.trip_detail.map(data => (
          <Request
            key={data.order}
            url={
              this.props.serverIP +
              ":" +
              this.props.jsonPort +
              "/attraction?attraction_id=" +
              data.attraction_id
            }
          >
            {result => <AttCard {...result} {...data} />}
          </Request>
        ))}
      </div>
    );
  }
}

export default AttCardList;
