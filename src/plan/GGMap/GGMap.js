import React, { Component } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import mapStyles from "./mapStyles";
import { Row, Col, Container, Toast, ToastBody, ToastHeader } from "reactstrap";
import GGMapTimeline from "./GGMapTimeline.js";
import "../../scss/GGMap.scss";

class GGMap extends Component {
	state = {
		focusDay: 1,
	};

	setFocusDay = (d) => {
		this.setState({ focusDay: d });
	};

	render() {
		let mapContainerStyle = {
			width: "100%",
			height: "100%",
			padding: "5%",
		};
		const center = {
			lat: 35.6804,
			lng: 139.769,
		};
		const options = {
			styles: mapStyles,
			disableDefaultUI: true,
			zoomControl: true,
		};
		return (
			<div className="ggmap-container">
				<div className="ggmap-map-container">
					<GoogleMap
						mapContainerStyle={mapContainerStyle}
						zoom={11}
						center={center}
						options={options}
					>
						{this.props.plan_detail
							.filter((det) => det.day === this.state.focusDay)
							.map((detail) => {
								if (detail.geometry)
									return (
										<Marker
											key={detail.attraction_order}
											position={{
												lat: detail.geometry.location.lat,
												lng: detail.geometry.location.lng,
											}}
										/>
									);
								return null;
							})}
					</GoogleMap>
				</div>
				<div className="ggmap-timeline-container">
					<GGMapTimeline
						{...this.state}
						{...this.props}
						setFocusDay={this.setFocusDay}
					/>
				</div>
			</div>
		);
	}
}

export default GGMap;
