import React, { Component } from "react";

class MyPlan extends Component {

	savedPlan(){
		let _planlist = JSON.parse(localStorage.getItem("triplist"));
		if(_planlist !== null){
			return(
				_planlist.map(trip => (
				<div>
					<a href={"/plan/" + trip.trip_id}>{trip.trip_name}</a>
				</div>
				))
			)
		}
		else {
			return(<div>No saved plan yet!</div>)
		}
	}
	render() {
		const { isLoading, error, data } = this.props;
		if (isLoading) return <div>Loading...</div>;
		if (error) return <div>Can't find the plan</div>;

		return (
			<React.Fragment>
				<div>
					{data.map(trip => (
						<div>
							<a href={"/plan/" + trip.trip_id}>{trip.trip_name}</a>
						</div>
					))}
				</div>
				<div> Saved Plan </div>
				<div>
					{
						this.savedPlan()
					}
				</div>
			</React.Fragment>
		);
	}
}

export default MyPlan;
