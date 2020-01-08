import React, { Component } from "react";
import axios from "axios";

// higher order component

export default (url, query) => WrappedComponent =>
	class extends Component {
		state = {
			data: [],
			isLoading: false,
			error: null
		};

		componentDidMount() {
			axios
				.get(url + query)
				.then(setState({ data: result.data, isLoading: false }))
				.catch(error => this.setState({ error, isLoading: false }));
		}

		render() {
			return <WrappedComponent {...this.state} {...this.props} />;
		}
	};
