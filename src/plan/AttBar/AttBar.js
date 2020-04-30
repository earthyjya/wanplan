import "../../scss/AttBar.scss";
import AttBarCard from "./AttBarCard.js";
import Autocomplete from "react-google-autocomplete";
import axios from "axios";
import React, { Component } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

class AttBar extends Component {
  state = {
    searchedPlace: {}
  };

  onPlaceSelected = async place => {
    await this.setState({ searchedPlace: {} });
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/attraction/google_id/" + place.place_id;
    // console.log(url);
    await axios
      .get(url)
      .then(res => {
        this.setState({ searchedPlace: res.data[0] });
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
