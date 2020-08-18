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
    data: [],
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
        this.props.setSearchedPlace(res.data[0])
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
    this.attbarRef.current.scrollTo({ top: 0, behavior: "smooth" });
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
        // this.setState({ error: err });
        console.log(err);
      });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.nearbyCenter !== this.props.nearbyCenter) {
      this.showDetails(this.props.nearbyCenter)
    }
  }

  async componentDidMount() {
    this.attbarRef = React.createRef();
    // this.fetchAttraction();
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
                            <span className="att-bar-delete" onClick={() => this.setState({detailsDat: ""})}>
                             &#10005;
                           </span>
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
            componentRestrictions={{ country: "jp" }}
          />
        </div>

        {!this.props.nearbyLoaded  ? (
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
              if (this.props.nearbyPlaces !== [])
                return (
                  <React.Fragment>
                    {this.props.nearbyPlaces
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
                            index={this.props.nearbyPlaces.findIndex(
                              (d) => d === dat
                            )}
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
                                  index={this.props.nearbyPlaces.findIndex(
                                    (d) => d === dat
                                  )}
                                  key={dat.place_id.toString()}
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
                                        key={dat.place_id.toString()}
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
              <div
                key={dat.attraction_id}
                onClick={() => this.showDetails(dat)}
              >
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
                        key={dat.attraction_id.toString() + "bar"}
                      >
                        {(dragProvided) => (
                          <div
                            {...dragProvided.dragHandleProps}
                            {...dragProvided.draggableProps}
                            ref={dragProvided.innerRef}
                          >
                            <AttBarCard
                              {...dat}
                              key={dat.attraction_id.toString() + "bar"}
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
          </div>
        )}
      </div>
    );
  }
}

export default AttBar;
