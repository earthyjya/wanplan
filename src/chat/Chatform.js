import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

class Chatform extends Component {
	state = {
		username: "",
		invalidName: false,
		redirect: false
	};

	onChange = e => {
		this.setState({ username: e.target.value });
	};

	onSubmit = e => {
		e.preventDefault();
		if (this.state.username === "") this.setState({ invalidName: true });
		else this.setState({ redirect: true });
	};

	displayWarning = () => {
		if (this.state.invalidName) return <div>Invalid Username!</div>;
		return <div />;
	};

	render() {
		const { username } = this.state;
		if (this.state.redirect) return <Redirect to={{ pathname: "/chatroom", username: username }} />;
		return (
			<Form onSubmit={this.onSubmit}>
				<FormGroup>
					<Label for="username">
						<h3>
							<b>Login</b>
						</h3>
					</Label>
					<Input
						type="text"
						name="username"
						id="username"
						placeholder="Please enter your name"
						value={username}
						onChange={this.onChange}
					/>
				</FormGroup>
				<Button color="warning">Join</Button>
				{this.displayWarning()}
			</Form>
		);
	}
}

export default Chatform;
