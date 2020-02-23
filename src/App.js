import React, { Component } from "react";
import "./App.css";
import User from "./user/User";
import Posts from "./posts/Posts";
import PostDetail from "./posts/PostDetail";
import Count from "./count/Count";
import Plan from "./plan/Plan";
import MyPlan from "./plan/MyPlan";
import Chatroom from "./chat/Chatroom";
import Chatform from "./chat/Chatform";
import { Route, BrowserRouter } from "react-router-dom";
import Request from "./lib/Request";

class App extends Component {
  state = {
    user_id: 1,
    isLoggedIn: true,
    serverIP: "http://localhost",
    nodePort: "8080",
    jsonPort: "3030"
  };

  componentDidMount() {}

  render() {
    const { user_id, serverIP, nodePort, jsonPort } = this.state;
    return (
      <React.Fragment>
        <div className="topnav">
          <a className="wanplan" href="/home">
            WANPLAN
          </a>
          <a href="/plan">Plan</a>
          <a href="/users">Users</a>
          <a href="/posts/">Posts</a>
          <a href="/count">Count</a>
          <a href="/chat">Chat</a>
        </div>
          <BrowserRouter>
            <Route
              path="/home"
              component={() => (
                <div>
                  <font style={{ fontSize: 110 }}>Welcome to Wanplan!</font>
                </div>
              )}
            />

            <Route
              exact
              path="/plan"
              component={() => (
                <Request
                  url={
                    serverIP +
                    ":" +
                    jsonPort +
                    "/plan_overview?user_id=" +
                    user_id
                  }
                >
                  {result => <MyPlan {...result} />}
                </Request>
              )}
            />

            <Route
              path="/plan/:plan_id"
              component={({ match }) => (
                <Plan plan_id={match.params.plan_id} {...this.state} />
              )}
            />

            <Route
              path="/users"
              component={() => (
                <Request url={serverIP + ":" + jsonPort + "/user"}>
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
              render={props => (
                <Count {...props} serverIP={serverIP + ":" + nodePort} />
              )}
            />
            <Route path="/chat" component={Chatform} />
            <Route
              path="/chatroom"
              render={props => (
                <Chatroom {...props} serverIP={serverIP + ":" + nodePort} />
              )}
            />
          </BrowserRouter>
      </React.Fragment>
    );
  }
}
export default App;
