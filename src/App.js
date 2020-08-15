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
import SearchPlan from "./plan/SearchPlan.js";
import RemovePlan from "./lib/RemovePlan.js";
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
import DuplicatePlan from "./lib/DuplicatePlan";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      process.env.REACT_APP_APIServer +
        "/load_plan/search?userId=0" /*+"/user/" + user_id*/,
    ],
    toggleLogin: false,
    toggleSignup: false,
    token: null,
    isLoading: true,
    name: "",
    familyName: "",
    photoLink: "",
    description: "",
    username: "",
  };

  editUser = (data) => {
    this.setState(data);
  };

  authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      // console.log(user);
      if (user) {
        this.setState({ user, isLoggedIn: true });
        this.setState({ user_id: user.uid });
        fire
          .auth()
          .currentUser.getIdToken(true)
          .then((idToken) => {
            this.setState({ token: idToken });
            // console.log(idToken)
          })
          .catch(function (error) {
            // Handle error
            console.error(error);
          });
        const db = fire.firestore();
        db.collection("users")
          .doc(user.uid)
          .get()
          .then((res) => {
            let data = res.data();
            if (data) this.setState(data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.setState({ user: null, isLoggedIn: false, user_id: 0 });
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
    this.setState({ isLoading: false });
  }

  logIn = async (user_id) => {
    const APIServer = process.env.REACT_APP_APIServer;
    this.setState({ isLoggedIn: true });
    if (
      localStorage.getItem("planlist") !== null &&
      localStorage.getItem("planlist") !== []
    ) {
      // console.log("move plans from cache to server");
      //if there are somethings in cache post them to the server
      let _planlist = JSON.parse(localStorage.getItem("planlist"));
      _planlist.map((plan) => {
        let oldPlanId = plan.plan_id;
        let originalId = plan.plan_original;
        // console.log("old plan id is" + oldPlanId);
        DuplicatePlan(APIServer, oldPlanId, user_id, async (data) => {
          //   _planlist.push({
          //     ...data.plan_overview,
          //     plan_id: data.plan_overview.id,
          //   })
          // console.log("duplicated" + oldPlanId + "to" + data.plan_overview.id);
          let url = APIServer + "/plan_overview/" + data.plan_overview.id;
          await axios
            .put(url, { ...data.plan_overview, original_id: originalId })
            .then((result) => {
              // console.log(result);
            })
            .catch((err) => console.log(err));
        });
        RemovePlan(APIServer, oldPlanId, (data) => {
          // console.log(data);
        });
      });
      localStorage.setItem("planlist", JSON.stringify([]));
    }
    const db = fire.firestore();
    db.collection("users")
      .doc(user_id)
      .get()
      .then((res) => {
        let data = res.data();

        if (data) {
          let { name, familyName, photoLink, username, description } = data;
          this.setState(data);
          db.collection("users").doc(user_id).set({
            name,
            familyName,
            photoLink,
            username,
            description,
          });
        } else {
          let {
            name,
            familyName,
            photoLink,
            username,
            description,
          } = this.state;
          db.collection("users").doc(user_id).set({
            name,
            familyName,
            photoLink,
            username,
            description,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
                <a className="user-profile" href={`/user/${user_id}`}>
                  User Profile
                </a>
              );
            }
          })()}
          <a className="search-plan-a" href="/search">
            Search for a plan
            <FontAwesomeIcon
              style={{ marginLeft: "10px" }}
              icon="search"
              size="1x"
            />
          </a>
          {(() => {
            if (isLoggedIn) {
              return (
                <div className="login">
                  <a className="login" onClick={this.logout} href="/home">
                    Log out
                  </a>
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
                <Login toggleLogin={this.toggleLogin} logIn={this.logIn} />
              </div>
            );
          }
        })()}
        {(() => {
          if (toggleSignup) {
            return (
              <div className="signUpForm">
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
                    <Request
                      url={APIServer + "/load_plan/search?userId=" + user_id}
                    >
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
            exact
            path="/user/:user_id"
            component={({ match }) => (
              <User
                {...this.state}
                uid={match.params.user_id}
                editUser={this.editUser}
              />
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
          <Route path="/search">
            <SearchPlan />
          </Route>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
export default App;
