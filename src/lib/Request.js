// eslint-disable-next-line
import React, { Component } from "react";
import axios from "axios"

export class Request extends Component {
	state = {
		data: []
	};

	async componentDidMount() {
		const result = await axios.get(this.props.url);
		this.setState({ data: result.data });
	}

	render() {
		// console.log(this.props.children);
		return this.props.children(this.state.data);
	}
}

export default Request;
