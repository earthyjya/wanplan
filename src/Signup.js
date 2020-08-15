import React, { Component } from "react";
import fire from "./config/Firebase";
import "./scss/Login.scss";

class Signup extends Component {
  state = {
    email: "",
    password: "",
    error: null,
    name: "",
    familyName: "",
    photoLink: "",
    description: "",
    username: "",
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  signup = (e) => {
    let {name, familyName, photoLink, username, description } = this.state
    const db =fire.firestore()
    e.preventDefault();
    fire
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((u) => {
        this.setState({ error: null });
        this.props.toggleSignup();
        db.collection('users').doc(u.user.uid).set({
          name, familyName, photoLink, username, description
        })
      })
      .then((u) => {
        // console.log(u);
      })
      .catch((error) => {
        console.log(error);
        this.setState({ password: "" });
      });
  };

  render() {
    let { error } = this.state;
    return (
      <div className="signUpContent">
        <div className="close-login" onClick={this.props.toggleSignup}>
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
          <div className="form-group">
            <label>Username</label>
            <input
              value={this.state.username}
              onChange={this.handleChange}
              type="username"
              name="username"
              className="login-input-box"
              id="exampleInputUsername1"
              placeholder="username"
            />
          </div>
          <div className="form-group">
            <label>Name</label>
            <input
              value={this.state.name}
              onChange={this.handleChange}
              type="name"
              name="name"
              className="login-input-box"
              id="exampleInputName1"
              placeholder="name"
            />
          </div>
          <div className="form-group">
            <label>Family Name</label>
            <input
              value={this.state.familyName}
              onChange={this.handleChange}
              type="familyName"
              name="familyName"
              className="login-input-box"
              id="exampleInputFamilyName1"
              placeholder="family name"
            />
          </div>
          <div className="form-group">
            <label>Photo link</label>
            <input
              value={this.state.photoLink}
              onChange={this.handleChange}
              type="photoLink"
              name="photoLink"
              className="login-input-box"
              id="exampleInputPhotoLink1"
              placeholder="Photo Link"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={this.state.description}
              onChange={this.handleChange}
              type="description"
              name="description"
              className="login-input-box"
              id="exampleInputDescription1"
              placeholder="description"
            />
          </div>
          {(() => {
            if (error) return <div className="error">{error}</div>;
          })()}
          <button
            type="submit"
            className="login-submit-button"
            onClick={this.signup}
          >
            Sign up
          </button>
        </form>
      </div>
    );
  }
}
export default Signup;
