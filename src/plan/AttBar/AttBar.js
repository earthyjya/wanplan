import "../../scss/AttBar.scss";
import AttBarCard from "./AttBarCard.js";
import Autocomplete from "react-google-autocomplete";
import axios from "axios";
import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

class AttBar extends Component {
  state = {
    searchedPlace: {},
    nearbyPlaces: []
  };

  onPlaceSelected = async place => {
    await this.setState({ searchedPlace: {}, nearbyPlaces: [] });
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/googleplace/" + place.place_id;
    // console.log(url);
    await axios
      .get(url)
      .then(res => {
        this.setState({ searchedPlace: res.data[0] });
        url =
          APIServer +
          "/googlenearby?lat=" +
          res.data[0].geometry.location.lat +
          "&lng=" +
          res.data[0].geometry.location.lng;
      })
      .catch(err => {
        console.log(err);
      });
    await axios
      .get(url)
      .then(res => {
        console.log(res.data);
        this.setState({ nearbyPlaces: res.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div className="att-bar-wrap">
        <div className="search">
          <Autocomplete
            className="search-text"
            style={{ backgroundColor: "grey" }}
            onPlaceSelected={this.onPlaceSelected}
            types={["geocode", "establishment"]}
            componentRestrictions={{ country: "jp" }}
          />
        </div>

        {this.props.isLoading ? (
          <div className="AttBar">Loading...</div>
        ) : this.props.error ? (
          <div className="AttBar">{this.props.error.message}</div>
        ) : (
          <div className="AttBar">
            {(() => {
              if (this.state.searchedPlace.google_place_id)
                return (
                  <React.Fragment>
                    <Droppable
                      droppableId={this.state.searchedPlace.google_place_id + "bar"}
                      isDropDisabled={true}
                      type={String}
                      direction="vertical"
                      isCombineEnabled={false}
                    >
                      {dropProvided => (
                        <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                          <Draggable
                            draggableId={this.state.searchedPlace.attraction_id.toString() + "bar"}
                            index={this.state.searchedPlace.attraction_id}
                          >
                            {dragProvided => (
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
                  </React.Fragment>
                );
            })()}
            {(() => {
              if (this.state.nearbyPlaces !== [])
                return (
                  <React.Fragment>
                    {this.state.nearbyPlaces
                      .filter(place =>
                        place.types.find(
                          type => type === "point_of_interest" || type === "tourist_attraction"
                        )
                      )
                      .splice(0, 10)
                      .map(dat => (
                        <Droppable
                          key={dat.place_id}
                          droppableId={dat.place_id + "bar"}
                          isDropDisabled={true}
                          type={String}
                          direction="vertical"
                          isCombineEnabled={false}
                        >
                          {dropProvided => (
                            <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                              <Draggable draggableId={dat.place_id + "bar"} index={0}>
                                {dragProvided => (
                                  <div
                                    {...dragProvided.dragHandleProps}
                                    {...dragProvided.draggableProps}
                                    ref={dragProvided.innerRef}
                                  >
                                    <AttBarCard
                                      attraction_name={dat.name}
                                      attraction_type={dat.types[0]}
                                      photos={dat.photos}
                                    />
                                  </div>
                                )}
                              </Draggable>

                              {dropProvided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      ))}
                  </React.Fragment>
                );
            })()}
            {this.props.data.slice(0, 10).map(dat => (
              <Droppable
                key={dat.google_place_id}
                droppableId={dat.google_place_id + "bar"}
                isDropDisabled={true}
                type={String}
                direction="vertical"
                isCombineEnabled={false}
              >
                {dropProvided => (
                  <div {...dropProvided.droppableProps} ref={dropProvided.innerRef}>
                    <Draggable
                      draggableId={dat.attraction_id.toString() + "bar"}
                      index={dat.attraction_id}
                    >
                      {dragProvided => (
                        <div
                          {...dragProvided.dragHandleProps}
                          {...dragProvided.draggableProps}
                          ref={dragProvided.innerRef}
                        >
                          <AttBarCard {...dat} />
                        </div>
                      )}
                    </Draggable>

                    {dropProvided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default AttBar;
