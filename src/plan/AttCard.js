import React, { Component } from "react";
import "./AttCard.css";
import { LoremIpsum } from "react-lorem-ipsum";

class AttCard extends Component {
  render() {
    const { isLoading, error, attraction, start_time, end_time, order } = this.props;
    if (isLoading) return <div className="AttCard">Loading...</div>;
    if (error) return <div className="AttCard">Something went wrong :(</div>;
    return (
      <div
        className="AttCard"
      >
        <div className="StartTime">{start_time}</div>
        <div className="EndTime">{end_time}</div>
		<div className="AttTypeCont">
          <div className="AttType">{attraction.attraction_type}</div>
        </div>
        <div className="AttName">{attraction.attraction_name}</div>
        <img className="AttPhoto" />
        
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
