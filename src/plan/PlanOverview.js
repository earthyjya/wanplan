import React, { Component } from "react";
import { Row, Col, Container } from "reactstrap";

class PlanOverview extends Component {
	render() {
		const { plan_overview } = this.props;
		return (
		<React.Fragment>
			<Container
				fluid
				className="plan-description-picture"
				style={{
					backgroundImage:
						"url(https://d3hne3c382ip58.cloudfront.net/resized/1920x700/japan-tours-400X400_.JPG)"
				}}
			>
			</Container>
			<Container
				fluid
				className="plan-description-container plan-header"
			>
				<Row>
						<Col style={{"textAlign": "end"}}>
							<img
								src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
								className="avatar-image"
								alt="author"
								/>
						</Col>
						<Col>
							<Row>{plan_overview.name + " " + plan_overview.surname}</Row>
							<Row>{plan_overview.user_description}</Row>
						</Col>
				</Row>
				<Row className="plan-description-title">
						Plan Title
				</Row>
				<Row className="plan-description">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur nec fringilla purus, egestas convallis diam.
					In vitae risus vel lacus vehicula malesuada. Aenean condimentum erat a ligula cursus, hendrerit faucibus nunc mollis.
					In venenatis varius felis rhoncus mollis.
				</Row>
			</Container>
		</React.Fragment>
		);
	}
}

export default PlanOverview;
