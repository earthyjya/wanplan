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
              <div>
                <div>
                  <div ref={dropProvided.innerRef}>
                    <div>
                      <div>transport</div>
                      <div className="transport">
                        From Hotel to{" "}
                        {(() => {
                          if (trip_detail.length) {
                            return attraction.filter(
                              attract =>
                                attract.attraction_id ===
                                trip_detail[0].attraction_id
                            )[0].attraction_name;
                          } else return "Nowhere";
                        })()}
                      </div>
                    </div>
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
                                changeDuration={this.props.changeDuration}
                                attraction={
                                  attraction.filter(
                                    attract =>
                                      attract.attraction_id ===
                                      detail.attraction_id
                                  )[0]
                                }
                              />
                            </div>
                            <div>
                              <div>transport</div>
                              <div className="transport">
                                from
                                {" " +
                                  attraction.filter(
                                    attract =>
                                      attract.attraction_id ===
                                      detail.attraction_id
                                  )[0].attraction_name +
                                  " to "}
                                {(() => {
                                  if (
                                    detail !==
                                    trip_detail[trip_detail.length - 1]
                                  ) {
                                    return attraction.filter(
                                      attract =>
                                        attract.attraction_id ===
                                        trip_detail.filter(
                                          det =>
                                            Number(det.order) ===
                                            Number(detail.order) + 1
                                        )[0].attraction_id
                                    )[0].attraction_name;
                                  } else {
                                    return "Hotel";
                                  }
                                })()}
                              </div>
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

export default DayTimeline;
