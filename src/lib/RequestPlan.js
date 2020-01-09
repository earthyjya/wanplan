// eslint-disable-next-line
import React, { Component } from "react";
import axios from "axios";

export class Request extends Component {
	state = {
		trip_overview: [],
		trip_detail: [],
		city: [],
		isLoading: true,
		error: null
	};

	async componentDidMount() {
		var url =
			this.props.serverIP + ":3030/trip_overview?trip_id=" + this.props.trip_id;
		await axios
			.get(url)
			.then(result => {
				const [trip_overview, ...rest] = result.data;
				this.setState({ trip_overview });
			})
			.catch(error => this.setState({ error }));
		if (!this.state.trip_overview) {
			this.setState({ isLoading: false, error: true });
			return;
		}
		var url =
			this.props.serverIP + ":3030/trip_detail?trip_id=" + this.props.trip_id;
		await axios
			.get(url)
			.then(result => this.setState({ trip_detail: result.data }))
			.catch(error => this.setState({ error }));
		var url = this.props.serverIP + ":3030/city?city_id=" + this.state.trip_overview.city_id;
		await axios
			.get(url)
			.then(result => {
				const [city, ...rest] = result.data;
				this.setState({ city , isLoading: false});
			})
			.catch(error => this.setState({ error, isLoading: false }));
	}

	render() {
		// console.log(this.props.children);
		return this.props.children(this.state);
	}
}

export default Request;
