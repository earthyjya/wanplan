import React, { Component } from "react";
import "./AttCard.css";
import { LoremIpsum } from "react-lorem-ipsum";

class AttCard extends Component {
	render() {
		const { isLoading, error, data, start_time, end_time } = this.props;
		if (isLoading) return <div className="AttCard">Loading...</div>;
		if (error) return <div className="AttCard">Something went wrong :(</div>;
		const [attraction, ...rest] = data;
		return (
			<div className="AttCard">
				<div className="StartTime">{start_time}</div>
				<div className="EndTime">{end_time}</div>
				<img className="AttPhoto" />
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
