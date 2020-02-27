import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";

class PlanOverview extends Component {
	render() {
		const { plan_overview, user, isLoadingOverview } = this.props;
		if (isLoadingOverview) {
			return <div>Loading...</div>;
		}
		return (
			<Container
				fluid
				className="plan-description-container plan-header"
				style={{
					backgroundImage:
						"url(https://d3hne3c382ip58.cloudfront.net/resized/1920x700/japan-tours-400X400_.JPG)"
				}}
			>
				<Row>
					<Col lg={8}>
						<div className="plan-description">
							{plan_overview.plan_description}
						</div>
					</Col>
				</Row>
				<Row>
					<Col sm={6} md={6} lg={6}>
						<Row style={{ padding: "10px" }}>
							<Col sm={"auto"} md={"auto"} lg={"auto"}>
								<img
									src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
									className="avatar-image"
									alt="author"
								/>
							</Col>
							<Col>
								<div>{user.name + " " + user.surname}</div>
								<div>{user.user_description}</div>
							</Col>
						</Row>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default PlanOverview;
