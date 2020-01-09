import React, { Component } from "react";
import './AttCard.css';
import { LoremIpsum } from 'react-lorem-ipsum';


class AttCard extends React.Component {
	render() {
		if (this.props.isLoading) return <div>Loading...</div>;
		if (this.props.error) return <div>Something went wrong :(</div>;
		const [attraction, ...rest] = this.props.data;
		return (
			<div className="AttCard">
				<div className="timeFrom">{this.props.start_time}</div>
				<div className="timeUntil">{this.props.end_time}</div>
				<div className="attPhoto"></div>
				<div className="attTypeCont">
					<div className = "attType">{attraction.attraction_type}</div>
				</div>
        <div className = "attName">{dat.attraction_name}</div>
				<div className="attDesCont">
					<LoremIpsum className="attDes" avgSentencesPerParagraph={8}  avgWordsPerSentence={4}/>
				</div>
			</div>
		);
	}
}

export default AttCard;
