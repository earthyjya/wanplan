import React, { Component } from "react";
import "./scss/App.scss";
import User from "./user/User";
import Posts from "./posts/Posts";
import PostDetail from "./posts/PostDetail";
import Count from "./count/Count";
import Plan from "./plan/Plan";
import EditPlan from "./plan/EditPlan";
import Homepage from "./Homepage";
import MyPlan from "./plan/MyPlan";
import Chatroom from "./chat/Chatroom";
import Chatform from "./chat/Chatform";
import { Route, BrowserRouter } from "react-router-dom";
import Request from "./lib/Request";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPencilAlt,
  faCamera,
  faGlobeAsia,
  faAngleDown
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
library.add(faPencilAlt, faCamera, faGlobeAsia, faAngleDown);

class App extends Component {
  state = {
    user_id: 2,
    isLoggedIn: true,
    APIServer:
      "http://ec2-18-222-207-98.us-east-2.compute.amazonaws.com:3030/api",
    nodeServer: "http://ec2-18-222-207-98.us-east-2.compute.amazonaws.com:8080"
  };

  delete = () => {
    localStorage.setItem("planlist", JSON.stringify([]));
  };

  logInlogOut = async () => {
    if (this.state.isLoggedIn) {
      this.setState({ isLoggedIn: false });
    } else {
      const { APIServer, user_id } = this.state;
      this.setState({ isLoggedIn: true });
      let url;
      let data;
      if (localStorage.getItem("planlist") !== null) {
        let _planlist = JSON.parse(localStorage.getItem("planlist"));
        for (let i = 0; i < _planlist.length; i++) {
          url = APIServer + "/load_plan/" + _planlist[i].plan_id;
          await axios.get(url).then(async result => {
            data = result.data;
            url = APIServer + "/plan_overview";
            let original_id = data.plan_overview.original_id;
            if (data.plan_overview.original_id == 0) original_id = 0;
            let planId;
            let savedplan = {
              ...data.plan_overview,
              original_id: original_id,
              user_id: user_id
            };
            await axios
              .post(url, savedplan)
              .then(result => {
                if (result.data === null) alert("Could not save plan :(");
                planId = result.data.id;
                console.log(result);
              })
              .catch(error => {
                this.setState({ error });
              });
            data.plan_startday.map(async day => {
              url = APIServer + "/plan_startday/";
              let newDay = day;
              newDay.plan_id = planId;
              await axios
                .post(url, newDay)
                .then(result => {
                  if (result.data === null) alert("Could not save plan :(");
                  console.log(result);
                })
                .catch(error => {
                  this.setState({ error });
                  console.log(error);
                });
            });

            data.plan_detail.map(async plan => {
              url = APIServer + "/plan_detail/";
              let newPlan = plan;
              newPlan.plan_id = planId;
              await axios
                .post(url, newPlan)
                .then(result => {
                  if (result.data === null) alert("Could not save plan :(");
                  console.log(result);
                })
                .catch(error => {
                  this.setState({ error });
                  console.log(error);
                });
            });
            if (data.plan_overview.original_id === 0) {
              if (data.plan_startday != []) {
                url =
                  APIServer +
                  "/plan_startday/delete/" +
                  data.plan_overview.plan_id;

                await axios
                  .delete(url)
                  .then(result => {
                    if (result.data === null) alert("Could not update plan :(");
                    console.log(result);
                  })
                  .catch(error => {
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
                  .then(result => {
                    if (result.data === null) alert("Could not update plan :(");
                    console.log(result);
                  })
                  .catch(error => {
                    console.log(error);
                  });
              }
              url = APIServer + "/plan_overview/" + data.plan_overview.plan_id;

              await axios
                .delete(url)
                .then(result => {
                  if (result.data === null) alert("Could not update plan :(");
                  console.log(result);
                })
                .catch(error => {
                  console.log(error);
                });
            }
          });
        }
      }
    }
  };

  render() {
    // eslint-disable-next-line
    const { user_id, APIServer, jsonServer, nodeServer } = this.state;
    return (
      <React.Fragment>
        <div className="topnav">
          <a className="wanplan" href="/home">
            Oneplan
          </a>
          <button className="white-button" onClick={this.logInlogOut}>
            {(() => (this.state.isLoggedIn ? "Log out" : "Log in"))()}
          </button>
          <button className="white-button" onClick={this.delete}>
            delete cache
          </button>
          <a href="/plan" style={{marginLeft:"auto"}}>Plan</a>
          <a href="/users">Users</a>
        </div>
        <BrowserRouter>
          <Route
            path="/home"
            component={() => (
              <Request
                url={APIServer + "/plan_overview" /*+"/user/" + user_id*/}
              >
                {result => <Homepage {...result} {...this.state} />}
              </Request>
            )}
          />

          <Route
            exact
            path="/plan"
            component={() => (
              <Request
                url={APIServer + "/plan_overview" /*+"/user/" + user_id*/}
              >
                {result => <MyPlan {...result} {...this.state} />}
              </Request>
            )}
          />
          <Route
            exact
            path="/plan/:plan_id"
            component={({ match }) => (
              <Plan plan_id={match.params.plan_id} {...this.state} />
            )}
          />
          <Route
            path="/plan/:plan_id/edit_plan"
            component={({ match }) => (
              <EditPlan plan_id={match.params.plan_id} {...this.state} />
            )}
          />
          <Route
            path="/users"
            component={() => (
              <Request url={APIServer + "/user"}>
                {result => <User {...result} />}
              </Request>
            )}
          />
          <Route
            exact
            path="/posts"
            component={() => (
              <Request url="https://jsonplaceholder.typicode.com/posts">
                {result => <Posts {...result} />}
              </Request>
            )}
          />
          <Route
            path="/posts/:post_id"
            component={() => (
              <Request url="https://jsonplaceholder.typicode.com/posts">
                {result => <PostDetail {...result} />}
              </Request>
            )}
          />
          <Route
            path="/count"
            render={props => <Count {...props} serverIP={nodeServer} />}
          />
          <Route path="/chat" component={Chatform} />
          <Route
            path="/chatroom"
            render={props => <Chatroom {...props} serverIP={nodeServer} />}
          />
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
export default App;
