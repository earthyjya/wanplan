import "../../scss/AttBar.scss";
import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AttBarNearby from "./AttBarNearby";
import AttBarFavorites from "./AttBarFavorites";

class AttBar extends Component {
  state = {
    attBarTab: "nearby",
    detailsDat: "",  
  };

  async componentDidMount() {
    this.attbarRef = React.createRef();
	}
  
  componentDidUpdate(prevProps) {
    if (prevProps.nearbyCenter !== this.props.nearbyCenter) {
      this.showDetails(this.props.nearbyCenter);
		}
	}
  
  onClickAttBarCard = (dat) => {
    this.setState({ detailsDat: dat });
    this.props.showDetails(dat);
    this.attbarRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }

  changeTabTo(tabName) {
    this.setState({ attBarTab: tabName })
    // clear attbar details after changing tab
    this.setState({ detailsDat: "" });
  }

  renderAttBarDesc() {
    let { detailsDat } = this.state;
    return detailsDat !== "" && (
      <div className="att-bar-desc">
        <Droppable
          droppableId = {
            detailsDat.google_place_id !== undefined ?
              detailsDat.google_place_id + "Bar" :  
              detailsDat.place_id + "Bar"
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
                  detailsDat.attraction_id !== undefined ? 
                    detailsDat.attraction_id + "Bar" : 
                    detailsDat.place_id + "Bar"
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
                          <FontAwesomeIcon icon="clock" />  {" operating hours"}
                        </span>
                        <span>
                          <FontAwesomeIcon icon="money-bill-wave" /> {" entrance fee"}
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
        <p> Attraction details </p>
        <button
          onClick={this.props.toggleAttModal}
          className="details-button"
        >
          more details
        </button>
        <hr />
      </div>
    );
  }

  renderAttBarTab() {
    return (
    <div className="att-bar-tab-container">
      <button 
        className={this.state.attBarTab === "nearby" ? "activated" : ""} 
        onClick={() => this.changeTabTo("nearby")}
      > 
        Nearby 
      </button>
      <button 
        className={this.state.attBarTab === "favorites" ? "activated" : ""} 
        onClick={() => this.changeTabTo("favorites")}
      > 
        Favorites 
      </button>
    </div>
    );
  }

	render() {
		return (
			<div ref={this.attbarRef} className="att-bar-wrap">
        { this.renderAttBarTab() }
				{ this.renderAttBarDesc() } 
        {
          !this.props.nearbyLoaded ? (
            <div className="AttBar">Loading...</div>
          ) : this.state.error ? (
            <div className="AttBar">{this.state.error.message}</div>
          ) : this.state.attBarTab === "nearby" ? (
            <AttBarNearby
              searchedPlace = {this.props.searchedPlace}
              nearbyPlaces = {this.props.nearbyPlaces}
              setFavoritePlaces = {this.props.setFavoritePlaces}
              setSearchedPlace = {this.props.setSearchedPlace}
              attbarRef = {this.attbarRef}
              onClickAttBarCard={this.onClickAttBarCard}
            />
          ) : this.state.attBarTab === "favorites" ? (
            <AttBarFavorites 
              favoritePlaces={this.props.favoritePlaces} 
              setFavoritePlaces={this.props.setFavoritePlaces} 
              onClickAttBarCard={this.onClickAttBarCard}
            />
          ) : <></>
        }
			</div>
		);
	}
}

export default AttBar;
