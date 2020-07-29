import React, { Component } from "react";
class GGMapDayTimeline extends Component {
	render() {
		const { plan_detail, day, editing } = this.props;
		let start = "";
    let destination = "";
    let idx = day - 1;
		return (
			<div>
				<div className="DayTitle"> Day {day}</div>
				<div className="DayInfo">
					xx places | estimated time: xx | budget: xxxx JPY
				</div>
				{plan_detail.map(detail => (
					<div key={detail.attraction_order}>
						<div>Att</div>
						<div>Trans</div>
					</div>
				))}
			</div>
		);
	}
}

export default GGMapDayTimeline;
