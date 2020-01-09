import React, { Component } from "react";
import './AttCard.css';
import { LoremIpsum } from 'react-lorem-ipsum';

class AttCard extends React.Component {
	render() {
		
		return (
			<div className="AttCard">
				{this.props.isLoading ? (
      <div>Loading...</div>
    ) : this.props.error ? (
      <div>{this.props.error.message}</div>
    ) : (
		//{
		//	const data = this.props.data;
		//}
		this.props.data.map(dat => {
          
			return (
				<div class = "Attcard">
					<div className = "timeFrom">{this.props.start_time}</div>
					<div className = "timeUntil">{this.props.end_time}</div>
					<div className = "attPhoto"></div>
					<div className="attTypeCont">
						<div className = "attType">{dat.attraction_type}</div>
					</div>
					
					<div className = "attName">{dat.attraction_name}</div>
					<div className="attDesCont">
						<LoremIpsum className="attDes" avgSentencesPerParagraph={8}  avgWordsPerSentence={4}/>
					</div>
				</div>
				
				)}))}
			</div>
		);
	}
}

export default AttCard;
