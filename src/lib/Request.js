// eslint-disable-next-line
import React, { Component } from "react";
import axios from "axios";

export class Request extends Component {
	state = {
		data: [],
		isLoading: true,
		error: null
	};

	async componentDidMount() {
		// console.log("Getting from " + this.props.url);
		await axios
			.get(this.props.url)
			.then(result => this.setState({ data: result.data, isLoading: false }))
			.catch(error => this.setState({ error, isLoading: false }));
	}

	render() {
		// console.log(this.props.children);
		return this.props.children(this.state);
	}
}

export default Request;
