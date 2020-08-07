import React, { Component } from "react";
import AttCard from "../plan/Timeline/TransCard";
import TransCard from "../plan/Timeline/TransCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../scss/MobileTimeline.scss";

class MobileDayTimeline extends Component {
  mobileAttCard(detail){
    const {
      isLoading,
      start_time,
      end_time,
      time_spend,
      attraction_name,
      description,
      photos
    } = detail;
    return(
      <div className="m-attcard-container">
        <span className="time"> 8:00 </span>
        <div className="m-attcard">
          <div className="image-container">
            <img
              src={(() => {
                if (photos) return photos[0];
                return "https://via.placeholder.com/140x140";
              })()}
              alt={attraction_name}
              className="image"
            />
            <div>
              <div className="type"> tourism </div>
              <div className="title"> Someplacedera </div>
              <div className="info"> entrance fee: xxx JPY opening: .... </div>
            </div>
          </div>
          <div className="note">
            <span className="title"> author's note </span>
            <div className="detail"> lorem ipsum sawassdee krub pee eiei sabai dee mai kub</div>
          </div>
        </div>
      </div>
    )
  }

  mobileTransCard(transport, start, destination){
    if (transport && transport.mode) {
      return(
        <div className="m-transcard-container">
          <div className="location-container">
            <span className="distance"> 800m </span>
            <a
              className="map"
              href={
                "https://www.google.com/maps/dir/?api=1&origin=" +
                start.attraction_name +
                "&origin_place_id=" +
                start.google_place_id +
                "&destination=" +
                destination.attraction_name +
                "&destination_place_id=" +
                destination.google_place_id
              }
              target="_blank"
            >
              Google Map
            </a>
          </div>
          <div className="transport-container">
            {(() => {
              if (transport.mode === "driving")
                return (
                  <span>
                    <FontAwesomeIcon icon="car" size="sm" />
                    <span>{transport.text}</span>
                  </span>
                );
              if (transport.mode === "transit")
                return (
                  <span>
                    <FontAwesomeIcon icon="train" size="sm" />
                    <span>{transport.text}</span>
                  </span>
                );
              if (transport.mode === "walking")
                return (
                  <span>
                    <FontAwesomeIcon icon="walking" size="sm" />
                    <span>{transport.text}</span>
                  </span>
                );
              })()}
            </div>
          </div>
        )
    }
    return <div className="m-transcard-container"> No transport </div>;
  }

  render() {
    const { plan_detail, day, editing, transports} = this.props;
    return(
      <div>
        {(() => {
          let att_show = [];
          let idx = 0;
          let start = "";
          let destination = "";
          plan_detail.map((detail) => {
            {(() => {
              start = (() => {
                if (detail !== plan_detail[0]) {
                  return plan_detail.filter(
                    det => det.attraction_order === detail.attraction_order - 1
                  )[0];
                } else {
                  return { attraction_name: "Hotel" };
                }
              })();
              destination = detail;
            })()}
            if (idx === 0)
              att_show.push(
                this.mobileTransCard(transports[day - 1][idx], start, destination)
              );
            att_show.push(this.mobileAttCard(detail));
            console.log(transports)
            att_show.push(
              this.mobileTransCard(transports[day - 1][idx + 1], start, destination)
            );
            idx = idx + 1;
          });
          return att_show;
        })()}
      </div>
    );
  }
}

export default MobileDayTimeline;