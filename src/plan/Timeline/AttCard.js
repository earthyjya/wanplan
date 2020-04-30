import "../../scss/AttCard.scss";
import React, { Component } from "react";

class AttCard extends Component {
  state = {
    description: "",
    photos: []
  };

  changeDuration = e => {
    this.props.changeDuration(this.props.attraction_order, e.target.value);
  };

  delCard = () => {
    this.props.delCard(this.props.attraction_order);
  };

  onChange = e => {
    this.setState({ description: e.target.value });
  };

  updateDescription = () => {
    this.props.updateDescription(this.props.attraction_order, this.state.description);
  };

  componentDidMount() {
    this.setState({ description: this.props.description });
  }

  render() {
    const {
      error,
      isLoading,
      editing,
      start_time,
      end_time,
      time_spend,
      attraction_name,
      attraction_type,
      description,
      photos
    } = this.props;
    let minutes = [
      0,
      10,
      20,
      30,
      40,
      50,
      60,
      70,
      80,
      90,
      100,
      110,
      120,
      130,
      140,
      150,
      160,
      170,
      180,
      190,
      200,
      210,
      220,
      230,
      240,
      250,
      260,
      270,
      280,
      290,
      300
    ];
    if (isLoading) return <div className="AttCard">Loading...</div>;
    if (error) return <div className="AttCard">Something went wrong :(</div>;
    return (
      <React.Fragment>

      <div className="AttCard">
        <div className="StartTimeDot">
          <div className="StartTime">{start_time}</div>
        </div>
        <div class="Triangle"/>
        <div class="AttPhotoCont">
          <div className="AttTypeCont">
            <div className="AttType">Type</div>
          </div>
          <img
            src={(() => {
              if (photos) return photos[0];
              return "/";
            })()}
            className="AttPhoto"
            alt={attraction_name}
          />
        </div>
        <div class="AttDetailsCont">
          <div class="AttName">{attraction_name}</div>
          <div>lorem ipsum อะไรสักอย่างขี้เกียจไปก๊อปมาอ่ะ เขียนมั่วๆ ให้ยาวๆ ไปละกัน</div>
        </div>
      </div>
      </React.Fragment>
    );
  }
}

export default AttCard;
