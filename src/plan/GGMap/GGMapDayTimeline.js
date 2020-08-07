import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class GGMapDayTimeline extends Component {
	getTransportComponent = (transport) => {
		if (transport && transport.mode) {
			return (
				<div className="ggmap-transport-container">
					{(() => {
						if (transport.mode === "driving")
							return (
								<span>
									<FontAwesomeIcon icon="car" size="sm" />
									<span>{" " + transport.text}</span>
								</span>
							);
						if (transport.mode === "transit")
							return (
								<span>
									<FontAwesomeIcon icon="train" size="sm" />
									<span>{" " + transport.text}</span>
								</span>
							);
						if (transport.mode === "walking")
							return (
								<span>
									<FontAwesomeIcon icon="walking" size="sm" />
									<span>{" " + transport.text}</span>
								</span>
							);
					})()}
					{/*<div>{transport.mode}</div>*/}
				</div>
			);
		} else {
			return <div className="ggmap-transport-container"> No transport </div>;
		}
	};

	getAttComponent = (detail) => {
		return (
			<div className="ggmap-att-container">
				<div>
					<FontAwesomeIcon icon="camera" size="sm" />
				</div>
				<div>{detail.attraction_name}</div>
			</div>
		);
	};

	setFocusDay = () => {
		this.props.setFocusDay(this.props.day);
	};

	render() {
		const { plan_detail, day, editing, transports } = this.props;
		if (this.props.focusDay === this.props.day) {
			return (
				<div className="ggmap-day-timeline">
					<div className="ggmap-day-title"> Day {day}</div>
					<div> Hotel </div>
					{(() => {
						let att_show = [];
						let idx = 0;
						plan_detail.map((detail) => {
							if (idx === 0)
								att_show.push(
									this.getTransportComponent(transports[day - 1][idx])
								);
							att_show.push(this.getAttComponent(detail));
							att_show.push(
								this.getTransportComponent(transports[day - 1][idx + 1])
							);
							idx = idx + 1;
						});
						return att_show;
					})()}
					<div> Hotel </div>
				</div>
			);
		} else {
			return (
				<div className="ggmap-day-timeline">
					<div className="ggmap-day-title" onClick={this.setFocusDay}>
						{" "}
						Day {day}
					</div>
				</div>
			);
		}
	}
}

export default GGMapDayTimeline;
