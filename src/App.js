import React, { Component } from "react";
import "./App.css";
import User from "./user/User";
import Posts from "./posts/Posts";
import Count from "./count/Count";
import Plan from "./plan/Plan";
import Chatroom from "./chat/Chatroom";
import Chatform from "./chat/Chatform";
import { Route } from "react-router-dom";
import Request from "./lib/Request";

class App extends Component {
  state = {
    name: "Janat",
    isOpen: false,
    serverIP: "172.50.1.103:8080"
  };

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    // const { name } = this.state;
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
        <Route
          path="/home"
          component={() => (
            <div>
              <p>
                <font style={{ fontSize: 110 }}>Welcome to Wanplan!</font>
              </p>
            </div>
          )}
        />
        <Route path="/plan" component={Plan} />
        <Route
          path="/users"
          component={() => (
            <Request url="https://jsonplaceholder.typicode.com/users">
              {data => <User data={data} />}
            </Request>
          )}
        />
        <Route
          path="/posts"
          component={() => (
            <Request url="https://jsonplaceholder.typicode.com/posts">
              {data => <Posts data={data} />}
            </Request>
          )}
        />
        <Route path="/count" render={(props) => <Count {...props} serverIP={this.state.serverIP} />} />
        <Route path="/chat" component={Chatform} />
        <Route path="/chatroom" render={(props) => <Chatroom {...props} serverIP={this.state.serverIP} />} />
      </div>
    );
  }
}
export default App;
