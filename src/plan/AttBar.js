import React, { Component } from "react";
import "./AttBar.css";
import AttBarCard from "./AttBarCard.js";
import { Droppable, Draggable } from "react-beautiful-dnd";

class AttBar extends Component {
  render() {
    return (
      
      <div >

        <div class="search">
          <input class="search-text" type="text" placeholder="search" />
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
                <div>
                  <div>
                    <div ref={dropProvided.innerRef}>
                      <div className="AttBar">
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
                                  <AttBarCard
                                    {...dat}
                                    key={dat.attraction_id.toString()}
                                  />
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
