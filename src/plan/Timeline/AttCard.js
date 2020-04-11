import "../../scss/AttCard.scss";
import React, { Component } from "react";

class AttCard extends Component {
  state = {
    description: ""
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
      description
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
      <div className="AttCard">
        {(() => {
          if (editing)
            return (
              <div className="DelCard" onClick={this.delCard}>
                &#10005;
              </div>
            );
        })()}

        <div className="StartTime">{start_time}</div>
        <div className="EndTime">{end_time}</div>
        <div className="AttName">{attraction_name}</div>
        <div className="AttTypeCont">
          <div className="AttType">{attraction_type}</div>
        </div>
        <img className="AttPhoto" alt={attraction_name} />

        {(() => {
          if (editing)
            return (
              <React.Fragment>
                <textarea
                  className="AttDesCont"
                  value={this.state.description}
                  onChange={this.onChange}
                  onBlur={this.updateDescription}
                  type="textarea"
                />
                <select className="SelAttDura" value={time_spend} onChange={this.changeDuration}>
                  {minutes.map(min => {
                    return <option>{min}</option>;
                  })}
                </select>
              </React.Fragment>
            );
          else return <div className="AttDesCont">{description}</div>;
        })()}
      </div>
    );
  }
}

export default AttCard;
