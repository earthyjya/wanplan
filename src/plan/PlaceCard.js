import React, { Component } from "react";

class PlaceCard extends React.Component {
	render() {
		const { detail } = this.props;
		return (
			<div class="placeCard">
				<h2>{detail.attractionName}</h2>
				<h3>{detail.attractionType}</h3>
				<div>
					opening hours : {detail.openTime} - {detail.closeTime}
				</div>
				<div>{detail.cityId}</div>
				<div>Entry Fee : {detail.entryFee} Yen</div>
				<h6>Last Updated {detail.updatedTime}</h6>
			</div>
		);
	}
}

export default PlaceCard;
