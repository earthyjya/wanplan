import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
class GGMapDayTimeline extends Component {
	getTransportComponent = (transport) => {
		if(transport && transport.mode){
			return (
				<div className="ggmap-transport-container">
					<div><FontAwesomeIcon icon="car" size="sm" /></div>
					<div>{ transport.mode}</div>
				</div>
			)
		}
		else{
			return <div className="ggmap-transport-container"> No transport </div>
		}
	}
	getAttComponent = (detail) =>{
		return(
			<div className="ggmap-att-container">
				<div><FontAwesomeIcon icon="camera" size="sm" /></div>
				<div>{ detail.attraction_name}</div>
			</div>
		)
	}
	render() {
		const { plan_detail, day, editing, transports } = this.props;
		let start = "";
    let destination = "";
    let idx = day - 1;
		return (
			<div className="ggmap-day-timeline">
				<div className="ggmap-day-title"> Day {day}</div>
				<div> Hotel </div>
				{
					(() => {
						let att_show = []
						let idx = 0
						plan_detail.map(detail => {
							if(idx === 0) att_show.push(this.getTransportComponent(transports[day-1][idx]))
							att_show.push(this.getAttComponent(detail))
							att_show.push(this.getTransportComponent(transports[day-1][idx+1]))
							idx = idx + 1
						})
						return att_show
					})()
				}
				<div> Hotel </div>
			</div>
		);
	}
}

export default GGMapDayTimeline;
