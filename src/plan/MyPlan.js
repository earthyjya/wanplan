import "../scss/MyPlan.scss";
import CreateNewPlan from "../lib/CreateNewPlan.js";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

class MyPlan extends Component {
  state = {
    error: null,
    redirect: false,
    redirectTo: "/",
    citySearch: 0,
    cities: []
  };

  savedPlan = () => {
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (this.props.isLoggedIn) {
      const { data, user_id } = this.props;
      return data
        .filter(plan => plan.user_id === user_id)
        .map(plan => {
          return (
            <div key={plan.plan_id}>
              <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
            </div>
          );
        });
    } else {
      if (_planlist !== null && _planlist !== []) {
        return _planlist.map(plan => (
          <div key={plan.plan_id}>
            <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
          </div>
        ));
      } else {
        return <div>Your saved plan will show here</div>;
      }
    }
  };

  onClickNewPlan = () => {
    const { user_id, isLoggedIn } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    CreateNewPlan(APIServer, user_id, isLoggedIn, this.RedirectFunc);
  };

  selectCity = e => {
    this.setState({ citySearch: Number(e.target.value) });
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

  async componentDidMount() {
    const APIServer = process.env.REACT_APP_APIServer;
    await axios
      .get(APIServer + "/city")
      .then(result => {
        this.setState({ cities: result.data, isLoading: false });
      })
      .catch(error => {
        this.setState({ error, isLoading: false });
        console.log(error);
      });
  }

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
            marginTop: "20px",
            marginLeft: "10px",
            position: "relative",
            fontSize: "22px",
            fontWeight: "bold",
            alignSelf: "center",
            textAlign: "center"
          }}
        >
          Search Plan
          <div>
            <select
              className="plan-search-city-home"
              placeholder="choose a city..."
              value={this.state.citySearch}
              onChange={this.selectCity}
            >
              <option value="0">All plan</option>
              {this.state.cities.map(city => {
                return (
                  <option key={city.city_id} value={city.city_id} text={city.city}>
                    {city.city}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div style={{ marginTop: "20px", marginLeft: "10px", position: "relative" }}>
          {(() => {
            if (this.state.citySearch === 0) {
              return (
                <div>
                  {data.map(plan => (
                    <div key={plan.plan_id}>
                      <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
                    </div>
                  ))}
                </div>
              );
            } else {
              return (
                <div>
                  {data.map(plan => {
                    if (plan.city_id === this.state.citySearch) {
                      return (
                        <div key={plan.plan_id}>
                          <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
                        </div>
                      );
                    }
                    return <React.Fragment></React.Fragment>;
                  })}
                </div>
              );
            }
          })()}
        </div>
      </React.Fragment>
    );
  }
}

export default MyPlan;
