import React, { Component } from "react";

class Message extends Component {
	render() {
		const {message} = this.props;
		return <li>
			<div className="Message-content">
				<div className="username">{message.user}</div>
				<div className="text">{message.text}</div>
			</div>
		</li>;
	}
}

export default Message;
