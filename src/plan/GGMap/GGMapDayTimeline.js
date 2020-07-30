import React, { Component } from "react";
class GGMapDayTimeline extends Component {
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
						let getTransport = (t) => {if(t && t.mode){return t.mode} else{return "No transport"}}
						plan_detail.map(detail => {
							if(idx === 0) att_show.push(<div>{getTransport(transports[day-1][idx])}</div>)
							att_show.push(<div className="ggmap-att-name">{detail.attraction_name}</div>)
							att_show.push(<div>{getTransport(transports[day-1][idx+1])}</div>)
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
