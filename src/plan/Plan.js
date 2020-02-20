import React from "react";
import Share from "./Share";
import Timeline from "./Timeline";
import axios from "axios";
import Request from "../lib/Request.js";
import { Int2Str } from "../lib/ConvertTime.js";
import AttBar from "./AttBar.js";
import { DragDropContext } from "react-beautiful-dnd";
import { Row, Col, Container, Button } from "reactstrap";
import {
  Card,
  CardImg,
  CardTitle,
  CardText,
  CardBody,
  CardSubtitle,
  Toast,
  ToastBody,
  ToastHeader
} from "reactstrap";
import "./Plan.css";

class Plan extends React.Component {
  state = {
    isLoading: true,
    error: null,
    modal: false,
    toastOpen: false,
    days: [],
    attraction: []
  };

  calPlan = _detail => {
    //// Need to be updated when transportations are added

    const { start_day } = this.state.trip_overview;
    _detail.map(trip => (trip.order = _detail.indexOf(trip)));
    let lastDay = 0;
    let lastTime = 0;
    for (var i = 0; i < _detail.length; i++) {
      if (_detail[i].day !== lastDay) {
        lastDay = _detail[i].day;
        lastTime = start_day[lastDay - 1];
      }
      _detail[i].start_time = Int2Str(lastTime);
      _detail[i].end_time = Int2Str(lastTime + _detail[i].time_spend);
      lastTime = lastTime + _detail[i].time_spend;
    }

    this.setState({ trip_detail: _detail });
  };

  save = () => {
    this.openToast();
    if (localStorage.getItem("triplist") === null) {
      var _triplist = [];
      _triplist[0] = this.state.trip_overview;
      localStorage.setItem("triplist", JSON.stringify(_triplist));
    } else {
      let _triplist = JSON.parse(localStorage.getItem("triplist"));
      console.log(_triplist);
      for (var i = 0; i < _triplist.length; i++) {
        if (_triplist[i].trip_id == this.state.trip_overview.trip_id) return;
      }
      _triplist.push(this.state.trip_overview);
      localStorage.setItem("triplist", JSON.stringify(_triplist));
    }
  };

  openToast = () => {
    this.setState({ toastOpen: true });
  };

  closeToast = () => {
    this.setState({ toastOpen: false });
  };

  openShareModal = () => {
    this.setState({ modal: true });
  };

  closeShareModal = () => {
    this.setState({ modal: false });
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
    });
    this.calPlan(trip_detail);
  };

  reorderCards = (source, destination) => {
    let a = source.index;
    let b = destination.index;
    const daya = Number(source.droppableId);
    const dayb = Number(destination.droppableId);
    let { trip_detail } = this.state;
    let [removed] = trip_detail.splice(a, 1);
    removed.day = dayb;
    console.log(a, b, removed);
    if (a < b && daya !== dayb && b !== 0) b -= 1;
    trip_detail.splice(b, 0, removed);
    console.log(trip_detail);
    trip_detail.sort((a, b) => a.day - b.day);
    this.calPlan(trip_detail);
  };

  addCard = async (source, destination) => {
    let { droppableId, index } = destination;
    const { trip_detail } = this.state;
    const { user_id, trip_id } = this.state.trip_overview;
    const { serverIP, jsonPort } = this.props;
    const toAdd = {
      trip_id,
      user_id,
      time_spend: 30,    //// Can be changed to "recommended time"
      day: Number(droppableId),
      attraction_id: source.index
    };
    if (
      !this.state.attraction.filter(att => att.attraction_id === source.index)
    ) {
      const url =
        serverIP + ":" + jsonPort + "/attraction?attraction_id=" + source.index;
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
    }
    trip_detail.splice(index, 0, toAdd);
    this.calPlan(trip_detail);
  };

  delCard = source => {
    const { trip_detail } = this.state;
    const [removed] = trip_detail.splice(source.index, 1);
  };

  changeDuration = (source, newDuration) => {
    let _detail = this.state.trip_detail;
    _detail[source].time_spend = parseInt(newDuration);
    this.calPlan(_detail);
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
    let attList = [];
    await axios
      .get(url)
      .then(result => {
        this.setState({
          trip_detail: result.data[0].itinerary.sort(
            (a, b) => a.order - b.order
          )
        });
        let data = result.data[0].itinerary;
        data = data.reduce(
          (acc, val) =>
            acc.indexOf(val.attraction_id) === -1
              ? [...acc, val.attraction_id]
              : acc,
          []
        );
        attList = data;
      })
      .catch(error => {
        this.setState({ error });
        console.error(error);
      });

    url = serverIP + ":" + jsonPort + "/attraction?";
    attList.map(detail => {
      url = url + "&attraction_id=" + detail;
    });
    await axios
      .get(url)
      .then(async result =>
        this.setState({
          attraction: result.data
        })
      )
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
        this.setState({ error });
        console.error(error);
      });
    let [a, ...rest] = Array(this.state.trip_overview.duration + 1).keys();
    await this.setState({ days: rest, isloading: false });
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
    if (error) return <div>Something went wrong :(</div>;
    else {
      return (
        <React.Fragment>
          <Toast isOpen={this.state.toastOpen}>
            <ToastHeader toggle={this.closeToast}>Plan saved!</ToastHeader>
            <ToastBody>
              The plan is saved to your device, view it in plan page!
            </ToastBody>
          </Toast>
          <div className="title-bar">
            <div className="city">{city.city_name}</div>
            <div className="title">{trip_overview.trip_name}</div>
            <div className="days">
              {trip_overview.duration > 1
                ? trip_overview.duration + " Days Trip"
                : "One Day Trip"}
            </div>
            <button className="save" onClick={this.save}>
              Save!
            </button>
            <button className="share" onClick={this.openShareModal}>
              Share!
              <span style={{ fontSize: "15px" }}>
                <br />
                this plan
              </span>
            </button>
          </div>
          <Container
            fluid
            className="plan-description-container plan-header"
            style={{
              backgroundImage:
                "url(https://d3hne3c382ip58.cloudfront.net/resized/1920x700/japan-tours-400X400_.JPG)"
            }}
          >
            <Row>
              <Col lg={8}>
                <div className="plan-description">
                  {" "}
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged. It was popularised in the 1960s with
                  the release of Letraset sheets containing Lorem Ipsum
                  passages, and more recently with desktop publishing software
                  like Aldus PageMaker including versions of Lorem Ipsum.
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6} md={6} lg={6}>
                <Row style={{ padding: "10px" }}>
                  <Col sm={"auto"} md={"auto"} lg={"auto"}>
                    <img
                      src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                      className="avatar-image"
                    />
                  </Col>
                  <Col>
                    <div>John Doe</div>
                    <div>User description</div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
          {modal ? (
            <div className="share-modal">
              <Share closeShareModal={this.closeShareModal} />
            </div>
          ) : (
            <div></div>
          )}

          <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination) {
                return;
              }

              if (source.droppableId !== "bar")
                this.reorderCards(source, destination);
              else this.addCard(source, destination);
            }}
          >
            <Container fluid>
              <Row>
                <Col lg={8}>
                  <Timeline
                    {...this.state}
                    {...this.props}
                    addDay={this.addDay}
                    delDay={this.delDay}
                    changeOrder={this.changeOrder}
                    changeDuration={this.changeDuration}
                  />
                </Col>
                <Col lg={4}>
                  <Request url={this.props.serverIP + ":3030/attraction"}>
                    {result => <AttBar {...result} />}
                  </Request>
                </Col>
              </Row>
            </Container>
          </DragDropContext>
        </React.Fragment>
      );
    }
  }
}

export default Plan;
