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
    let idx = day - 1;
    if (editing)
      return (
        <React.Fragment>

          <div style={{display:'flex', flexDirection:'row'}}>
            <button className="DelDay" onClick={this.delDay}>
              &#10005;
            </button>
            <h2>Day {day}</h2>
            <p>xx places | estimated time: xx | budget: xxxx JPY</p>
          </div>
          <div className='VerticaLline'>
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
                    {plan_detail.map(detail => (
                      <div key={detail.attraction_order}>
                        {(() => {
                          start = (() => {
                            if (detail !== plan_detail[0]) {
                              return plan_detail.filter(
                                det => det.attraction_order === detail.attraction_order - 1
                              )[0];
                            } else {
                              return { attraction_name: "Hotel" };
                            }
                          })();
                          destination = detail;
                        })()}
                        {(() => { //Transport
                            return(
                              <TransCard
                                start={start}
                                destination={destination}
                                transport={
                                  this.props.transports[idx][
                                    detail.attraction_order - plan_detail[0].attraction_order
                                ]}
                              />);
                        })()}
                        <Draggable
                          draggableId={detail.attraction_order.toString()}
                          index={detail.attraction_order}
                        >
                          {dragProvided => (
                            <div
                              {...dragProvided.dragHandleProps}
                              {...dragProvided.draggableProps}
                              ref={dragProvided.innerRef}
                              tabIndex="-1"
                            >
                              <AttCard
                                {...detail}
                                changeDuration={this.props.changeDuration}
                                updateDescription={this.props.updateDescription}
                                delCard={this.props.delCard}
                                editing={this.props.editing}
                              />
                            </div>
                          )}
                        </Draggable>
                      </div>
                    ))}
                    {(() => {
                      if (plan_detail) {
                        return (
                          <TransCard
                            start={plan_detail[plan_detail.length - 1]}
                            destination={{ attraction_name: "Hotel" }}
                            transport={{ text: "No transportation data" }}
                          />
                        );
                      }
                    })()}
                    {dropProvided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          </div>

        </React.Fragment>
      );
    else
      return(

        <div className="DayTimeline">
          <div>
            <div className="Block"></div>
            <h2>Day {day}</h2>
          </div>
          <div className='VerticaLline'>
          {plan_detail.map(detail => (
            <div key={detail.attraction_order}>
              {(() => {
                start = (() => {
                  if (detail !== plan_detail[0]) {
                    return plan_detail.filter(
                      det => det.attraction_order === detail.attraction_order - 1
                    )[0];
                  } else {
                    return { attraction_name: "Hotel" };
                  }
                })();
                destination = detail;
              })()}
              <TransCard
                start={start}
                destination={destination}
                transport={
                  this.props.transports[idx][
                    detail.attraction_order - plan_detail[0].attraction_order
                  ]
                }
              />
              <AttCard
                {...detail}
                changeDuration={this.props.changeDuration}
                delCard={this.props.delCard}
                editing={this.props.editing}
              />
            </div>
          ))}
          {(() => {
            if (plan_detail.length) {
              return (
                <TransCard
                  start={plan_detail[plan_detail.length - 1]}
                  destination={{ attraction_name: "Hotel" }}
                  transport={{ text: "No transportation data" }}
                />
              );
            }
          })()}

          <hr style={{ margin: "0px 30px 30px 30px" }} />
        </div>
        </div>
      )
  }
}

export default DayTimeline;
