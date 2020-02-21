import React, { Component } from "react";
import "./AttCard.css";
import { LoremIpsum } from "react-lorem-ipsum";

class AttCard extends Component {
  changeDuration = e => {
    this.props.changeDuration(this.props.order, e.target.value);
  };

  delCard = () => {};

  render() {
    const {
      isLoading,
      error,
      attraction,
      start_time,
      end_time,
      time_spend
    } = this.props;
    if (isLoading) return <div className="AttCard">Loading...</div>;
    if (error) return <div className="AttCard">Something went wrong :(</div>;
    return (
      <div className="AttCard">
        <div className="StartTime">{start_time}</div>
        <div className="EndTime">{end_time}</div>
        <div className="AttName">{attraction.attraction_name}</div>
        <div className="AttTypeCont">
          <div className="AttType">{attraction.attraction_type}</div>
        </div>
        <img className="AttPhoto" alt={attraction.attraction_name} />

        <div className="AttDesCont">
          <LoremIpsum
            className="AttDes"
            avgSentencesPerParagraph={8}
            avgWordsPerSentence={4}
          />
        </div>
        <select
          className="SelAttDura"
          value={time_spend}
          onChange={this.changeDuration}
        >
          <option>0</option>
          <option>10</option>
          <option>20</option>
          <option>30</option>
          <option>40</option>
          <option>50</option>
          <option>60</option>
          <option>70</option>
          <option>80</option>
          <option>90</option>
          <option>100</option>
          <option>110</option>
          <option>120</option>
          <option>130</option>
          <option>140</option>
          <option>150</option>
          <option>160</option>
          <option>170</option>
          <option>180</option>
          <option>190</option>
          <option>200</option>
          <option>210</option>
          <option>220</option>
          <option>230</option>
          <option>240</option>
          <option>250</option>
          <option>260</option>
          <option>270</option>
          <option>280</option>
          <option>290</option>
          <option>300</option>
        </select>
      </div>
    );
  }
}

export default AttCard;
