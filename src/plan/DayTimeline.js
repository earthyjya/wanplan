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
    const { plan_detail, day, attraction } = this.props;
    let start = "Hotel";
    let destination = " ";
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
                      if (plan_detail.length) {
                        let des = attraction.filter(
                          attract =>
                            attract.attraction_id ===
                            plan_detail[0].attraction_id
                        );
                        if (des.length) destination = des[0].attraction_name;
                        else destination = "Loading...";
                        return (
                          <TransCard start={start} destination={destination} />
                        );
                      }
                    })()}
                    {plan_detail.map(detail => (
                      <div key={detail.attraction_order.toString()}>
                        <Draggable
                          draggableId={detail.attraction_order.toString()}
                          index={detail.attraction_order}
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
                                  delCard={this.props.delCard}
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
                          let st = attraction.filter(
                            attract =>
                              attract.attraction_id === detail.attraction_id
                          );
                          if (st.length) start = st[0].attraction_name;
                          else start = "Loading..."
                          destination = (() => {
                            if (
                              detail !== plan_detail[plan_detail.length - 1]
                            ) {
                              let att = attraction.filter(
                                attract =>
                                  attract.attraction_id ===
                                  plan_detail.filter(
                                    det =>
                                      Number(det.attraction_order) ===
                                      Number(detail.attraction_order) + 1
                                  )[0].attraction_id
                              );
                              if (att.length === 0) return "Loading...";
                              return att[0].attraction_name;
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
