import React, { Component } from "react";
import "./App.css";
import User from "./user/User";
import Posts from "./posts/Posts";
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
      <div className="mainpage">
        <div className="topnav">
          <a className="wanplan" href="/home">
            WANPLAN
          </a>
          <a href="/myplan">Plan</a>
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
            path="/myplan"
            component={() => (
              <Request
                url={
                  serverIP +
                  ":" +
                  jsonPort +
                  "/trip_overview?user_id=" +
                  user_id
                }
              >
                {result => <MyPlan {...result} />}
              </Request>
            )}
          />

          <Route
            path="/plan/:trip_id"
            component={({ match }) => (
              <Plan trip_id={match.params.trip_id} {...this.state} />
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
            path="/posts"
            component={() => (
              <Request url="https://jsonplaceholder.typicode.com/posts">
                {result => <Posts {...result} />}
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
      </div>
    );
  }
}
export default App;
