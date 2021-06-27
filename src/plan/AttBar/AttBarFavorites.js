import "../../scss/AttBar.scss";
import AttBarCard from "./AttBarCard.js";
import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

class AttBarFavorites extends Component {

  async componentDidMount() {
    await this.props.setFavoritePlaces()
    console.log(this.props);
  }

  render() {
    return (
      <>
        {this.props.favoritePlaces
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
