// eslint-disable-next-line
import React, { Component } from "react";
import axios from "axios"

export class Request extends Component {
	state = {
		data: [],
		isLoading: false,
		error: null
	};

	async componentDidMount() {
		this.setState({ isLoading: true });

		await axios.get(this.props.url)
		.then(result => this.setState({data: result.data, isLoading: false}))
		.catch(error => this.setState({error, isLoading: false}))
	}

	render() {
		// console.log(this.props.children);
		return this.props.children(this.state);
	}
}

export default Request;
