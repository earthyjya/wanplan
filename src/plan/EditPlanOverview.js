import "../scss/EditPlanOverview.scss";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Container } from "reactstrap";

class EditPlanOverview extends Component {
  state = {
    dropdownOpen: false,
    isLoading: true

  };

  toggleDropDown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  changeTitle = e => {
    this.setState({
      plan_overview: {
        ...this.state.plan_overview,
        plan_title: e.target.value
      }
    });
    this.props.updatePlanOverview(this.state.plan_overview);
  };

  updatePlanOverview = e => {
    this.setState({
      plan_overview: {
        ...this.state.plan_overview,
        plan_title: e.target.value
      }
    });
    this.props.updatePlanOverview(this.state.plan_overview);
  };

  componentDidMount() {
    this.setState({
      plan_overview: this.props.plan_overview,
      isLoading: false
    });
  }

  render() {
    const { isLoading, plan_overview } = this.state;
    if (isLoading) return <div></div>;
    else
      return (
        <React.Fragment>
          <Container
            fluid
            className="plan-description-picture"
            style={{
              backgroundImage:
                "url(https://d3hne3c382ip58.cloudfront.net/resized/1920x700/japan-tours-400X400_.JPG)"
            }}
          ></Container>
          <Container fluid className="plan-description-container plan-header">
            <div className="choose-photo-container">
              <FontAwesomeIcon icon="camera" size="lg" />
              <span style={{ marginLeft: "8px" }}>choose a cover photo</span>
            </div>

            <Row>
                <input
                  type="textarea"
                  id="title-input"
                  value={plan_overview.plan_title}
                  onChange={this.changeTitle}
                  onBlur={this.updatePlanOverview}
                />
              <FontAwesomeIcon size="2x" className="title-input-icon" icon="pencil-alt" />
            </Row>
            <Row className="plan-description-city-days">
              city name(s) | xx days
            </Row>
          </Container>

          {(() => {
            if (this.props.updated && this.props.title) {
              if (this.state.plan_overview !== this.props.plan_overview)
                this.setState({
                  plan_overview: this.props.plan_overview
                });
              this.props.titleChanged(false);
            } else if (this.props.updated) {
              this.props.titleChanged(false);
            }
          })()}
        </React.Fragment>
      );
  }
}

export default EditPlanOverview;
