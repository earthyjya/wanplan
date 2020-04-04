import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";

class MyPlan extends Component {
  state = {
    error: null,
    redirect: false,
    redirectTo: "/"
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
      if (_planlist !== null) {
        return _planlist.map(plan => (
          <div key={plan.plan_id}>
            <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
          </div>
        ));
      } else {
        return <div>No saved plan yet!</div>;
      }
    }
  };

  createNewPlan = () => {
    const { user_id, APIServer, isLoggedIn } = this.props;
    let newUserId = 6;
    if (this.props.isLoggedIn) newUserId = user_id;
    const newPlan = {
      plan_title: "untitled",
      user_id: newUserId,
      city_id: 2,
      duration: 0,
      plan_style: "",
      plan_description: "",
      original_id: 0,
      available: 0,
      star_rating: 0
    };
    const url = APIServer + "/plan_overview";
    console.log(url);
    axios
      .post(url, newPlan)
      .then(result => {
        if (result.data === null) alert("Could not create new plan :(");
        else {
          newPlan.plan_id = result.data.id;
          if (!this.props.isLoggedIn) {
            if (localStorage.getItem("planlist") === null ||localStorage.getItem("planlist") === [] ) {
              var _planlist = [];
              _planlist[0] = newPlan;
              localStorage.setItem("planlist", JSON.stringify(_planlist));
            } else {
              let _planlist = JSON.parse(localStorage.getItem("planlist"));
              _planlist.push(newPlan);
              console.log(_planlist)
              localStorage.setItem("planlist", JSON.stringify(_planlist));
            }
          }
          this.setState({
            redirect: true,
            redirectTo: "/plan/" + result.data.id + "/edit_plan"
          });
          console.log(result);
        }
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  RenderRedirect = () => {
    if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;
  };

  render() {
    const { isLoading, error, data } = this.props;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Can't find the plan</div>;

    return (
      <React.Fragment>
        <button className="new_plan_button" onClick={this.createNewPlan}>
          Create new plan
        </button>
        {this.RenderRedirect()}
        <div>
          {data.map(plan => (
            <div key={plan.plan_id}>
              <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
            </div>
          ))}
        </div>
        <div> Saved Plan </div>
        <div>{this.savedPlan()}</div>
      </React.Fragment>
    );
  }
}

export default MyPlan;
