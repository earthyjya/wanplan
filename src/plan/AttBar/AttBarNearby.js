import "../../scss/AttBar.scss";
import AttBarCard from "./AttBarCard.js";
import Autocomplete from "react-google-autocomplete";
import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Redirect, useHistory, useParams } from "react-router";

function withCountryAndHistory(Component) {
  return function WrappedComponent(props) {
    let { country } = useParams();
    let history = useHistory();
    return <Component {...props} country={country} history={history} />;
  };
}

class AttBarNearby extends Component {
  state = {
    nearbyPlaces: [],
    detailsDat: "",
    isLoading: true,
    error: null,
  };

	componentDidMount() {
    if(this.props.country !== "th" && this.props.country !== "jp"){
      this.props.history.replace('/');
    }
	}

  onPlaceSelected = async (place) => {
    await this.props.setSearchedPlace(place);
    this.props.attbarRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  selectNearbyOption = (e) => {
    this.props.setNearbyOption(e.target.value);
  }

  selectCountryOption = (e) => {
    this.props.history.push(`./${e.target.value}`);
    this.props.history.go(0);
  }

  render() {
    return (
      <div className="att-bar-nearby">
        <div className="search-container">
          <Autocomplete
            className="search-bar"
            onPlaceSelected={this.onPlaceSelected}
            placeholder="&#xF002; Enter a location "
            options={{
              types: ["geocode", "establishment"],
              componentRestrictions: { country: this.props.country },
            }}
          />
          <select
            className="nearby-option"
            onChange={this.selectCountryOption}
            value={this.props.country}
          >
            <option value="th">TH</option>
            <option value="jp">JP</option>
          </select>
          <select
            className="nearby-option"
            value={this.props.nearbyOption}
            onChange={this.selectNearbyOption}
          >
            <option value="tourist_attraction">Tourist Attraction</option>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
            <option value="lodging">Hotel</option>
          </select>
        </div>
        <>
          {(() => {
            if (this.props.searchedPlace.google_place_id)
              return (
                <div onClick={() => this.props.onClickAttBarCard(this.props.searchedPlace)}>
                  <Droppable
                    droppableId={
                      this.props.searchedPlace.google_place_id + "bar"
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
                            this.props.searchedPlace.attraction_id.toString() +
                            "bar"
                          }
                          index={this.props.searchedPlace.attraction_id}
                        >
                          {(dragProvided) => (
                            <div
                              {...dragProvided.dragHandleProps}
                              {...dragProvided.draggableProps}
                              ref={dragProvided.innerRef}
                            >
                              <AttBarCard {...this.props.searchedPlace} />
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
                    .map((place, idx) => (
                      <div
                        key={place.place_id.toString()}
                        onClick={() => this.props.onClickAttBarCard(place)}
                      >
                        <Droppable
                          index={idx}
                          droppableId={place.place_id + "bar"}
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
                                draggableId={place.place_id + "bar"}
                                index={idx}
                                key={place.place_id.toString()}
                              >
                                {(dragProvided) => (
                                  <div
                                    {...dragProvided.dragHandleProps}
                                    {...dragProvided.draggableProps}
                                    ref={dragProvided.innerRef}
                                  >
                                    <AttBarCard
                                      attraction_name={place.name}
                                      attraction_type={place.types[0]}
                                      google_place_id={place.place_id}
                                      photos={place.photos}
                                      key={place.place_id.toString()}
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
        </>
      </div>
    );
  }
}

export default withCountryAndHistory(AttBarNearby);
