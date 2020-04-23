import "../scss/MyPlan.scss";
import CreateNewPlan from "../lib/CreateNewPlan.js";
import React, { Component } from "react";
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

  onClickNewPlan = () => {
    const { user_id, isLoggedIn } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    CreateNewPlan(APIServer, user_id, isLoggedIn, this.RedirectFunc);
  };

  RedirectFunc = plan_id => {
    this.setState({
      redirect: true,
      redirectTo: "/plan/" + plan_id + "/edit_plan"
    });
  };

  RenderRedirect = () => {
    if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;
  };

  render() {
    const { isLoading, error, data } = this.props;
    if (isLoading) return <div></div>;
    if (error) return <div className="MyPlan-text">Can't find the plan</div>;

    return (
      <React.Fragment>
        <button className="new_plan_button" onClick={this.onClickNewPlan}>
          สร้าง plan ใหม่
        </button>
        {this.RenderRedirect()}
        <div className="MyPlan-text">My Plan</div>
        <div className="Plan-list-div">{this.savedPlan()}</div>
        <div
          style={{
            top: "20px",
            left: "10px",
            position: "relative",
            fontSize: "22px",
            fontWeight: "bold"
          }}
        >
          All Plan
        </div>
        <div style={{ top: "20px", left: "10px", position: "relative" }}>
          {data.map(plan => (
            <div key={plan.plan_id}>
              <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }
}

export default MyPlan;
