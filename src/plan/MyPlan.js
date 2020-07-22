import "../scss/MyPlan.scss";
import CreateNewPlan from "../lib/CreateNewPlan.js";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PlanCard from "./PlanCard.js";
import { CardDeck } from "reactstrap";
import MobileWarningToast from "../components/MobileWarningToast.js"
import axios from "axios";
import {
  isMobile
} from "react-device-detect";

class MyPlan extends Component {
  state = {
    data : [],
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
    allFalse : true,
    url : "https://api.oneplan.in.th/api/plan_overview",
    showMobileWarning: false,
  };

  savedPlan = () => {
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (this.props.isLoggedIn) {
      const { data, user_id } = this.props;
      return data
        .filter(plan => plan.user_id === user_id)
        .map(plan => {
          return <PlanCard plan={plan} key={plan.plan_id} />;
        });
    } else {
      if (_planlist !== null && _planlist !== []) {
        return _planlist.map(plan => <PlanCard plan={plan} key={plan.plan_id} />);
      } else {
        return <div>Your saved plan will show here</div>;
      }
    }
  };

  onClickNewPlan = () => {
    if(isMobile){
      this.setState({showMobileWarning: true})
      return
    }
    const { user_id, isLoggedIn } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    CreateNewPlan(APIServer, user_id, isLoggedIn, this.RedirectFunc);
  };

  RedirectFunc = plan_id => {
    this.setState({
      redirect: true,
      redirectTo: "/plan/" + plan_id + "/edit_new_plan"
    });
  };

  RenderRedirect = () => {
    if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;
  };

  render() {
    const { isLoading } = this.props;
    const { list, allChecked, data, error } = this.state;
    if (isLoading) return <div></div>;

    return (
      <React.Fragment>
        {this.RenderRedirect()}
        <div className="myplan-container container-fluid">
          <div className="myplan-text">
            <div> My Plan </div>
            <button className="new_plan_button" onClick={this.onClickNewPlan}>
              สร้าง plan ใหม่
            </button>
          </div>
          <div className="myplan-card-deck">{this.savedPlan()}</div>
        </div>
        {(() => {
          return(
            <MobileWarningToast
              toggleToast = {() =>
                {this.setState({showMobileWarning: !this.state.showMobileWarning})}
              }
              isOpen = {this.state.showMobileWarning}/>
          )
        })()}
      </React.Fragment>
    );
  }
}

export default MyPlan;
