import "../scss/PlanOverview.scss";
import React, { Component } from "react";
import Share from "./Share";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Container } from "reactstrap";

class PlanOverview extends Component {
  state = {
    modal: false,
  };

  toggleShareModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  render() {
    const { plan_overview } = this.props;
    return (
      <React.Fragment>
        {this.state.modal ? (
          <div className="share-modal">
            <Share toggleShareModal={this.toggleShareModal} />
          </div>
        ) : (
          <div></div>
        )}
        <Container
          fluid
          className="plan-description-picture"
          style={{
            backgroundImage:
              "url(https://d3hne3c382ip58.cloudfront.net/resized/1920x700/japan-tours-400X400_.JPG)",
          }}
        ></Container>
        <Container fluid className="plan-description-container plan-header">
          <div className="share-banner" onClick={this.toggleShareModal}>
            <FontAwesomeIcon icon="share-alt" size="2x" />
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
                <div className="author-card-description">
                  {" "}
                  {plan_overview.user_description}{" "}
                </div>
              </div>
            </div>
          </Row>
          <Row className="plan-description-title">
            {plan_overview.plan_title}
          </Row>
          <Row className="plan-description">
            {plan_overview.plan_description}
          </Row>
          <Row className="plan-originalId">{(() => {if (plan_overview.original_id === 0){
			  return <div>This is an original plan</div>
		  }else{
			return <div>
				Original plan at{" "}
            <a href={"/plan/" + plan_overview.original_id}>
              {"/plan/" + plan_overview.original_id}
            </a>
			</div>
		  }})()}
            
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default PlanOverview;
