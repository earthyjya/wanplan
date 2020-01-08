import React, { Component } from "react";
import AttCard from "./AttCard";
import Request from "../lib/Request";

class AttCardList extends React.Component {
  state = {
    serverIP: "http://192.168.0.145"
  };
  render() {

    
    return (
      
      <div className="placeList">
        {this.props.isLoading ? (
      <div>Loading...</div>
    ) : this.props.error ? (
      <div>{this.props.error.message}</div>
    ) : (
    
        this.props.data.map(dat => {
          
          return (
          <Request url= {this.state.serverIP + ":3030/attraction?attraction_id=" + dat.attraction_id}>
                {result => <AttCard {...result} {...dat}/>}
          </Request>
        )}))}
        <button>Add</button>
        </div>
    );
  }
}

export default AttCardList;
