import React, { Component } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import mapStyles from "./mapStyles";
class GGMap extends Component {
	render() {
		let mapContainerStyle = {
			width: "90vw",
			height: "90vh"
		};
		if (this.props.editing) {
			mapContainerStyle = {
				width: "60vw",
				height: "80vh"
			};
		}
		const center = {
			lat: 35.6804,
			lng: 139.769
		};
		const options = {
			styles: mapStyles,
			disableDefaultUI: true,
			zoomControl: true
		};
		return (
			<div>
				<h1>Map</h1>
				<GoogleMap
					mapContainerStyle={mapContainerStyle}
					zoom={11}
					center={center}
					options={options}
				>
					{this.props.plan_detail.map(detail => {
						if (detail.geometry)
							return (
								<Marker
									key={detail.attraction_order}
									position={{
										lat: detail.geometry.location.lat,
										lng: detail.geometry.location.lng
									}}
								/>
							);
						return null;
					})}
				</GoogleMap>
			</div>
		);
	}
}

export default GGMap;
