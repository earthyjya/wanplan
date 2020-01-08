import React, { Component } from "react";

class PlaceCard extends React.Component {
	render() {
		const { detail } = this.props;
		return (
			<div className="placeCard">
				<div class = "timeFrom">{detail.timeFrom}</div>
				<div class = "timeUntil">{detail.timeUntil}</div>
				<h2 class = "attName">{detail.attractionName}</h2>
				<h3 class = "attType">{detail.attractionType}</h3>
				<h6>Last Updated {detail.updatedTime}</h6>
			</div>
		);
	}
}

export default PlaceCard;
