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
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/attraction/google_id/" + place.place_id;
    console.log(url);
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
            types={["geocode"]}
            componentRestrictions={{ country: "jp" }}
          />
        </div>

        {this.props.isLoading ? (
          <div>Loading...</div>
        ) : this.props.error ? (
          <div>{this.props.error.message}</div>
        ) : (
          <Droppable
            droppableId={"bar"}
            isDropDisabled={true}
            type={String}
            direction="vertical"
            isCombineEnabled={false}
          >
            {dropProvided => (
              <div {...dropProvided.droppableProps}>
                <div ref={dropProvided.innerRef}>
                  <div className="AttBar">
                    {(() => {
                      if (this.state.searchedPlace.google_place_id)
                        return (
                          <Draggable
                            key={this.state.searchedPlace.attraction_id.toString() + "bar"}
                            draggableId={this.state.searchedPlace.attraction_id.toString() + "bar"}
                            index={this.state.searchedPlace.attraction_id}
                          >
                            {dragProvided => (
                              <div
                                {...dragProvided.dragHandleProps}
                                {...dragProvided.draggableProps}
                                ref={dragProvided.innerRef}
                              >
                                <div>
                                  <AttBarCard
                                    {...this.state.searchedPlace}
                                    key={this.state.searchedPlace.attraction_id.toString()}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                    })()}

                    {this.props.data.map(dat => (
                      <Draggable
                        key={dat.attraction_id.toString() + "bar"}
                        draggableId={dat.attraction_id.toString() + "bar"}
                        index={dat.attraction_id}
                      >
                        {dragProvided => (
                          <div
                            {...dragProvided.dragHandleProps}
                            {...dragProvided.draggableProps}
                            ref={dragProvided.innerRef}
                          >
                            <div>
                              <AttBarCard {...dat} key={dat.attraction_id.toString()} />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    <span
                      style={{
                        display: "none"
                      }}
                    >
                      {dropProvided.placeholder}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        )}
      </div>
    );
  }
}

export default AttBar;
