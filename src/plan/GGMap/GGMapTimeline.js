import React, { Component } from "react";
import GGMapDayTimeline from "./GGMapDayTimeline.js"

class GGMapTimeline extends Component {
	render() {
		const { plan_detail, days, editing, isLoading, error } = this.props;
		return (
			<div>
				{days.map(day => (
					<GGMapDayTimeline
						{...this.state}
						{...this.props}
						plan_detail = {plan_detail.filter(plan => plan.day === day)}
						day={day}
						key={day.toString()}
						showDetails={this.props.showDetails}
					/>
				))}
			</div>
		);
	}
}

export default GGMapTimeline;
