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
    const { plan_detail, day, editing, isLoading } = this.props;
    let start = "";
    let destination = "";
    let idx = day - 1;
    if (isLoading) return <div>Loading...</div>;
    if (editing)
      return (
        <React.Fragment>
          <div>
            <div className="DayTitleCont">
              <button className="DelDay" onClick={this.delDay}>
                &#10005;
              </button>
              <div className="DayTitle"> Day {day}</div>
              <div className="DayInfo">
                xx places | estimated time: xx | budget: xxxx JPY
              </div>
            </div>
            <div className="DayTimelineContentContainer">
              <div className="TimeVerticalLineContainer" />
              <div className="AttCardTransCardContainer">
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
                        {plan_detail.map(detail => {
                          // console.log(this.props.transports)
                          return (<div key={detail.attraction_order}>
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
                            {(() => {
                              //Transport
                              return (
                                <TransCard
                                  start={start}
                                  destination={destination}
                                  transport={ (this.props.transports[idx])?
                                    this.props.transports[idx][
                                      detail.attraction_order - plan_detail[0].attraction_order
                                    ] : null
                                  }
                                />
                              );
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
                                    detail={detail}
                                    changeDuration={this.props.changeDuration}
                                    updateTitle={this.props.updateTitle}
                                    updateDescription={this.props.updateDescription}
                                    delCard={this.props.delCard}
                                    editing={this.props.editing}
                                    toggleAttModal={this.props.toggleAttModal}
                                    showDetails={this.props.showDetails}
                                  />
                                </div>
                              )}
                            </Draggable>
                            <div>
                              <button onClick={() =>{
                                    console.log(`add free time at ${detail.attraction_order + 1} on day ${this.props.day}` )
                                    this.props.addFreeTime(detail.attraction_order  + 1, this.props.day)
                              }}>
                                add free time/ lunch time
                              </button>
                            </div>
                          </div>
                        )})}
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
            </div>
          </div>
          <div>
            <button className="AddDay" onClick={this.addDay}>
              +
            </button>
            <hr style={{ margin: "0px 50px 50px 50px" }} />
          </div>
        </React.Fragment>
      );
      return (
        <div className="DayTimeline">
          <div>
            <div className="Block"></div>
            <h2>Day {day}</h2>
          </div>
          <div className="DayTimelineContentContainer">
            <div className="TimeVerticalLineContainer" />
            <div className="AttCardTransCardContainer">
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
                    transport={ (this.props.transports[idx])?
                      this.props.transports[idx][
                        detail.attraction_order - plan_detail[0].attraction_order
                      ] : null
                    }
                  />
                  <AttCard
                    detail={detail}
                    changeDuration={this.props.changeDuration}
                    delCard={this.props.delCard}
                    editing={this.props.editing}
                    showDetails={this.props.showDetails}
                    toggleAttModal={this.props.toggleAttModal}
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
            </div>
            <hr style={{ margin: "0px 30px 30px 30px" }} />
          </div>
        </div>
      );
  }
}

export default DayTimeline;
