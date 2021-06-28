import "../../scss/AttBar.scss";
import AttBarCard from "./AttBarCard.js";
import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

class AttBarFavorites extends Component {

  state = {
    favoritePlaces: [],
  }

  async componentDidMount() {
    await this.props.setFavoritePlaces()
    this.setState({favoritePlaces: this.props.favoritePlaces});
  }

  // when an attbarcard is removed from favorited, delete it from attbarfavorite
  onUnFavorite = (google_place_id) => {
    let favoritePlaces = this.state.favoritePlaces;
    favoritePlaces = favoritePlaces.filter(place => place.google_place_id !== google_place_id)
    this.setState({favoritePlaces: favoritePlaces});
  }

  render() {
    return (
      <>
        {this.state.favoritePlaces
          .filter(place => place !== null)
          .map((place, idx) => {
            console.log(place);
            return (
              <div
                key={place.google_place_id.toString()}
                onClick={() => this.props.onClickAttBarCard(place)}
              >
                <Droppable
                  index={idx}
                  droppableId={place.google_place_id + "bar"}
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
                        draggableId={place.google_place_id + "bar"}
                        index={idx}
                        key={place.google_place_id.toString()}
                      >
                        {(dragProvided) => (
                          <div
                            {...dragProvided.dragHandleProps}
                            {...dragProvided.draggableProps}
                            ref={dragProvided.innerRef}
                          >
                            <AttBarCard
                              attraction_name={place.attraction_name}
                              attraction_type={place.type}
                              google_place_id={place.google_place_id}
                              photos={place.photos}
                              key={place.google_place_id.toString()}
                              onUnFavorite={this.onUnFavorite}
                            />
                          </div>
                        )}
                      </Draggable>
                      {dropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )
          })}
      </>
    );
  }
}

export default AttBarFavorites;
