import "./scss/App.scss";
import axios from "axios";
import EditPlan from "./plan/EditPlan";
import Homepage from "./Homepage";
import Plan from "./plan/Plan";
import React, { Component } from "react";
import Request from "./lib/Request";
import User from "./user/User";
import ReactGA from "react-ga";
import fire from "./config/Firebase";
import Login from "./Login.js";
import Signup from "./Signup.js";
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
  faTwitterSquare
);

class App extends Component {
  state = {
    user: {},
    user_id: 0,
    isLoggedIn: false,
    urls: [
      "https://api.oneplan.in.th/api/plan_overview" /*+"/user/" + user_id*/,
    ],
    toggleLogin: false,
    toggleSignup: false,
    token: null,
  };

  authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({ user, isLoggedIn: true, });
        // this.setState({user_id: user.uid })
        fire.auth().currentUser.getIdToken(true).then((idToken) => {
          this.setState({token: idToken})
          console.log(idToken)
        }).catch(function(error) {
          // Handle error
          console.error(error)
        });
      } else {
        this.setState({ user: null, isLoggedIn: false });
      }
    });
  };

  delete = () => {
    localStorage.setItem("planlist", JSON.stringify([]));
  };
  componentDidMount() {
    ReactGA.initialize("UA-164341109-1");
    ReactGA.pageview(window.location.pathname + window.location.search);
    this.authListener();
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

  toggleLogin = () => {
    this.setState({ toggleLogin: !this.state.toggleLogin });
  };

  toggleSignup = () => {
    this.setState({ toggleSignup: !this.state.toggleSignup });
  };

  logout = () => {
    fire.auth().signOut();
  };

  render() {
    // eslint-disable-next-line
    const { user_id, toggleLogin, toggleSignup, isLoggedIn } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    return (
      <React.Fragment>
        <header className="topnav">
          <a className="oneplan" href="/home">
            <img src="/oneplan-logo-primary.png" alt="Oneplan Logo" />
          </a>
          {(() => {
            if (isLoggedIn) {
              return (
                <div className="login">
                  <button className="login" onClick={this.logout}>
                    Log out
                  </button>
                </div>
              );
            } else {
              return (
                <div>
                  <div className="login">
                    <button className="login" onClick={this.toggleLogin}>
                      Log In
                    </button>
                  </div>
                  <div className="signin">
                    <button
                      className="signin-button"
                      onClick={this.toggleSignup}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              );
            }
          })()}

          {/* <a href="/plan">Plan</a>
          {/* <a href="/howto">How to use?</a>
          {/* <button className="white-button" onClick={this.logInlogOut}>
            {(() => (this.state.isLoggedIn ? "Log out" : "Log in"))()}
          </button>
          <button className="white-button" onClick={this.delete}>
            delete cache
          </button> */}
        </header>
        {(() => {
          if (toggleLogin) {
            return (
              <div className="loginForm">
                <Login toggleLogin={this.toggleLogin} />
              </div>
            );
          }
        })()}
        {(() => {
          if (toggleSignup) {
            return (
              <div className="loginForm">
                <Signup toggleSignup={this.toggleSignup} />
              </div>
            );
          }
        })()}
        <BrowserRouter>
          <Route exact path="/" component={() => <Redirect to="/home" />} />

          {(() => {
            if (isLoggedIn)
              return (
                <Route
                  path="/home"
                  component={() => (
                    <Request url={APIServer + "/plan_overview"}>
                      {(result) => <Homepage {...result} {...this.state} />}
                    </Request>
                  )}
                />
              );
            else
              return (
                <Route path="/home">
                  <Homepage {...this.state} />
                </Route>
              );
          })()}

          {/* <Route
            exact
            path="/plan"
            component={() => (
              <RequestCriteria urls={this.state.urls}>
                {result => <MyPlan {...result} {...this.state} criteria={this.criteria} />}
              </RequestCriteria>
            )}
          /> */}
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
