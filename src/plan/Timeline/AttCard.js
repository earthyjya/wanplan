import "../../scss/AttCard.scss";
import React, { Component } from "react";

class AttCard extends Component {
  state = {
    description: "",
    title: "",
    photos: [],
    isFocused: false, //isFocused is not focus seen by DOM
  };

  changeDuration = (e) => {
    this.props.changeDuration(
      this.props.detail.attraction_order,
      e.target.value
    );
  };

  delCard = () => {
    this.props.delCard(this.props.detail.attraction_order);
  };

  onChange = (e) => {
    this.setState({ description: e.target.value });
  };

  onChangeTitle = (e) => {
    this.setState({ title: e.target.value });
  };

  updateTitle = () => {
    this.props.updateTitle(
      this.props.detail.attraction_order,
      this.state.title
    );
  };

  updateDescription = () => {
    this.props.updateDescription(
      this.props.detail.attraction_order,
      this.state.description
    );
  };

  componentDidMount() {
    this.setState({ description: this.props.detail.description });
    this.attRef = React.createRef();
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget))
      this.setState({ isFocused: false });
  }

  handleClick() {
    if (!this.state.isFocused && this.props.editing)
      this.attRef.current.focus();
  }

  render() {
    const {
      error,
      isLoading,
      start_time,
      end_time,
      time_spend,
      attraction_name,
      description,
      photos,
      google_place_id,
    } = this.props.detail;
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
      300,
    ];
    if (isLoading) return <div className="AttCard">Loading...</div>;
    if (error) return <div className="AttCard">Something went wrong :(</div>;
    return (
      <div className="AttCardContainer">
        <div className="AttCardTimeContainer">
          <div className="AttDotStart">
            <div className="Time"> {start_time} </div>
          </div>
          {(() => {
            if (this.props.editing) {
              return (
                <select
                  className="SelAttDura"
                  value={time_spend}
                  onChange={this.changeDuration}
                >
                  {minutes.map((min) => {
                    return (
                      <option value={min} key={min}>
                        {min} mins
                      </option>
                    );
                  })}
                </select>
              );
            } else {
              return <div className="Duration">{time_spend} mins</div>;
            }
          })()}
          <div className="AttDotStop">
            <div className="Time"> {end_time} </div>
          </div>
        </div>
        <div
          className="AttCard"
          ref={this.attRef}
          onClick={this.handleClick}
          onFocus={() => {
            this.setState({ isFocused: true });
            // if (this.props.editing) this.props.showDetails(this.props.detail);
          }}
          onBlur={this.handleBlur}
          tabIndex="0"
        >
          <div className="Triangle" />
          {(() => {
            if (google_place_id == "freetime") return null;
            else
              return (
                <div className="AttPhotoCont">
                  <div className="AttTypeCont">
                    <div className="AttType">Type</div>
                  </div>
                  <img
                    src={(() => {
                      if (photos) return photos[0];
                      return "https://via.placeholder.com/140x140";
                    })()}
                    className="AttPhoto"
                    alt={attraction_name}
                    onClick={this.props.toggleAttModal}
                  />
                </div>
              );
          })()}
          <div className="AttDetailsCont">
            <div className="AttName">
              {attraction_name}
              {this.props.editing && google_place_id !== null ? (
                <span
                  className="see-nearby-button"
                  onClick={() => this.props.updateNearby(this.props.detail)}
                >
                  {" "}
                  see nearby
                </span>
              ) : (
                <React.Fragment></React.Fragment>
              )}
            </div>
            {(() => {
              //If editing and focus, show textarea to edit else show just text
              if (this.props.editing) {
                return (
                  <textarea
                    placeholder="Click to add description"
                    className="AttDesCont"
                    value={this.state.description}
                    onChange={this.onChange}
                    onBlur={this.updateDescription}
                    type="textarea"
                  />
                );
              } else {
                return <div>{description}</div>;
              }
            })()}
          </div>
          {(() => {
            //If editing, show delete button
            if (this.props.editing) {
              return (
                <div className="DelCard" onClick={this.delCard}>
                  &#10005;
                </div>
              );
            }
          })()}
        </div>
      </div>
    );
  }
}

export default AttCard;
