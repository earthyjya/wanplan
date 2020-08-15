import React, { Component } from "react";
import fire from "../config/Firebase";
import "../scss/User.scss";
// import withRequest from "../lib/withRequest";

class User extends Component {
  state = {
    isLoading: true,
    editProfile: false,
  };

  edit = async (e) =>{
	  e.preventDefault()
	let {name, familyName, photoLink, username, description } = this.state
	const db =fire.firestore()
	await db.collection('users').doc(this.props.user_id).set({
		name, familyName, photoLink, username, description
	}).then(res => console.log(res)).catch(err => console.log(err))
	this.toggleEditUser()
	this.props.editUser({name, familyName, photoLink, username, description })
  }

  toggleEditUser = () => {
    this.setState({ editProfile: !this.state.editProfile });
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
	let { name, familyName, photoLink, username, description } = this.props;
	this.setState({ isLoading: false });
	this.setState({ name, familyName, photoLink, username, description })
  }

  render() {
    let { isLoading, editProfile } = this.state;
    if (isLoading) return <div>Loading...</div>;
    else {
      let { name, familyName, photoLink, username, description } = this.state;
      return (
        <div className="user">
          {(() => {
            if (editProfile) {
              return (
                <div className="signUpForm">
                  <div className="editUserContent">
                    <div
                      className="close-login"
                      onClick={this.toggleEditUser}
                    >
                      &#10005;
                    </div>
                    <form>
                      <div className="form-group">
                        <label>Username</label>
                        <input
                          value={username}
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
                          value={name}
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
                          value={familyName}
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
                          value={photoLink}
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
                          value={description}
                          onChange={this.handleChange}
                          type="description"
                          name="description"
                          className="login-input-box"
                          id="exampleInputDescription1"
                          placeholder="description"
                        />
                      </div>
                      <button
                        type="submit"
                        className="login-submit-button"
                        onClick={this.edit}
                      >
                        Edit
                      </button>
                    </form>
                  </div>
                </div>
              );
            }
          })()}
          <div>This is User page for user_id: {this.props.uid}</div>
          <div>username: {this.props.username}</div>
          <div>name: {this.props.name}</div>
          <div>family name: {this.props.familyName}</div>
          <div>photo link: {this.props.photoLink}</div>
          <div>description: {this.props.description}</div>
          <button onClick={this.toggleEditUser}>Edit</button>
        </div>
      );
    }
  }
}

export default User;
