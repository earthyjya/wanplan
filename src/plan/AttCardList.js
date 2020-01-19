import React, { Component } from "react";
import AttCard from "./AttCard";
import { Droppable, Draggable } from "react-beautiful-dnd";

class AttCardList extends Component {
  render() {
    const { isLoading, error, trip_detail, day, attraction } = this.props;
    if (isLoading) return <div className="AttList">Loading...</div>;
    if (error) return <div className="AttList">Something went wrong :(</div>;
    return (
      <div className="AttList">
        <Droppable
          droppableId={day.toString()}
          type={String}
          direction="vertical"
          isCombineEnabled={false}
          style = {{overflow : "scroll"}}
        >
          {dropProvided => (
            <div {...dropProvided.droppableProps}>
              <div>
                <div>
                  <div  ref={dropProvided.innerRef}>
                    {trip_detail.map(detail => (
                      <Draggable
                        key={detail.order.toString()}
                        draggableId={detail.order.toString()}
                        index={detail.order}
                      >
                        {dragProvided => (
                          <div
                            {...dragProvided.dragHandleProps}
                            {...dragProvided.draggableProps}
                            ref={dragProvided.innerRef}
                          >
                            <div>
                              <AttCard
                                {...detail}
                                key={detail.order.toString()}
                                changeOrder={this.props.changeOrder}
                                attraction={
                                  attraction.filter(
                                    attract =>
                                      attract.attraction_id ===
                                      detail.attraction_id
                                  )[0]
                                }
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {dropProvided.placeholder}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

export default AttCardList;
