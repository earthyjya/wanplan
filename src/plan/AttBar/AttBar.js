import "../../scss/AttBar.scss";
import AttBarCard from "./AttBarCard.js";
import Autocomplete from "react-google-autocomplete";
import axios from "axios";
import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class AttBar extends Component {
  state = {
    searchedPlace: {},
    nearbyPlaces: [],
    detailsDat: "",
    isLoading: true,
    error: null,
  };

  onPlaceSelected = async (place) => {
    await this.setState({ searchedPlace: {}, nearbyPlaces: [] });
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/googleplace/" + place.place_id;
    console.log(url);
    await axios
      .get(url)
      .then((res) => {
        this.setState({ searchedPlace: res.data[0] });
        url =
          APIServer +
          "/googlenearby?lat=" +
          res.data[0].geometry.location.lat +
          "&lng=" +
          res.data[0].geometry.location.lng;
      })
      .catch((err) => {
        console.log(err);
      });
    await axios
      .get(url)
      .then((res) => {
        // console.log(res.data);
        this.setState({ nearbyPlaces: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  placeNearbyCity = async () => {
    let cities = [
      {
        city_id: 13,
        city: "Fukuoka",
        lat: 33.5901838,
        long: 130.401718,
      },
      {
        city_id: 6,
        city: "Himeji",
        lat: 34.815147,
        long: 134.685349,
      },
      {
        city_id: 5,
        city: "Hiroshima",
        lat: 34.385204,
        long: 132.455292,
      },
      {
        city_id: 2,
        city: "Kanazawa",
        lat: 36.560001,
        long: 136.640015,
      },
      {
        city_id: 7,
        city: "Kobe",
        lat: 34.688896,
        long: 135.193977,
      },
      {
        city_id: 8,
        city: "Kyoto",
        lat: 35.01858,
        long: 135.763835,
      },
      {
        city_id: 1,
        city: "Nagoya",
        lat: 35.155397,
        long: 136.903381,
      },
      {
        city_id: 9,
        city: "Osaka",
        lat: 34.685293,
        long: 135.514694,
      },
      {
        city_id: 15,
        city: "Sendai",
        lat: 38.266651,
        long: 140.869446,
      },
      {
        city_id: 3,
        city: "Shizuoka",
        lat: 34.977119,
        long: 138.383087,
      },
      {
        city_id: 12,
        city: "Tokyo",
        lat: 35.6803997,
        long: 139.7690174,
      },
      {
        city_id: 11,
        city: "Yokohama",
        lat: 35.443707,
        long: 139.638031,
      },
      { city: "Hatsukaichi", city_id: 4, lat: 34.348505, long: 132.331833 },
      { city: "Suita", city_id: 10, lat: 34.759779, long: 135.515799 },
      { city: "Naha", city_id: 14, lat: 26.20047, long: 127.728577 },
    ];
    const APIServer = process.env.REACT_APP_APIServer;
    let cityLat = cities.filter(
      (location) => location.city == this.props.plan_overview.city
    )[0].lat;
    let cityLong = cities.filter(
      (location) => location.city == this.props.plan_overview.city
    )[0].long;
    let url = APIServer + "/googlenearby?lat=" + cityLat + "&lng=" + cityLong;
    // console.log(url);
    await axios
      .get(url)
      .then((res) => {
        // console.log(res.data);
        this.setState({ nearbyPlaces: res.data, isLoading: false });
      })
      .catch((err) => {
        this.setState({ error: err });
        console.log(err);
      });
  };

  fetchAttraction = async () => {
    this.setState({ isLoading: true });
    const APIServer = process.env.REACT_APP_APIServer;
    let url =
      APIServer + "/attraction/city/" + this.props.plan_overview.city_id;
    console.log(url);
    await axios
      .get(url)
      .then((res) => {
        // console.log(res.data);
        this.setState({ data: res.data.splice(0, 10), isLoading: false });
      })
      .catch((err) => {
        this.setState({ error: err });
        console.log(err);
      });
  };

  async componentDidMount() {
    this.attbarRef = React.createRef();
    // this.placeNearbyCity();
    this.fetchAttraction();
  }

  showDetails(dat) {
    this.setState({ detailsDat: dat });
    this.props.showDetails(dat);
    this.attbarRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  render() {
    let { detailsDat } = this.state;
    return (
      <div ref={this.attbarRef} className="att-bar-wrap">
        {detailsDat !== "" ? (
          <div className="att-bar-desc">
            <Droppable
              droppableId={(detailsDat.google_place_id!== undefined) 
                ? detailsDat.google_place_id + "Bar"
              : detailsDat.place_id + "Bar"}
              isDropDisabled={true}
              type={String}
              direction="vertical"
              isCombineEnabled={false}
            >
              {(dropProvided) => (
                <div
                  {...dropProvided.droppableProps}
                  ref={dropProvided.innerRef}
                >
                  <Draggable
                    draggableId={(detailsDat.attraction_id!== undefined) 
                      ? detailsDat.attraction_id + "Bar"
                    : detailsDat.place_id + "Bar"}
                    index={0}
                  >
                    {(dragProvided) => (
                      <div
                        {...dragProvided.dragHandleProps}
                        {...dragProvided.draggableProps}
                        ref={dragProvided.innerRef}
                      >
                        <h3>
                          {this.state.detailsDat.name
                            ? this.state.detailsDat.name
                            : this.state.detailsDat.attraction_name}
                        </h3>
                        <div style={{ display: "flex", flexDirection: "row" }}>
                          <img
                            style={{ width: "160px", height: "100px" }}
                            alt="PlaceHolder"
                            src={
                              this.state.detailsDat.photos
                                ? this.state.detailsDat.photos[0]
                                : "https://via.placeholder.com/160x100"
                            }
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              paddingLeft: "0.8em",
                            }}
                          >
                            <span>
                              {" "}
                              <FontAwesomeIcon icon="clock" /> operating hours:
                              09.00 - 24.00
                            </span>
                            <span>
                              {" "}
                              <FontAwesomeIcon icon="money-bill-wave" />{" "}
                              entrance fee
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>

                  {dropProvided.placeholder}
                </div>
              )}
            </Droppable>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              mod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              nim veniam, quis nostrud exercitation ullamco laboris nisi ut
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              mod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              nim veniam, quis nostrud exercitation ullamco laboris nisi ut
            </p>
            <button
              onClick={this.props.toggleAttModal}
              className="details-button"
            >
              more details
            </button>
            <hr />
          </div>
        ) : (
          <React.Fragment />
        )}
        <div className="search-container">
          <span>Nearby</span>
          <FontAwesomeIcon className="search-icon" icon="search" />
          <Autocomplete
            className="search-bar"
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              borderColor: "",
            }}
            onPlaceSelected={this.onPlaceSelected}
            types={["geocode", "establishment"]}
            placeholder={this.searchPlaceholder}
            onFocus={() => {
              this.placeholder = "";
            }}
            onBlur={() => {
              this.placeholder = "enter your text";
            }}
            componentRestrictions={{ country: ["jp", "th"] }}
          />
        </div>

        {this.state.isLoading ? (
          <div className="AttBar">Loading...</div>
        ) : this.state.error ? (
          <div className="AttBar">{this.state.error.message}</div>
        ) : (
          <div className="AttBar">
            {(() => {
              if (this.state.searchedPlace.google_place_id)
                return (
                  <div
                    onClick={() => this.showDetails(this.state.searchedPlace)}
                  >
                    <Droppable
                      droppableId={
                        this.state.searchedPlace.google_place_id + "bar"
                      }
                      isDropDisabled={true}
                      type={String}
                      direction="vertical"
                      isCombineEnabled={false}
                    >
                      {(dropProvided) => (
                        <div
                          {...dropProvided.droppableProps}
                          ref={dropProvided.innerRef}
                        >
                          <Draggable
                            draggableId={
                              this.state.searchedPlace.attraction_id.toString() +
                              "bar"
                            }
                            index={this.state.searchedPlace.attraction_id}
                          >
                            {(dragProvided) => (
                              <div
                                {...dragProvided.dragHandleProps}
                                {...dragProvided.draggableProps}
                                ref={dragProvided.innerRef}
                              >
                                <AttBarCard {...this.state.searchedPlace} />
                              </div>
                            )}
                          </Draggable>
                          {dropProvided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                );
            })()}
            {(() => {
              if (this.state.nearbyPlaces !== [])
                return (
                  <React.Fragment>
                    {this.state.nearbyPlaces
                      .filter((place) =>
                        place.types.find(
                          (type) =>
                            type === "point_of_interest" ||
                            type === "tourist_attraction"
                        )
                      )
                      .splice(0, 10)
                      .map((dat) => (
                        <div onClick={() => this.showDetails(dat)}>
                          <Droppable
                            key={dat.place_id.toString()}
                            index =  {this.state.nearbyPlaces.findIndex(d => d===dat)}
                            droppableId={dat.place_id + "bar"}
                            isDropDisabled={true}
                            type={String}
                            direction="vertical"
                            isCombineEnabled={false}
                          >
                            {(dropProvided) => (
                              <div
                                {...dropProvided.droppableProps}
                                ref={dropProvided.innerRef}
                              >
                                <Draggable
                                  draggableId={dat.place_id + "bar"}
                                  index = {this.state.nearbyPlaces.findIndex(d => d===dat)}
                                  key = {dat.place_id.toString()}
                                >
                                  {(dragProvided) => (
                                    <div
                                      {...dragProvided.dragHandleProps}
                                      {...dragProvided.draggableProps}
                                      ref={dragProvided.innerRef}
                                    >
                                      <AttBarCard
                                        attraction_name={dat.name}
                                        attraction_type={dat.types[0]}
                                        photos={dat.photos}
                                        key = {dat.place_id.toString()}
                                      />
                                    </div>
                                  )}
                                </Draggable>

                                {dropProvided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      ))}
                  </React.Fragment>
                );
            })()}
            {this.state.data.map((dat) => (
              <div key = {dat.attraction_id} onClick={() => this.showDetails(dat)}>
                <Droppable
                  index={dat.attraction_id}
                  droppableId={dat.google_place_id + "bar"}
                  isDropDisabled={true}
                  type={String}
                  direction="vertical"
                  isCombineEnabled={false}
                >
                  {(dropProvided) => (
                    <div
                      {...dropProvided.droppableProps}
                      ref={dropProvided.innerRef}
                    >
                      <Draggable
                        draggableId={dat.attraction_id.toString() + "bar"}
                        index={dat.attraction_id}
                        key = {dat.attraction_id.toString() + "bar"}
                      >
                        {(dragProvided) => (
                          <div
                            {...dragProvided.dragHandleProps}
                            {...dragProvided.draggableProps}
                            ref={dragProvided.innerRef}
                          >
                            <AttBarCard {...dat} key = {dat.attraction_id.toString() + "bar"}/>
                          </div>
                        )}
                      </Draggable>

                      {dropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default AttBar;
