import React, { Component } from "react";
import './AttCard.css';

class AttCard extends React.Component {
	render() {
		
		return (
			<div className="AttCard">
				{this.props.isLoading ? (
      <div>Loading...</div>
    ) : this.props.error ? (
      <div>{this.props.error.message}</div>
    ) : (
		//{
		//	const data = this.props.data;
		//}
		this.props.data.map(dat => {
          
			return (
				<div class = "Attcard">
					<div className = "timeFrom">{this.props.start_time}</div>
					<div className = "timeUntil">{this.props.end_time}</div>
					<div className = "attPhoto"></div>
					<h2 className = "attName">{dat.attraction_name}</h2>
				</div>
				
				)}))}
			</div>
		);
	}
}

export default AttCard;
