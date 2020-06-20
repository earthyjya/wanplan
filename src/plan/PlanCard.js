import "../scss/PlanCard.scss";
import React, { Component } from "react";
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button
} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect } from 'react-router-dom'

class PlanCard extends Component {

  state = {
    redirect: false
  };

  componentDidMount(){
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () =>{
    this.setState({redirect: true})
  }

  renderRedirect = () => {
    if (this.state.redirect) return <Redirect push to={"/plan/" + this.props.plan.plan_id} />;
  };

  render() {
      return(
        <React.Fragment>
          {this.renderRedirect()}
          <Card onClick={this.handleClick} width="600px" className="plan-card">
            <div className = "plan-card-view-count">
              <FontAwesomeIcon icon="eye"/> 9999
            </div>
            <CardImg className="plan-card-img" src="https://via.placeholder.com/300x300" alt="Card image cap" />
            <CardBody>
              <CardTitle className="plan-card-title">{this.props.plan.plan_title}</CardTitle>
              <CardSubtitle className="plan-card-subtitle">คำอธิบายสั้นๆ หรือยาวๆ ก็ได้ สักสองบรรทัดไรงี้</CardSubtitle>
            </CardBody>
          </Card>
        </React.Fragment>
      );
    }
}

export default PlanCard;
