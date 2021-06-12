import "../../scss/AttBar.scss";
import AttBarCard from "./AttBarCard.js";
import Autocomplete from "react-google-autocomplete";
import axios from "axios";
import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Redirect, useHistory, useParams } from "react-router";

function withCountryAndHistory(Component) {
  return function WrappedComponent(props) {
    let { country } = useParams();
    let history = useHistory();
    return <Component {...props} country={country} history={history} />;
  }
}

class AttBar extends Component {
  state = {
    nearbyPlaces: [],
    detailsDat: "",
    isLoading: true,
    error: null,
  };

	onPlaceSelected = async (place) => {
		await this.props.setSearchedPlace(place);
		this.attbarRef.current.scrollTo({ top: 0, behavior: "smooth" });
	};

	selectNearbyOption = (e) => {
		this.props.setNearbyOption(e.target.value);
	};

  selectCountryOption = (e) => {
    this.props.history.push(`./${e.target.value}`);
    this.props.history.go(0)
  };

  showDetails(dat) {
    this.setState({ detailsDat: dat });

    this.props.showDetails(dat);
    this.attbarRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

	componentDidUpdate(prevProps) {
		if (prevProps.nearbyCenter !== this.props.nearbyCenter) {
			this.showDetails(this.props.nearbyCenter);
		}
	}

	async componentDidMount() {
		this.attbarRef = React.createRef();
    if(this.props.country !== "th" && this.props.country !== "jp"){
      this.props.history.replace('/');
    }
	}

	render() {
		let { detailsDat } = this.state;
		return (
			<div ref={this.attbarRef} className="att-bar-wrap">
				{detailsDat !== "" ? (
					<div className="att-bar-desc">
						<Droppable
							droppableId={
								detailsDat.google_place_id !== undefined
									? detailsDat.google_place_id + "Bar"
									: detailsDat.place_id + "Bar"
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
											detailsDat.attraction_id !== undefined
												? detailsDat.attraction_id + "Bar"
												: detailsDat.place_id + "Bar"
										}
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
													<span
														className="att-bar-delete"
														onClick={() => this.setState({ detailsDat: "" })}
													>
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
              Attraction details
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
            
            placeholder={this.searchPlaceholder}
            onFocus={() => {
              this.placeholder = "";
            }}
            onBlur={() => {
              this.placeholder = "enter your text";
            }}
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

        {!this.props.nearbyLoaded ? (
          <div className="AttBar">Loading...</div>
        ) : this.state.error ? (
          <div className="AttBar">{this.state.error.message}</div>
        ) : (
          <div className="AttBar">
            {(() => {
              if (this.props.searchedPlace.google_place_id)
                return (
                  <div
                    onClick={() => this.showDetails(this.props.searchedPlace)}
                  >
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
                        <div key={place.place_id.toString()}
                            onClick={() => this.showDetails(place)}
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
					</div>
				)}
			</div>
		);
	}
}

export default withCountryAndHistory(AttBar);
