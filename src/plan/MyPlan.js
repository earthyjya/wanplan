import "../scss/MyPlan.scss";
import CreateNewPlan from "../lib/managePlan/CreateNewPlan.js";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PlanCard from "./PlanCard.js";
import axios from "axios";
import { CardDeck } from "reactstrap";
import MobileWarningToast from "../components/MobileWarningToast.js";
import { isMobileOnly } from "react-device-detect";
import RemovePlan from "../lib/managePlan/RemovePlan.js"

class MyPlan extends Component {
  state = {
    data: [],
    error: null,
    redirect: false,
    redirectTo: "/",
    citySearch: 0,
    cities: [],
    leastDay: 0,
    mostDay: 1000,
    allChecked: false,
    list: [
      { id: 1, name: "Adventure", isChecked: false },
      { id: 2, name: "Sightseeing", isChecked: false },
      { id: 3, name: "Cultural", isChecked: false },
      { id: 4, name: "AUTO_TAG", isChecked: false },
    ],
    allFalse: true,
    url: process.env.REACT_APP_APIServer + "/plan_overview",
    showMobileWarning: false,
  };

  savedPlan = () => {
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (this.props.isLoggedIn) {
      const { data, user_id } = this.props;
      return data
        .filter((plan) => plan.user_id === user_id)
        .map((plan) => {
          return (
            <PlanCard
              cardClassName="myplan-plan-card"
              plan={plan}
              key={plan.plan_id}
              deletable={true}
              {...this.props}
              deleteFromCache={this.deleteFromCache}
            />
          );
        });
    } else {
      if (_planlist !== null && _planlist !== [] && _planlist.length !== 0) {
        return _planlist.map((plan) => (
          <PlanCard
            cardClassName="myplan-plan-card"
            plan={plan}
            key={plan.plan_id}
            deletable={true}
            {...this.props}
            deleteFromCache={this.deleteFromCache}
          />
        ));
      } else {
        return <div className="no-saved-plan-text">Your saved plan will show here</div>;
      }
    }
  };

  deleteFromCache = async (planId) => {
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    _planlist = _planlist.filter((plan) => plan.plan_id !== planId);
    localStorage.setItem("planlist", JSON.stringify(_planlist));
    this.setState({ cachePlan: _planlist });
    const APIServer = process.env.REACT_APP_APIServer;
    RemovePlan(APIServer, planId)
  };

  RedirectFunc = (plan_id) => {
    this.setState({
      redirect: true,
      redirectTo: "/plan/" + plan_id + "/edit_new_plan",
    });
  };

  RenderRedirect = () => {
    if (this.state.redirect) {
      window.history.pushState(this.state, "", window.location.href);
      return <Redirect to={this.state.redirectTo} />;
    }
  };

  componentDidMount() {
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    this.setState({ cachePlan: _planlist });
  }

  render() {
    const { isLoading } = this.props;
    if (isLoading) return <div>Loading...</div>;

    return (
      <React.Fragment>
        {this.RenderRedirect()}
        <div className="myplan-container container-fluid">
          <div className="myplan-text">
            <div> My Plan </div>
          </div>
          <div className="myplan-card-deck">{this.savedPlan()}</div>
        </div>
        {(() => {
          return (
            <MobileWarningToast
              toggleToast={() => {
                this.setState({
                  showMobileWarning: !this.state.showMobileWarning,
                });
              }}
              isOpen={this.state.showMobileWarning}
            />
          );
        })()}
      </React.Fragment>
    );
  }
}

export default MyPlan;
