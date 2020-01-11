import React, { Component } from "react";

class MyPlan extends Component {
	render() {
		const { isLoading, error, data } = this.props;
		if (isLoading) return <div>Loading...</div>;
		if (error) return <div>Can't find the plan</div>;

		return (
			<div>
				{data.map(trip => (
					<div>
						<a href={"/plan/" + trip.trip_id}>{trip.trip_name}</a>
					</div>
				))}
			</div>
		);
	}
}

export default MyPlan;
