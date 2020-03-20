import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class MyPlan extends Component {
	state = {
		error: null,
		redirect: false,
		redirectTo: "/"
	};

	savedPlan = () => {
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
	};

	createNewPlan = () => {
		const { user_id, APIServer } = this.props;
		const newPlan = {
			plan_title: "untitled",
			user_id: user_id,
			city_id: 2,
			duration: 0,
			plan_style: "",
			plan_description: "",
			original_id: 0,
			available: 0,
			star_rating: 0
		};
		const url = APIServer + "/plan_overview";
		console.log(url);
		axios
			.post(url, newPlan)
			.then(result => {
				if (result.data === null)
					alert("Could not create new plan :(");
				else 
					this.setState({
						redirect: true,
						redirectTo: "/plan/" + result.data.id + "/edit_plan"
					});
				console.log(result);
			})
			.catch(error => {
				this.setState({ error });
			});
	};

	RenderRedirect = () => {
		if (this.state.redirect)
      return <Redirect to={this.state.redirectTo} />;
	}

	render() {
		const { isLoading, error, data } = this.props;
		if (isLoading) return <div>Loading...</div>;
		if (error) return <div>Can't find the plan</div>;

		return (
			<React.Fragment>
				<button className="new_plan_button" onClick={this.createNewPlan}>
					Create new plan
				</button>
				{this.RenderRedirect()}
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
