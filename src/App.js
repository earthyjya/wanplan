import "./scss/App.scss";
import axios from "axios";
import EditPlan from "./plan/EditPlan";
import Homepage from "./Homepage";
import MyPlan from "./plan/MyPlan";
import Plan from "./plan/Plan";
import React, { Component } from "react";
import Request from "./lib/Request";
import RequestCriteria from "./lib/RequestCriteria";
import User from "./user/User";
import ReactGA from "react-ga";
import {
  faPencilAlt,
  faCamera,
  faGlobeAsia,
  faAngleDown,
  faShareAlt,
  faWalking,
  faCar,
  faTrain,
  faClock,
  faMoneyBillWave,
  faSearch,
  faLink,
  faCalendarAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookSquare,
  faInstagramSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
library.add(
  faPencilAlt,
  faCamera,
  faGlobeAsia,
  faAngleDown,
  faShareAlt,
  faWalking,
  faCar,
  faTrain,
  faClock,
  faMoneyBillWave,
  faSearch,
  faLink,
  faCalendarAlt,
  faEye,
  faFacebookSquare,
  faInstagramSquare,
  faTwitterSquare,
);

class App extends Component {
  state = {
    user_id: 0,
    isLoggedIn: false,
    citySearch: 0,
    leastDay: 0,
    mostDay: 1000,
    allChecked: false,
    list: [
      { id: 1, name: "Adventure", isChecked: false },
      { id: 2, name: "Sightseeing", isChecked: false },
      { id: 3, name: "Cultural", isChecked: false },
      // { id: 4, name: "Others", isChecked: false },
    ],
    allFalse: true,
    urls: [
      "https://api.oneplan.in.th/api/plan_overview" /*+"/user/" + user_id*/,
    ],
  };

  delete = () => {
    localStorage.setItem("planlist", JSON.stringify([]));
  };
  componentDidMount() {
    ReactGA.initialize("UA-164341109-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  logInlogOut = async () => {
    if (this.state.isLoggedIn) {
      this.setState({ isLoggedIn: false });
    } else {
      const { user_id } = this.state;
      const APIServer = process.env.REACT_APP_APIServer;
      this.setState({ isLoggedIn: true });
      if (localStorage.getItem("planlist") !== null) {
        let _planlist = JSON.parse(localStorage.getItem("planlist"));
        for (let i = 0; i < _planlist.length; i++) {
          let url = APIServer + "/load_plan/" + _planlist[i].plan_id;
          await axios.get(url).then(async (result) => {
            let data = result.data;
            url = APIServer + "/plan_overview";
            let original_id = data.plan_overview.original_id;
            if (data.plan_overview.original_id === 0) original_id = 0;
            let planId;
            let savedplan = {
              ...data.plan_overview,
              original_id: original_id,
              user_id: user_id,
            };
            await axios
              .post(url, savedplan)
              .then((result) => {
                if (result.data === null) alert("Could not save plan :(");
                planId = result.data.id;
                // console.log(result);
              })
              .catch((error) => {
                this.setState({ error });
              });
            data.plan_startday.map(async (day) => {
              url = APIServer + "/plan_startday/";
              let newDay = day;
              newDay.plan_id = planId;
              await axios
                .post(url, newDay)
                .then((result) => {
                  if (result.data === null) alert("Could not save plan :(");
                  // console.log(result);
                })
                .catch((error) => {
                  this.setState({ error });
                  console.log(error);
                });
            });

            data.plan_detail.map(async (plan) => {
              url = APIServer + "/plan_detail/";
              let newPlan = plan;
              newPlan.plan_id = planId;
              await axios
                .post(url, newPlan)
                .then((result) => {
                  if (result.data === null) alert("Could not save plan :(");
                  // console.log(result);
                })
                .catch((error) => {
                  this.setState({ error });
                  console.log(error);
                });
            });
            if (data.plan_overview.original_id === 0) {
              if (data.plan_startday) {
                url =
                  APIServer +
                  "/plan_startday/delete/" +
                  data.plan_overview.plan_id;

                await axios
                  .delete(url)
                  .then((result) => {
                    if (result.data === null) alert("Could not update plan :(");
                    // console.log(result);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
              if (data.plan_detail !== []) {
                url =
                  APIServer +
                  "/plan_detail/delete/" +
                  data.plan_overview.plan_id;

                await axios
                  .delete(url)
                  .then((result) => {
                    if (result.data === null) alert("Could not update plan :(");
                    // console.log(result);
                  })
                  .catch((error) => {
                    console.log(error);
                  });
              }
              url = APIServer + "/plan_overview/" + data.plan_overview.plan_id;

              await axios
                .delete(url)
                .then((result) => {
                  if (result.data === null) alert("Could not update plan :(");
                  // console.log(result);
                })
                .catch((error) => {
                  console.log(error);
                });
            }
          });
        }
      }
    }
  };

  criteria = (e) => {
    const APIServer = process.env.REACT_APP_APIServer;
    let { allFalse, list, urls, citySearch, leastDay, mostDay } = this.state;
    this.setState(e);
    console.log(e)
    this.state.list.map((i) => {
      if (i.isChecked) {
        this.setState({ allFalse: false });
      }
    });
    let toAddUrls = [];
    if (!allFalse) {
      e.list.map((style) => {

        if (style.isChecked)
          toAddUrls = [
            ...toAddUrls,
            APIServer +
              "/plan_overview/criteria/" +
              e.citySearch +
              "/" +
              e.leastDay +
              "/" +
              e.mostDay +
              "/" +
              style.name,
          ];
      });
    } else {
      e.list.map((style) => {
        toAddUrls = [
          ...toAddUrls,
          APIServer +
            "/plan_overview/criteria/" +
            e.citySearch +
            "/" +
            e.leastDay +
            "/" +
            e.mostDay +
            "/" +
            style.name,
        ];
      });
    }
    console.log(toAddUrls);
    this.setState({urls: toAddUrls})
  };

  render() {
    // eslint-disable-next-line
    const { user_id } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    return (
      <React.Fragment>
        <header className="topnav">
          <a className="oneplan" href="/home">
            <img src="/oneplan-logo-primary.png"/>
          </a>
          {/* <a href="/plan">Plan</a>
          {/* <a href="/howto">How to use?</a>
          {/* <button className="white-button" onClick={this.logInlogOut}>
            {(() => (this.state.isLoggedIn ? "Log out" : "Log in"))()}
          </button>
          <button className="white-button" onClick={this.delete}>
            delete cache
          </button> */}
        </header>
        <BrowserRouter>
          <Route exact path="/" component={() => <Redirect to="/home" />} />
          <Route
            path="/home"
            component={() => (
              <RequestCriteria urls={this.state.urls}>
                {(result) => (
                  <Homepage
                    {...result}
                    {...this.state}
                    criteria={this.criteria}
                  />
                )}
              </RequestCriteria>
            )}
          />

          <Route
            exact
            path="/plan"
            component={() => (
              <RequestCriteria urls={this.state.urls}>
                {(result) => (
                  <MyPlan
                    {...result}
                    {...this.state}
                    criteria={this.criteria}
                  />
                )}
              </RequestCriteria>
            )}
          />
          <Route
            exact
            path="/plan/:plan_id"
            component={({ match }) => (
              <Plan plan_id={Number(match.params.plan_id)} {...this.state} />
            )}
          />
          <Route
            path="/plan/:plan_id/edit_plan"
            component={({ match }) => (
              <EditPlan
                plan_id={Number(match.params.plan_id)}
                new_plan={false}
                {...this.state}
              />
            )}
          />
          <Route
            path="/plan/:plan_id/edit_new_plan"
            component={({ match }) => (
              <EditPlan
                plan_id={Number(match.params.plan_id)}
                new_plan={true}
                {...this.state}
              />
            )}
          />
          <Route
            path="/users"
            component={() => (
              <Request url={APIServer + "/user"}>
                {(result) => <User {...result} />}
              </Request>
            )}
          />
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
export default App;
