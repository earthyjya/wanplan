import React, { Component } from "react";
import "./App.css";
import User from "./user/User";
import Posts from "./posts/Posts";
import Count from "./count/Count";
import Plan from "./plan/Plan";
import Chatroom from "./chat/Chatroom";
import Chatform from "./chat/Chatform";
import { Route, BrowserRouter } from "react-router-dom";
import Request from "./lib/Request";

class App extends Component {
  state = {
    user_id: 2,
    isLoggedIn: true,
    isOpen: false,
    serverIP: "http://192.168.0.145",
    nodePort: 8080,
    jsonPort: 3030
  };

  componentDidMount() {}

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const { user_id, serverIP, nodePort, jsonPort } = this.state;
    return (
      <div className="mainpage">
        <div className="topnav">
          <a className="wanplan" href="/home">
            WANPLAN
          </a>
          <a href="/plan">Plan</a>
          <a href="/users">Users</a>
          <a href="/posts">Posts</a>
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
            path="/plan/:trip_id"
            component={({ match }) => (
              <Request
                url={
                  serverIP + ":3030/trip_detail?trip_id=" +
                  match.params.trip_id
                }
              >
                {result => <Plan {...result} />}
              </Request>
            )}
          />

          <Route
            path="/users"
            component={() => (
              <Request url={serverIP + ":3030/user"}>
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
              <Count {...props} serverIP={this.state.serverIP + ":8080"} />
            )}
          />
          <Route path="/chat" component={Chatform} />
          <Route
            path="/chatroom"
            render={props => (
              <Chatroom {...props} serverIP={this.state.serverIP + ":8080"} />
            )}
          />
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
