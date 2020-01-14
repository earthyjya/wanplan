import React, { Component } from "react";
import "./AttBar.css";
import AttBarCard from "./AttBarCard.js";

class AttBar extends Component {
  render() {
    return (
      <div className="AttBar">
        <input type="text" placeholder="search" />

        {this.props.isLoading ? (
          <div>Loading...</div>
        ) : this.props.error ? (
          <div>{this.props.error.message}</div>
        ) : (
          this.props.data.map(dat => <AttBarCard {...dat} key = {dat.attraction_id.toString()}/>)
        )}
      </div>
    );
  }
}

export default AttBar;
