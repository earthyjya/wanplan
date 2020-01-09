import React, { Component } from "react";
import "./AttCard.css";

class AttCard extends React.Component {
	render() {
		if (this.props.isLoading) return <div>Loading...</div>;
		if (this.props.error) return <div>Something went wrong :(</div>;
		const [attraction, ...rest] = this.props.data;
		return (
			<div className="AttCard">
				<div className="timeFrom">{this.props.start_time}</div>
				<div className="timeUntil">{this.props.end_time}</div>
				<div className="attPhoto"></div>
				<h2 className="attName">{attraction.attraction_name}</h2>
			</div>
		);
	}
}

export default AttCard;
