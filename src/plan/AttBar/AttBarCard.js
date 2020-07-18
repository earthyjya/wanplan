import React, { Component } from "react";
import axios from "axios";

class AttBarCard extends Component {
  state = {
    photos: [],
  };

  async componentDidMount() {
    if (process.env.NODE_ENV === "production") {
      if (this.props.photos) {
        await this.setState({ photos: this.props.photos });
        return;
      }
      const { google_place_id } = this.props;
      let url =
        process.env.REACT_APP_APIServer + "/googlephoto/" + google_place_id;
      await axios
        .get(url)
        .then((res) => {
          this.setState({ photos: res.data[0].photos });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  checkBgImage() {
    var style = {
      backgroundImage: "url(https://via.placeholder.com/300x200)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
    if (this.state.photos.length > 0) {
      style.backgroundImage = "url(" + this.state.photos[0] + ")";
      console.log(this.state.photos);
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
          {" "}
          {attraction_type ? attraction_type.replace("_", " ") : ""}
        </div>
        <div className="image" style={this.checkBgImage()}>
          <div className="description-container">
            <div className="open-time">
              {" "}
              Open : {open_time} - {close_time}{" "}
            </div>
            <div className="name">{attraction_name}</div>
            <div className="description">
              {" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              mod tempor incididunt ut labore et dolore magna aliqua.
              {description}{" "}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AttBarCard;
