import React from "react";
import Share from "./Share";
import Timeline from "./Timeline";
import AttracDes from "./AttracDes";

class Plan extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modal: false,
			trip_id: null
		};
	}

	toggle = () => this.setState({ modal: !this.state.modal });

	close = () => {
		if (this.state.modal === true) {
			this.setState({ modal: false });
		}
	};

	componentDidMount() {
		// DO sth
	}

	render() {
		return (
			<div>
				<div className="title-bar">
					<div className="city">{this.state.city_name}</div>
					<div className="title">{this.state.trip_title}</div>
					<button className="share" onClick={this.toggle}>
						Share!
						<span style={{ fontSize: "15px" }}>
							<br />
							this plan
						</span>
					</button>
				</div>

				{this.state.modal ? (
					<div className="share-modal">
						<Share close={this.close} />
					</div>
				) : (
					<div></div>
				)}

				<Timeline {...this.state} />

				<AttracDes {...this.state} />
			</div>
		);
	}
}

export default Plan;
