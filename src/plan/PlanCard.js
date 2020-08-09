import "../scss/PlanCard.scss";
import React, { Component } from "react";
import { Card, CardImg, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect } from "react-router-dom";
import axios from "axios"

class PlanCard extends Component {
  state = {
    redirect: false,
    toDelete: false,
    deleted: false,
  };

  componentDidMount() {
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    this.setState({ redirect: true });
  };

  deletePlan = async () => {
    let {isLoggedIn, plan} = this.props
    if (!isLoggedIn){
      this.props.deleteFromCache(plan.plan_id)
    }else{

      const APIServer = process.env.REACT_APP_APIServer;
      let url = APIServer + "/plan_overview/" + plan.plan_id
      await axios.delete(url)
    // .then(result => console.log(result))
    .catch(error => console.error(error))
    }
    this.setState({deleted: true})
    this.closeModalDelete()
  };

  openModalDelete = () => {
    this.setState({ toDelete: true });
  };

  closeModalDelete = () =>{
    this.setState({toDelete: false})
  }

  renderRedirect = () => {
    if (this.state.redirect)
      return <Redirect push to={"/plan/" + this.props.plan.plan_id} />;
  };

  render() {
    if (this.state.deleted) return <div></div>;
    return (
      <React.Fragment>
        {this.renderRedirect()}
        <div>
        {(() => {
            if (this.state.toDelete) {
              return (<div className = "delete-plan">
              <div className="delete-plan-content">
              <div className="close-delete-plan" onClick={this.closeModalDelete}>
                &#10005;
              </div>
            <div style={{ fontSize: "16px", fontWeight: "bold" }}>Are you sure you want to delete "{this.props.plan.plan_title}"?</div>
              <button className="delete-confirm" onClick={this.deletePlan}>
                Delete
              </button>
              <button className="delete-cancel" onClick={this.closeModalDelete}>
                Cancel
              </button>
            </div></div>);
            }
          })()}
          </div>
        <Card className={this.props.cardClassName? this.props.cardClassName: "plan-card"}>
          <div className="plan-card-view-count">
            <FontAwesomeIcon icon="eye" /> 9999
          </div>
          {(() => {
            if (this.props.deletable) {
              return (<div className="delete-plancard" onClick={this.openModalDelete}>
                &#10005;
              </div>);
            }else{
              if (this.props.plan.user_id == 0){
                return(
                  <div className="oneplan-original" >
                    Oneplan Orignal
                  </div>
                );
              }
            }
          })()}
          <CardImg
            className="plan-card-img"
            src="/myplan_placeholder.jpg"
            alt="Card image cap"
            onClick={this.handleClick}
          />
        <CardBody onClick={this.handleClick} className="plan-card-body">
            <CardTitle className="plan-card-title">
              {this.props.plan.plan_title}
            </CardTitle>
            <CardSubtitle className="plan-card-subtitle">
              คำอธิบายสั้นๆ หรือยาวๆ ก็ได้ สักสองบรรทัดไรงี้
            </CardSubtitle>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}

export default PlanCard;
