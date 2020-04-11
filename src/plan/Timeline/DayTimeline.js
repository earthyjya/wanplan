import AttCard from "./AttCard";
import React, { Component } from "react";
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
    const { plan_detail, day, editing } = this.props;
    let start = "";
    let destination = "";
    if (editing)
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
                <div ref={dropProvided.innerRef}>
                  {(() => {
                    if (plan_detail) {
                      destination = plan_detail[0];
                      //
                      return (
                        <TransCard start={{ attraction_name: "Hotel" }} destination={destination} />
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
                            <AttCard
                              {...detail}
                              changeOrder={this.props.changeOrder}
                              changeDuration={this.props.changeDuration}
                              updateDescription={this.props.updateDescription}
                              delCard={this.props.delCard}
                              editing={this.props.editing}
                            />
                          </div>
                        )}
                      </Draggable>
                      {(() => {
                        start = detail;
                        destination = (() => {
                          if (detail !== plan_detail[plan_detail.length - 1]) {
                            return plan_detail.filter(
                              det => det.attraction_order === detail.attraction_order + 1
                            )[0];
                          } else {
                            return { attraction_name: "Hotel" };
                          }
                        })();
                      })()}
                      <TransCard start={start} destination={destination} />
                    </div>
                  ))}
                  {dropProvided.placeholder}
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
    else
      return (
        <div className="DayTimeline">
          <div>
            <div className="Block"></div>
            <h2>Day {day}</h2>
          </div>
          {(() => {
            if (plan_detail.length) {
              destination = plan_detail[0];
              return <TransCard start={{ attraction_name: "Hotel" }} destination={destination} />;
            }
          })()}
          {plan_detail.map(detail => (
            <div key={detail.attraction_order.toString()}>
              <AttCard
                {...detail}
                changeOrder={this.props.changeOrder}
                changeDuration={this.props.changeDuration}
                delCard={this.props.delCard}
                editing={this.props.editing}
              />
              {(() => {
                start = detail;
                destination = (() => {
                  if (detail !== plan_detail[plan_detail.length - 1]) {
                    return plan_detail.filter(
                      det => det.attraction_order === detail.attraction_order + 1
                    )[0];
                  } else {
                    return { attraction_name: "Hotel" };
                  }
                })();
              })()}
              <TransCard start={start} destination={destination} />
            </div>
          ))}

          <hr style={{ margin: "0px 30px 30px 30px" }} />
        </div>
      );
  }
}

export default DayTimeline;
