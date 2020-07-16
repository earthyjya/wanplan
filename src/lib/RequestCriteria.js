import { Component } from "react";
import axios from "axios";

export class RequestCriteria extends Component {
	state = {
		data: [],
		isLoading: true,
		error: null
	};

	async componentDidMount() {
        // console.log("Getting from " + this.props.url);
        console.log(this.props.urls)
        this.props.urls.map(async url =>
		await axios
			.get(url)
			.then(result => this.setState({ data: [...this.state.data,...result.data], isLoading: false }))
			.catch(error => this.setState({ error, isLoading: false })))
			
	}

	render() {
		// console.log(this.props.children);
		return this.props.children(this.state);
	}
}

export default RequestCriteria;
