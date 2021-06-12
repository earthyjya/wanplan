import React, { Component } from "react";
import GGMapDayTimeline from "./GGMapDayTimeline.js";

class GGMapTimeline extends Component {
	render() {
		const { plan_detail, days, editing, isLoading, error } = this.props;
		return (
			<React.Fragment>
				{days.map((day) => (
					<GGMapDayTimeline
						{...this.props}
						plan_detail={plan_detail.filter((plan) => plan.day === day)}
						day={day}
						key={day.toString()}
						showDetails={this.props.showDetails}
					/>
				))}
			</React.Fragment>
		);
	}
}

export default GGMapTimeline;
