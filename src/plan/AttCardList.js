import React, { Component } from "react";
import AttCard from "./AttCard";
import Request from "../lib/Request";

class AttCardList extends Component {
  render() {
    const { isLoading, error, trip_detail, serverIP, jsonPort } = this.props;
    if (isLoading) return <div className="AttList">Loading...</div>;
    if (error)
      return <div className="AttList">Something went wrong :(</div>;
    return (
      <div className="AttList">
        {trip_detail.map(detail => (
          <Request
            key={detail.order}
            url={
              serverIP +
              ":" +
              jsonPort +
              "/attraction?attraction_id=" +
              detail.attraction_id
            }
          >
            {result => <AttCard {...result} {...detail} />}
          </Request>
        ))}
      </div>
    );
  }
}

export default AttCardList;
