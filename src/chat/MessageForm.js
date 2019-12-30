import React, { Component } from "react";

class MessageForm extends Component {
	state = {
		text: "",
		currentUser: ""
	};

	onSubmit = e => {
		e.preventDefault();
		if (this.state.text === "") {
			return;
		}
		this.props.onMessageSend({
			user: this.props.currentUser,
			text: this.state.text
		});
		this.setState({ text: "" });
	};

	onChange = e => {
		this.setState({ text: e.target.value });
	};

	render() {
		return (
			<form onSubmit={this.onSubmit} className="MessageForm">
				<input
					className="MessageInput"
					type="text"
					value={this.state.text}
					onChange={this.onChange}
				/>
				<button className="MessageButton">Send</button>
			</form>
		);
	}
}

export default MessageForm;
