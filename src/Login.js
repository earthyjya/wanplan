import React, { Component } from "react";
import fire from "./config/Firebase";
import "./scss/Login.scss";

class Login extends Component {
  state = {
    email: "",
    password: "",
    error: null,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  login = (e) => {
    e.preventDefault();
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
        this.setState({error: null})
        this.props.toggleLogin()
    }).catch((error) => {
        console.log(error);
        this.setState({ password: "", error: error.message });
      });
  };

  render() {
    let { error } = this.state;
    return (
      <div className="loginContent">
        <div className="close-login" onClick={this.props.toggleLogin}>
          &#10005;
        </div>
        <form>
          <div className="form-group">
            <label>Email address</label>
            <input
              value={this.state.email}
              onChange={this.handleChange}
              type="email"
              name="email"
              className="login-input-box"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
              name="password"
              className="login-input-box"
              id="exampleInputPassword1"
              placeholder="Password"
            />
          </div>
          {(() => {
            if (error) return <div className="error">{error}</div>;
          })()}
          <button
            type="submit"
            className="login-submit-button"
            onClick={this.login}
          >
            Login
          </button>
        </form>
      </div>
    );
  }
}
export default Login;
