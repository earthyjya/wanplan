import React, { Component } from "react";

class MyPlan extends Component {
	savedPlan() {
		let _planlist = JSON.parse(localStorage.getItem("planlist"));
		if (_planlist !== null) {
			return _planlist.map(plan => (
				<div key={plan.plan_id}>
					<a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
				</div>
			));
		} else {
			return <div>No saved plan yet!</div>;
		}
	}

	createNewPlan(){
    // Create new url then redirect to the editPlan page of that url
    console.log("CREATE NEW PLAN HERE")
  }

	render() {
		const { isLoading, error, data } = this.props;
		if (isLoading) return <div>Loading...</div>;
		if (error) return <div>Can't find the plan</div>;

		return (
			<React.Fragment>
				<button className="new_plan_button" onclick={this.createNewPlan}>
					Create new plan
				</button>
				<div>
					{data.map(plan => (
						<div key={plan.plan_id}>
							<a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
						</div>
					))}
				</div>
				<div> Saved Plan </div>
				<div>{this.savedPlan()}</div>
			</React.Fragment>
		);
	}
}

export default MyPlan;
