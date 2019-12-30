import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Button, Badge } from "reactstrap";

class Count extends Component {
	state = {
		socket: null,
		count: 0
	};
	/*
	handleCount = count => {
		this.setState({ count: count });
	};*/

	componentDidMount() {
		// const socket = socketIOClient("localhost:8080");
		const socket = socketIOClient(this.props.serverIP);

		this.setState({ socket: socket });

		socket.on("count", data => {
			this.setState({ count: data.count });
			// console.log(data);
		});
	}

	clickCount = () => {
		const { socket, count } = this.state;
		this.setState({ count: count + 1 });
		socket.emit("count", { count: count + 1 });
	};

	clickReset = () => {
		this.setState({ count: 0 });
		this.state.socket.emit("reset", null);
	};

	render() {
		return (
			<div>
				<h4><Badge color="secondary">Count : {this.state.count}</Badge></h4>
				<Button color="success" onClick={this.clickCount}>Count</Button>{" "}
				<Button color="warning" onClick={this.clickReset}>Reset</Button>
			</div>
		);
	}
}

export default Count;
