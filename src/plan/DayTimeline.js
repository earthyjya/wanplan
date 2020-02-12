import React, { Component } from "react";
import AttCard from "./AttCard";
import { Droppable, Draggable } from "react-beautiful-dnd";

class DayTimeline extends Component {
  addDay = () => {
    this.props.addDay(this.props.day);
  };

  delDay = () => {
    this.props.delDay(this.props.day);
  };

  render() {
    const { trip_detail, day, attraction } = this.props;
    return (
      <div className="DayTimeline">
        <div>
          <button className="AddDay" onClick={this.addDay}>
            +
          </button>
          <hr style={{ margin: "0px 30px 30px 30px" }} />
        </div>

        <div>
          <button className="DelDay" onClick={this.delDay}>
            &#10005;
          </button>
          <h2>Day {day}</h2>
        </div>

        <Droppable
          droppableId={day.toString()}
          type={String}
          direction="vertical"
          isCombineEnabled={false}
          style={{ overflow: "scroll" }}
        >
          {dropProvided => (
            <div {...dropProvided.droppableProps}>
              <div ref={dropProvided.innerRef}>
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
                                  attract.attraction_id === detail.attraction_id
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
          )}
        </Droppable>
      </div>
    );
  }
}

export default DayTimeline;
