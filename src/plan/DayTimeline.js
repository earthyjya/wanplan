import React, { Component } from "react";
import AttCard from "./AttCard";
import TransCard from "./TransCard";
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
    let start = "Hotel";
    let destination = "Sensoji Temple";
    return (
      <div className="DayTimeline">
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
                    {(() => {
                      if (trip_detail.length) {
                        destination = attraction.filter(
                          attract =>
                            attract.attraction_id ===
                            trip_detail[0].attraction_id
                        )[0].attraction_name;
                        return (
                          <TransCard start={start} destination={destination} />
                        );
                      }
                    })()}
                    {trip_detail.map(detail => (
                      <div key={detail.order.toString()}>
                        <Draggable
                          
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
                            </div>
                          )}
                        </Draggable>
                        {(() => {
                          start =
                            " " +
                            attraction.filter(
                              attract =>
                                attract.attraction_id === detail.attraction_id
                            )[0].attraction_name;
                          destination = (() => {
                            if (detail !== trip_detail[trip_detail.length - 1]) {
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
                          })();
                        })()}
                        <TransCard start={start} destination={destination} />
                      </div>
                    ))}
                    {dropProvided.placeholder}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Droppable>
        <div>
          <button className="AddDay" onClick={this.addDay}>
            +
          </button>
          <hr style={{ margin: "0px 30px 30px 30px" }} />
        </div>
      </div>
    );
  }
}

export default DayTimeline;
