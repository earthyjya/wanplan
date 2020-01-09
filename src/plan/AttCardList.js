import React, { Component } from "react";
import AttCard from "./AttCard";
import Request from "../lib/Request";

class AttCardList extends React.Component {
  state = {};

  componentDidMount() {}
  render() {
    return (
      <div className="AttList">
        {this.props.isLoading ? (
          <div>Loading...</div>
        ) : this.props.error ? (
          <div>{this.props.error.message}</div>
        ) : (
          this.props.data.map(dat => (
            <div key={dat.atraction_id}>
              <Request
                url={
                  this.props.serverIP +
                  ":" +
                  this.props.jsonPort +
                  "/attraction?attraction_id=" +
                  dat.attraction_id
                }
              >
                {result => <AttCard {...result} {...dat} />}
              </Request>
            </div>
          ))
        )}
        <button>Add</button>
      </div>
    );
  }
}

export default AttCardList;
