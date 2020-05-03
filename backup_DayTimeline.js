return(
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
  <div>
    <button className="AddDay" onClick={this.addDay}>
      +
    </button>
    <hr style={{ margin: "0px 50px 50px 50px" }} />
  </div>
</div>
);

return (
  <div className="DayTimeline">
    <div>
      <div className="Block"></div>
      <h2>Day {day}</h2>
    </div>
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

    <hr style={{ margin: "0px 50px 50px 50px" }} />
  </div>
);


//Attcard
{(() => {
  if (editing)
    return (
      <div className="DelCard" onClick={this.delCard}>
        &#10005;
      </div>
    );///
})()}
<div className="EndTime">{end_time}</div>

{(() => {
  if (editing)
    return (
      <React.Fragment>
        <textarea
          className="AttDesCont"
          value={this.state.description}
          onChange={this.onChange}
          onBlur={this.updateDescription}
          type="textarea"
        />
        <select className="SelAttDura" value={time_spend} onChange={this.changeDuration}>
          {minutes.map(min => {
            return <option key={min}>{min}</option>;
          })}
        </select>
      </React.Fragment>
    );
  else return <div className="AttDesCont">{description}</div>;
})()}

//Transcard
<div className="start">{transport.text}</div>
<div className="transport" style={{ marginLeft: "5px" }}>
  {" "}
  by {transport.mode}
</div>
