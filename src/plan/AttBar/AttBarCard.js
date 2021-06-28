import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

class AttBarCard extends Component {
  state = {
    photos: [],
    isFavorited: false,
  };

  toggleFavorite(e) {
    const { google_place_id, onUnFavorite } = this.props
    let favorite_places = JSON.parse(localStorage.getItem("favorite_places"));
    if (favorite_places === null){
      localStorage.setItem("favorite_places", JSON.stringify([]));
      favorite_places  = []
    }
    if(favorite_places.includes(google_place_id)){
      favorite_places = favorite_places.filter(id => id !== google_place_id)
    }
    else{
      favorite_places.push(google_place_id);
    }
    localStorage.setItem("favorite_places", JSON.stringify(favorite_places));

    // prevent dragging card
    e.stopPropagation();
    this.setState({isFavorited: !this.state.isFavorited}, 
      () => {
        // callback, used in AttBarFavorite
        onUnFavorite && !this.state.isFavorited && onUnFavorite(google_place_id)
      }
    );
  }

  async componentDidMount() {
    if (process.env.NODE_ENV === "production") {
      const { google_place_id } = this.props;
      let url = process.env.REACT_APP_APIServer + "/googlephoto/" + google_place_id;
      await axios
        .get(url)
        .then((res) => {
          this.setState({ photos: res.data[0].photos });
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.checkFavorited()
  }

  checkFavorited(){
    const { google_place_id } = this.props
    let favorite_places = JSON.parse(localStorage.getItem("favorite_places"));
    favorite_places ?
      this.setState({isFavorited: favorite_places.includes(google_place_id)}) :
      this.setState({isFavorited: false})
  }

  checkBgImage() {
    var style = {
      backgroundImage: "url(/no-photo-placeholder.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
    if (this.state.photos.length > 0) {
      style.backgroundImage = "url(" + this.state.photos[0] + ")";
    }
    return style;
  }

  render() {
    const {
      attraction_name,
      attraction_type,
      open_time,
      close_time,
      description,
    } = this.props;
    return (
      <div
        className="AttBarCard"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div className="type">
          {` ${attraction_type ? attraction_type.replaceAll("_", " ") : ""}`}
        </div>
        <div className="image" style={this.checkBgImage()}>
          <FontAwesomeIcon 
            onClick={ (e) => this.toggleFavorite(e) } 
            className={this.state.isFavorited ? "star-on" : "star-off"} 
            icon="star"
          />
          <div className="description-container">
            <div className="open-time"> {` Open : ${open_time} - ${close_time}`} </div>
            <div className="name">{attraction_name}</div>
            <div className="description"> {` Attraction details ${description} `} </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AttBarCard;