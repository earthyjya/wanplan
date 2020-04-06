import React, { Component } from "react";
import { Row, Container } from "reactstrap";
import "../scss/PlanOverview.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Share from "./Share";

class PlanOverview extends Component {
	state = {
    modal: false,
  };

	openShareModal = () => {
		this.setState({ modal: true });
	};

	closeShareModal = () => {
		this.setState({ modal: false });
	};

	render() {
		const { plan_overview } = this.props;
		return (
			<React.Fragment>
				{this.state.modal ? (
					<div className="share-modal">
						<Share closeShareModal={this.closeShareModal} />
					</div>
				) : (
					<div></div>
				)}
				<Container
					fluid
					className="plan-description-picture"
					style={{
						backgroundImage:
							"url(https://d3hne3c382ip58.cloudfront.net/resized/1920x700/japan-tours-400X400_.JPG)"
					}}
				></Container>
				<Container fluid className="plan-description-container plan-header">
					<div className = "share-banner" onClick={this.openShareModal}>
						<FontAwesomeIcon icon="share-alt" size="2x"/>
					</div>
					<Row>
						<div className="author-card-container">
							<div style={{ textAlign: "end", alignSelf: "center" }}>
								<img
									src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
									className="avatar-image"
									alt="author"
								/>
							</div>
							<div className="author-card-details">
								<div className="author-card-title">
									{" "}
									{plan_overview.name + " " + plan_overview.surname}{" "}
								</div>
								<div className="author-card-description"> {plan_overview.user_description} </div>
							</div>
						</div>
					</Row>
					<Row className="plan-description-title">{plan_overview.plan_title}</Row>
					<Row className="plan-description">{plan_overview.plan_description}</Row>
				</Container>
			</React.Fragment>
		);
	}
}

export default PlanOverview;
