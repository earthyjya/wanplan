import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class GGMapDayTimeline extends Component {

	renderTransportComponent = (transports, day, idx) => {
		if(!Array.isArray(transports) || transports.length <= day || 
			 !Array.isArray(transports[day]) || transports[day].length <= idx || 
			 !transports[day][idx])
		{
			return (
			<div className="ggmap-transport-container">
				<span>
					<span>{"Transportation not found"}</span>
				</span>
			</div>
			);
		} 
			
		let transport = transports[day][idx];

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

	renderAttComponent = (detail) => {
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

	renderComponents = (plan_detail, transports, day) => {
		if(!plan_detail) return(<></>);
		let att_show = [];
		plan_detail.map((detail, idx) => {
			if (idx === 0)
				att_show.push(
					this.renderTransportComponent(transports, day-1, idx)
				);
			att_show.push(this.renderAttComponent(detail));
			att_show.push(
				this.renderTransportComponent(transports, day-1, idx+1)
			);
		});
		return att_show;
	}

	render() {
		const { plan_detail, day, editing, transports } = this.props;
		if (this.props.focusDay === this.props.day) {
			return (
				<div className="ggmap-day-timeline">
					<div className="ggmap-day-title"> Day {day}</div>
					<div> Hotel </div>
					{this.renderComponents(plan_detail, transports, day)}
					<div> Hotel </div>
				</div>
			);
		} else {
			return (
				<div className="ggmap-day-timeline">
					<div className="ggmap-day-title" onClick={this.setFocusDay}>
						{` Day ${day}`}
					</div>
					<div> Hotel </div>
					{this.renderComponents(plan_detail, transports, day)}
					<div> Hotel </div>
				</div>
			);
		}
	}
}

export default GGMapDayTimeline;
