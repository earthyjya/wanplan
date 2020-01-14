import React from "react";
import Share from "./Share";
import Timeline from "./Timeline";
import AttInfo from "./AttInfo";
import axios from "axios";
import Request from "../lib/Request.js";
import AttBar from "./AttBar.js";
import { DragDropContext } from "react-beautiful-dnd";

class Plan extends React.Component {
  state = {
    isLoading: true,
    error: null,
    modal: false,
    days: [],
    attraction: []
  };

  toggle = () => this.setState({ modal: !this.state.modal });

  close = () => {
    if (this.state.modal === true) {
      this.setState({ modal: false });
    }
  };

  addDay = day => {
    let { days, trip_overview, trip_detail } = this.state;
    days = days.concat(days.length + 1);
    trip_overview.duration += 1;
    trip_detail.map(detail => {
      if (detail.day >= day) detail.day += 1;
    });
    this.setState({
      days,
      trip_overview,
      trip_detail
    });
  };

  delDay = day => {
    let { days, trip_overview, trip_detail } = this.state;
    days.pop();
    trip_overview.duration -= 1;
    trip_detail = trip_detail.filter(trip => trip.day !== day);
    trip_detail.map(detail => {
      if (detail.day >= day) detail.day -= 1;
    });
    this.setState({
      days,
      trip_overview,
      trip_detail
    });
  };

  reorderCards = (source, destination) => {
    const { droppableId } = destination;
    let a = source.index;
    let b = destination.index;
    const { trip_detail } = this.state;
    const attA = trip_detail.filter(trip => trip.order === a)[0].attraction_id;
    if (a < b) {
      if (source.droppableId !== droppableId) b -= 1;
      trip_detail.map(detail => {
        if (detail.order < b && detail.order >= a) {
          let { attraction_id, day } = trip_detail.filter(
            trip => trip.order === detail.order + 1
          )[0];
          detail.attraction_id = attraction_id;
          detail.day = day;
        }
        if (detail.order === b) {
          detail.attraction_id = attA;
          detail.day = Number(droppableId);
        }
      });
    }

    if (a >= b) {
      trip_detail.sort((a, b) => b.order - a.order);
      trip_detail.map(detail => {
        if (detail.order > b && detail.order <= a) {
          let { attraction_id, day } = trip_detail.filter(
            trip => trip.order === detail.order - 1
          )[0];
          detail.attraction_id = attraction_id;
          detail.day = day;
        }
        if (detail.order === b) {
          detail.attraction_id = attA;
          detail.day = Number(droppableId);
        }
      });

      trip_detail.sort((a, b) => a.order - b.order);
    }

    this.setState({
      trip_detail
    });
  };

  async componentDidMount() {
    // Since it has to fetch three times, we fetch it here and store the data in the state
    const { serverIP, jsonPort, trip_id } = this.props;
    let url = serverIP + ":" + jsonPort + "/trip_overview?trip_id=" + trip_id;
    await axios
      .get(url)
      .then(result => {
        const [trip_overview, ...rest] = result.data;
        this.setState({ trip_overview });
      })
      .catch(error => this.setState({ error }));
    if (!this.state.trip_overview) {
      this.setState({ isLoading: false, error: true });
      return;
    }

    url =
      serverIP + ":" + jsonPort + "/trip_detail?_sort=order&trip_id=" + trip_id;
    await axios
      .get(url)
      .then(result => {
        this.setState({ trip_detail: result.data });
        let { data } = result;
        data = data.reduce(
          (acc, val) =>
            val.attraction_id in acc ? acc : [...acc, val.attraction_id],
          []
        );
        data.map(async detail => {
          url =
            serverIP + ":" + jsonPort + "/attraction?attraction_id=" + detail;

          await axios
            .get(url)
            .then(result =>
              this.setState({
                attraction: [...this.state.attraction, ...result.data]
              })
            )
            .catch(error => {
              this.setState({ error });
              console.error(error);
            });
        });
      })
      .catch(error => {
        this.setState({ error });
        console.error(error);
      });

    url =
      serverIP +
      ":" +
      jsonPort +
      "/city?city_id=" +
      this.state.trip_overview.city_id;
    await axios
      .get(url)
      .then(result => {
        const [city, ...rest] = result.data;
        this.setState({ city, isLoading: false });
      })
      .catch(error => {
        this.setState({ error, isloading: false });
        console.error(error);
      });
    var [a, ...rest] = Array(this.state.trip_overview.duration + 1).keys();
    this.setState({ days: rest });
  }

  render() {
    const {
      isLoading,
      error,
      city,
      trip_overview,
      trip_detail,
      days,
      modal
    } = this.state;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Can't find the plan</div>;
    else
      return (
        <div>
          <div className="title-bar">
            <div className="city">{city.city_name}</div>
            <div className="title">{trip_overview.trip_name}</div>
            <div className="days">
              {trip_overview.duration > 1
                ? trip_overview.duration + " Days Trip"
                : "One Day Trip"}
            </div>
            <button className="share" onClick={this.toggle}>
              Share!
              <span style={{ fontSize: "15px" }}>
                <br />
                this plan
              </span>
            </button>
          </div>

          {modal ? (
            <div className="share-modal">
              <Share close={this.close} />
            </div>
          ) : (
            <div></div>
          )}

          <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination) {
                return;
              }

              this.reorderCards(source, destination);
            }}
          >
            {days.map(day => (
              <Timeline
                {...this.state}
                {...this.props}
                trip_detail={trip_detail.filter(trip => trip.day === day)}
                addDay={this.addDay}
                delDay={this.delDay}
                day={day}
                key={day.toString()}
                changeOrder={this.changeOrder}
              />
            ))}
            <div>
              <button className="AddDay" onClick={this.addDay}>
                +
              </button>
              <hr style={{ margin: "0px 30px 30px 30px" }} />
            </div>
          </DragDropContext>

          <Request url={this.props.serverIP + ":3030/attraction"}>
            {result => <AttBar {...result} />}
          </Request>

          <AttInfo {...this.state} />
        </div>
      );
  }
}

export default Plan;
