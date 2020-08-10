import "../scss/RecommendedPlan.scss";
import CreateNewPlan from "../lib/CreateNewPlan.js";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PlanCard from "./PlanCard.js";
import axios from "axios";
import { CardDeck } from "reactstrap";
import MobileWarningToast from "../components/MobileWarningToast.js";
import { isMobile } from "react-device-detect";

class RecommendedPlan extends Component {
  state = {
    data: [],
    isLoading: true,
    error: null,
    allFalse: true,
    showMobileWarning: false,
  };

  showAll = () => {
    const { data } = this.state;
    return (
      <React.Fragment>
        {data.slice(0, 9).map((plan) => (
          <PlanCard plan={plan} key={plan.plan_id} deletable={false} />
        ))}
      </React.Fragment>
    );
  };

  onClickNewPlan = () => {
    if (isMobile) {
      this.setState({ showMobileWarning: true });
      return;
    }
    const { user_id, isLoggedIn } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    CreateNewPlan(APIServer, user_id, isLoggedIn, this.RedirectFunc);
  };

  async componentDidMount() {
    let url =
      process.env.REACT_APP_APIServer + "/load_plan/search?tags=AUTO_TAG";
    await axios
      .get(url)
      .then((result) => {
        // console.log(result.data);
        this.setState({ data: result.data, isLoading: false, error: null });
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log(error);
      });
  }

  render() {
    const { isLoading, error } = this.state;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Something Went Wrong :(</div>;
    return (
      <React.Fragment>
        <div className="recommendedplan-container container-fluid">
          <div className="recommendedplan-text">
            <div> Reccommended Plan </div>
          </div>
          <div className="recommendedplan-card-deck">{this.showAll()}</div>
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

export default RecommendedPlan;
