import React, { Component } from "react";
import axios from "axios";

class AttBarCard extends Component {
  state = {
    photoUrls: []
  };

  async componentDidMount() {
    if (process.env.NODE_ENV === "production") {
      const { google_place_id } = this.props;
      let url = process.env.REACT_APP_APIServer + "/googlephoto/" + google_place_id;
      await axios
        .get(url)
        .then(res => {
          this.setState({ photoUrls: res.data });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
  render() {
    const { attraction_name, attraction_type, open_time, close_time, description } = this.props;
    const { photoUrls } = this.state;
    return (
      <div className="AttBarCard">
        <img
          src={(() => {
            if (photoUrls) return photoUrls[0];
            return "/";
          })()}
          className="attPhoto2"
          alt={attraction_name}
        />
        <div style={{ float: "left", margin: "12px" }}>
          <div className="attName2">{attraction_name}</div>
          <div className="attType2">{attraction_type}</div>

          <div className="description">
            <div>
              <u> opening hours</u> : {open_time} - {close_time}
            </div>
            <div>{description}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default AttBarCard;
