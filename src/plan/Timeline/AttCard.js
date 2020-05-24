import "../../scss/AttCard.scss";
import AttModal from "./AttModal.js";
import React, { Component } from "react";

class AttCard extends Component {
  state = {
    showAttModal: false,
    description: "",
    photos: [],
    isFocused: false //isFocused is not focus seen by DOM
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
    this.attRef = React.createRef();
    this.handleBlur = this.handleBlur.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.toggleAttModal = this.toggleAttModal.bind(this);
  }

  handleBlur(event){
    if(!event.currentTarget.contains(event.relatedTarget))
      this.setState({isFocused: false})
  }

  handleClick(){
    if(!this.state.isFocused && this.props.editing)
      this.attRef.current.focus()
  }

  toggleAttModal(){
    this.setState({showAttModal: !this.state.showAttModal})
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
      0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,
      150,160,170,180,190,200,210,220,230,240,250,260,
      270,280,290,300
    ];
    if (isLoading) return <div className="AttCard">Loading...</div>;
    if (error) return <div className="AttCard">Something went wrong :(</div>;
    return (
        <React.Fragment>
        <AttModal toggle={this.toggleAttModal} isOpen={this.state.showAttModal}/>
        <div
          className="AttCard"
          ref={this.attRef}
          onClick={this.handleClick}
          onFocus={() => {this.setState({isFocused: true})}}
          onBlur={this.handleBlur}
          tabIndex="0"
        >
          <div className="StartTimeDot">
            {(() => { //If editing and focus, show minutes selector else show start time
              if(this.state.isFocused && this.props.editing){
                return(
                  <select
                    className="SelAttDura"
                    value={time_spend}
                    onChange={this.changeDuration}
                  >
                    {minutes.map(min => {
                      return <option key={min}>{min} mins</option>;
                    })}
                  </select>
                )
              }
              else {
                return(
                  <div className="StartTime">{start_time}</div>
                )
              }
            })()}
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
              onClick={this.toggleAttModal}
            />
          </div>
          <div class="AttDetailsCont">
            <div class="AttName">{attraction_name}</div>
              {(() => {  //If editing and focus, show textarea to edit else show just text
                if(this.state.isFocused && this.props.editing){
                  return(
                    <textarea
                      className="AttDesCont"
                      value={this.state.description}
                      onChange={this.onChange}
                      onBlur={this.updateDescription}
                      type="textarea"
                    />
                  )
                }
                else {
                  return(
                    <div>{description}</div>
                  )
                }
              })()}
          </div>
          {(() => { //If editing, show delete button
            if(this.props.editing){
              return(
                <div className="DelCard" onClick={this.delCard}>
                      &#10005;
                </div>
              )
            }
          })()}
        </div>
        </React.Fragment>
    );
  }
}

export default AttCard;
