// eslint-disable-next-line
import React, { Component } from "react";
import axios from "axios";

export class Request extends Component {
	state = {
		trip_overview: null,
		trip_detail: [],
		isLoading: false,
		error: null
	};

	async componentDidMount() {
		this.setState({ isLoading: true });
		var url1 =
			this.props.serverIP + ":3030/trip_overview?trip_id=" + this.props.trip_id;
		var url2 =
			this.props.serverIP + ":3030/trip_detail?trip_id=" + this.props.trip_id;
		await axios
			.get(url1)
			.then(result1 => this.setState({ trip_overview: result1.data }))
			.then(
				axios
					.get(url2)
					.then(result2 =>
						this.setState({ trip_detail: result2.data, isLoading: false })
					)
					.catch(error2 => this.setState({ error: error2 }))
			)
			.catch(error1 => this.setState({ error: error1, isLoading: false }));
	}

	render() {
		// console.log(this.props.children);
		return this.props.children(this.state);
	}
}

export default Request;
