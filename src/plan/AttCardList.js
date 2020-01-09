import React, { Component } from "react";
import AttCard from "./AttCard";
import Request from "../lib/Request";

class AttCardList extends React.Component {
  state = {
  };

  componentDidMount(){

  }
  render() {

    
    return (
      
      <div className="AttList">
        {this.props.isLoading ? (
      <div>Loading...</div>
    ) : this.props.error ? (
      <div>{this.props.error.message}</div>
    ) : (
    
        this.props.data.map(dat => {
          
          return (
          <Request url= {this.props.serverIP + ":3030/attraction?attraction_id=" + dat.attraction_id} key = {dat.atraction_id}>
                {result => <AttCard {...result} {...dat} />}
          </Request>
        )}))}
        <button>Add</button>
        </div>
    );
  }
}

export default AttCardList;
