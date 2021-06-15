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

  changeHour = (e) => {
    this.props.updateStartdayTime(
      this.props.day,
      e.target.value +
        this.props.plan_startday[this.props.day - 1].start_day.slice(2, 5)
    );
  };

  changeMinute = (e) => {
    this.props.updateStartdayTime(
      this.props.day,
      this.props.plan_startday[this.props.day - 1].start_day.slice(0, 3) +
        e.target.value
    );
  };

  render() {
    const { plan_detail, day, editing, detailLoaded } = this.props;
    let hours = [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
    ];
    let minutes = ["00", "10", "20", "30", "40", "50"];
    let start = "";
    let destination = "";
    let idx = day - 1;
    if (editing)
      return (
        <React.Fragment>
          <div>
            <div className="DayTitleCont">
              <button className="DelDay" onClick={this.delDay}>
                &#10005;
              </button>
              <div className="DayTitle"> Day {day}</div>
              {(() => {
                if (!detailLoaded) return <div>Loading...</div>;
                else
                  return (
                    <div className="DayInfo">
                      xx places | estimated time: xx | budget: xxxx JPY
                    </div>
                  );
              })()}
              <br />
              <span>
                <select
                  className="select-startday-hour"
                  value={this.props.plan_startday[day - 1].start_day.slice(
                    0,
                    2
                  )}
                  onChange={this.changeHour}
                >
                  {hours.map((hour) => {
                    return (
                      <option value={hour} key={hour}>
                        {hour}
                      </option>
                    );
                  })}
                </select>
                :
                <select
                  className="select-startday-minute"
                  value={this.props.plan_startday[day - 1].start_day.slice(
                    3,
                    5
                  )}
                  onChange={this.changeMinute}
                >
                  {minutes.map((minute) => {
                    return (
                      <option value={minute} key={minute}>
                        {minute}
                      </option>
                    );
                  })}
                </select>
              </span>
            </div>
            {(() => {
              if (!detailLoaded) return <div> Loading...</div>;
              else
                return (
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
                        {(dropProvided) => (
                          <div {...dropProvided.droppableProps}>
                            <div ref={dropProvided.innerRef}>
                              {plan_detail.map((detail) => {
                                // console.log(this.props.transports)
                                return (
                                  <div key={detail.attraction_order}>
                                    {(() => {
                                      start = (() => {
                                        if (detail !== plan_detail[0]) {
                                          return plan_detail.filter(
                                            (det) =>
                                              det.attraction_order ===
                                              detail.attraction_order - 1
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
                                          day={day}
                                          order={
                                            detail.attraction_order -
                                            plan_detail[0].attraction_order
                                          }
                                          start={start}
                                          destination={destination}
                                          transport={
                                            this.props.transports[idx]
                                              ? this.props.transports[idx][
                                                  detail.attraction_order -
                                                    plan_detail[0]
                                                      .attraction_order
                                                ]
                                              : null
                                          }
                                          transLoaded={this.props.transLoaded}
                                          editing={editing}
                                          changeTransportMode={
                                            this.props.changeTransportMode
                                          }
                                          changeTransportText={
                                            this.props.changeTransportText
                                          }
                                        />
                                      );
                                    })()}
                                    <Draggable
                                      draggableId={detail.attraction_order.toString()}
                                      index={detail.attraction_order}
                                    >
                                      {(dragProvided) => (
                                        <div
                                          {...dragProvided.dragHandleProps}
                                          {...dragProvided.draggableProps}
                                          ref={dragProvided.innerRef}
                                          tabIndex="-1"
                                        >
                                          <AttCard
                                            key={detail.description}
                                            detail={detail}
                                            changeDuration={
                                              this.props.changeDuration
                                            }
                                            updateTitle={this.props.updateTitle}
                                            updateDescription={
                                              this.props.updateDescription
                                            }
                                            delCard={this.props.delCard}
                                            editing={this.props.editing}
                                            toggleAttModal={
                                              this.props.toggleAttModal
                                            }
                                            showDetails={this.props.showDetails}
                                            updateNearby={
                                              this.props.updateNearby
                                            }
                                          />
                                        </div>
                                      )}
                                    </Draggable>
                                    <div>
                                      <button
                                        onClick={() => {
                                          console.log(
                                            `add free time at ${
                                              detail.attraction_order + 1
                                            } on day ${this.props.day}`
                                          );
                                          this.props.addFreeTime(
                                            detail.attraction_order + 1,
                                            this.props.day
                                          );
                                        }}
                                      >
                                        add free time/ lunch time
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                              {(() => {
                                if (plan_detail) {
                                  return (
                                    <TransCard
                                      day={day}
                                      order={plan_detail.length}
                                      start={
                                        plan_detail[plan_detail.length - 1]
                                      }
                                      destination={{ attraction_name: "Hotel" }}
                                      transport={{
                                        text: "No transportation data",
                                      }}
                                      transLoaded={this.props.transLoaded}
                                      editing={editing}
                                      changeTransportMode={
                                        this.props.changeTransportMode
                                      }
                                      changeTransportText={
                                        this.props.changeTransportText
                                      }
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
                );
            })()}
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
        {(() => {
          if (!detailLoaded) return <div>Loading...</div>;
          else
            return (
              <div className="DayTimelineContentContainer">
                <div className="TimeVerticalLineContainer" />
                <div className="AttCardTransCardContainer">
                  {plan_detail.map((detail) => (
                    <div key={detail.attraction_order}>
                      {(() => {
                        start = (() => {
                          if (detail !== plan_detail[0]) {
                            return plan_detail.filter(
                              (det) =>
                                det.attraction_order ===
                                detail.attraction_order - 1
                            )[0];
                          } else {
                            return { attraction_name: "Hotel" };
                          }
                        })();
                        destination = detail;
                      })()}
                      <TransCard
                        day={day}
                        order={
                          detail.attraction_order -
                          plan_detail[0].attraction_order
                        }
                        start={start}
                        destination={destination}
                        transport={
                          this.props.transports[idx]
                            ? this.props.transports[idx][
                                detail.attraction_order -
                                  plan_detail[0].attraction_order
                              ]
                            : null
                        }
                        transLoaded={this.props.transLoaded}
                        editing={editing}
                        changeTransportMode={this.props.changeTransportMode}
                        changeTransportText={this.props.changeTransportText}
                      />
                      <AttCard
                        key={detail.description}
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
                          day={day}
                          order={plan_detail.length}
                          start={plan_detail[plan_detail.length - 1]}
                          destination={{ attraction_name: "Hotel" }}
                          transport={{ text: "No transportation data" }}
                          transLoaded={this.props.transLoaded}
                          editing={editing}
                          changeTransportMode={this.props.changeTransportMode}
                          changeTransportText={this.props.changeTransportText}
                        />
                      );
                    }
                  })()}
                </div>
                <hr style={{ margin: "0px 30px 30px 30px" }} />
              </div>
            );
        })()}
      </div>
    );
  }
}

export default DayTimeline;
