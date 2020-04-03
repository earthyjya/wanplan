import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { Redirect } from "react-router-dom";

class Chatroom extends Component {
	state = {
		socket: null,
		messages: []
	};

	componentCleanup = () => {
		this.onMessageSend({
			text: "has left the chat",
			user: this.props.location.username
		});
		this.setState({ socket: null });
	};

	async componentDidMount() {
		window.addEventListener("beforeunload", this.componentCleanup);
		if (this.state.socket == null) {
			await this.connectServer();
			this.onMessageSend({
				text: "joined the chat",
				user: this.props.location.username
			});
		}
	}

	connectServer = () => {
		console.log(this.props.serverIP);
		const socket = socketIOClient(this.props.serverIP);
		this.setState({ socket: socket });
		socket.on("message", this.addMessage);
	};

	onMessageSend = message => {
		if (this.state.socket == null) return;
		this.state.socket.emit("emit", message);
		this.addMessage(message);
	};

	addMessage = message => {
		this.setState({ messages: [...this.state.messages, message] });
	};

	render() {
		if (this.props.location.username == null) {
			return <Redirect to="/chat" />;
		}

		const { username } = this.props.location;

		return (
			<div>
				<MessageList messages={this.state.messages} />
				<MessageForm onMessageSend={this.onMessageSend} currentUser={username} />
			</div>
		);
	}

	componentWillUnmount() {
		this.componentCleanup();
		window.removeEventListener("beforeunload", this.componentCleanup);
	}
}

export default Chatroom;
