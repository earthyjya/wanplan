import React, { Component } from "react";
import "./App.css";
import User from "./user/User";
import Posts from "./posts/Posts";
import PostDetail from "./posts/PostDetail";
import Count from "./count/Count";
import Plan from "./plan/Plan";
import EditPlan from "./plan/EditPlan";
import MyPlan from "./plan/MyPlan";
import Chatroom from "./chat/Chatroom";
import Chatform from "./chat/Chatform";
import { Route, BrowserRouter } from "react-router-dom";
import Request from "./lib/Request";

class App extends Component {
  state = {
    user_id: 1,
    isLoggedIn: true,
    APIServer: "http://ec2-18-219-209-29.us-east-2.compute.amazonaws.com:3030/api",
    nodeServer: "http://ec2-18-219-209-29.us-east-2.compute.amazonaws.com:8080"
  };

  render() {
    // eslint-disable-next-line
    const { user_id, APIServer, jsonServer, nodeServer } = this.state;
    return (
      <React.Fragment>
        <div className="topnav">
          <a className="wanplan" href="/home">
            WANPLAN
          </a>
          <a href="/plan">Plan</a>
          <a href="/users">Users</a>
        </div>
        <BrowserRouter>
          <Route
            path="/home"
            component={() => (
              <div>
                <font style={{ fontSize: 100 }}>Welcome to Wanplan!</font>
              </div>
            )}
          />

          <Route
            exact
            path="/plan"
            component={() => (
              <Request url={APIServer + "/plan_overview/user/" + user_id}>
                {result => <MyPlan {...result} />}
              </Request>
            )}
          />
          <Route
            exact
            path="/plan/:plan_id"
            component={({ match }) => (
              <Plan plan_id = {match.params.plan_id} {...this.state} />
            )}
          />
          <Route
            path="/plan/:plan_id/edit_plan"
            component={({ match }) => (
              <EditPlan plan_id = {match.params.plan_id} {...this.state} />
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
