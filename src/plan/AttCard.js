import React, { Component } from "react";
import "./AttCard.css";
import { LoremIpsum } from "react-lorem-ipsum";

class AttCard extends Component {
	render() {
		if (this.props.isLoading) return <div className="AttCard">Loading...</div>;
		if (this.props.error)
			return <div className="AttCard">Something went wrong :(</div>;
		const [attraction, ...rest] = this.props.data;
		return (
			<div className="AttCard">
				<div className="StartTime">{this.props.start_time}</div>
				<div className="EndTime">{this.props.end_time}</div>
				<div className="AttPhoto"></div>
				<div className="AttTypeCont">
					<div className="AttType">{attraction.attraction_type}</div>
				</div>
				<div className="AttName">{attraction.attraction_name}</div>
				<div className="AttDesCont">
					<LoremIpsum
						className="AttDes"
						avgSentencesPerParagraph={8}
						avgWordsPerSentence={4}
					/>
				</div>
			</div>
		);
	}
}

export default AttCard;
