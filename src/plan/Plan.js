import React from "react";
import Share from "./Share";
import Timeline from "./Timeline";
import PlanOverview from "./PlanOverview";
import axios from "axios";
import Request from "../lib/Request.js";
import { Int2Str } from "../lib/ConvertTime.js";
import AttBar from "./AttBar.js";
import { DragDropContext } from "react-beautiful-dnd";
import { Row, Col, Container } from "reactstrap";
import { Toast, ToastBody, ToastHeader } from "reactstrap";
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

    const { start_day } = this.state.plan_overview;
    _detail.map(plan => (plan.order = _detail.indexOf(plan)));
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

    this.setState({ plan_detail: _detail });
  };

  save = () => {
    this.openToast();
    if (localStorage.getItem("planlist") === null) {
      var _planlist = [];
      _planlist[0] = this.state.plan_overview;
      localStorage.setItem("planlist", JSON.stringify(_planlist));
    } else {
      let _planlist = JSON.parse(localStorage.getItem("planlist"));
      console.log(_planlist);
      for (var i = 0; i < _planlist.length; i++) {
        if (_planlist[i].plan_id === this.state.plan_overview.plan_id) return;
      }
      _planlist.push(this.state.plan_overview);
      localStorage.setItem("planlist", JSON.stringify(_planlist));
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
    let { days, plan_overview, plan_detail } = this.state;
    days = days.concat(days.length + 1);
    plan_overview.duration += 1;
    plan_overview.start_day.splice(day, 0, 480);
    console.log(day);
    plan_detail.map(detail => {
      if (detail.day > day) detail.day += 1;
      return null;
    });
    this.setState({
      days,
      plan_overview
    });
    this.calPlan(plan_detail);
  };

  delDay = day => {
    let { days, plan_overview, plan_detail } = this.state;
    days.pop();
    plan_overview.duration -= 1;
    plan_overview.start_day.splice(day - 1, 1);
    plan_detail = plan_detail.filter(plan => plan.day !== day);
    plan_detail.map(detail => {
      if (detail.day >= day) detail.day -= 1;
      return null;
    });
    this.setState({
      days,
      plan_overview
    });
    this.calPlan(plan_detail);
  };

  reorderCards = (source, destination) => {
    let a = source.index;
    let b = destination.index;
    const daya = Number(source.droppableId);
    const dayb = Number(destination.droppableId);
    let { plan_detail } = this.state;
    let [removed] = plan_detail.splice(a, 1);
    removed.day = dayb;
    console.log(a, b, removed);
    if (a < b && daya !== dayb && b !== 0) b -= 1;
    plan_detail.splice(b, 0, removed);
    console.log(plan_detail);
    plan_detail.sort((a, b) => a.day - b.day);
    this.calPlan(plan_detail);
  };

  addCard = async (source, destination) => {
    let { droppableId, index } = destination;
    const { plan_detail } = this.state;
    const { user_id, plan_id } = this.state.plan_overview;
    const { serverIP, jsonPort } = this.props;
    const toAdd = {
      plan_id,
      user_id,
      time_spend: 30, //// Can be changed to "recommended time"
      day: Number(droppableId),
      attraction_id: source.index
    };
    if (
      this.state.attraction.filter(att => att.attraction_id === source.index)
        .length === 0
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
    plan_detail.splice(index, 0, toAdd);
    this.calPlan(plan_detail);
  };

  delCard = index => {
    const { plan_detail } = this.state;
    plan_detail.splice(index, 1);
    this.calPlan(plan_detail);
  };

  changeDuration = (source, newDuration) => {
    let _detail = this.state.plan_detail;
    _detail[source].time_spend = parseInt(newDuration);
    this.calPlan(_detail);
  };

  async componentDidMount() {
    // Since it has to fetch three times, we fetch it here and store the data in the state
    const { serverIP, jsonPort, plan_id, user_id } = this.props;
    let url = serverIP + ":" + jsonPort + "/plan_overview?plan_id=" + plan_id;
    await axios
      .get(url)
      .then(result => {
        const plan_overview = result.data[0];
        this.setState({ plan_overview });
      })
      .catch(error => this.setState({ error }));
    if (!this.state.plan_overview) {
      this.setState({ isLoading: false, error: true });
      return;
    }

    url = serverIP + ":" + jsonPort + "/user?user_id=" + user_id;
    await axios.get(url).then(result => {
      this.setState({ user: result.data[0] });
    });
    url =
      serverIP + ":" + jsonPort + "/plan_detail?_sort=order&plan_id=" + plan_id;
    let attList = [];
    await axios
      .get(url)
      .then(result => {
        this.setState({
          plan_detail: result.data.sort((a, b) => a.order - b.order)
        });
        let { data } = result;
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
      return null;
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
      this.state.plan_overview.city_id;
    await axios
      .get(url)
      .then(result => {
        const city = result.data[0];
        this.setState({ city, isLoading: false });
      })
      .catch(error => {
        this.setState({ error });
        console.error(error);
      });
    let days = [];
    for (var i = 1; i <= this.state.plan_overview.duration; i++) {
      days.push(i);
    }
    await this.setState({ days: days, isloading: false });
  }

  render() {
    const { isLoading, error, city, plan_overview, modal } = this.state;
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
            <div className="title">{plan_overview.plan_name}</div>
            <div className="days">
              {plan_overview.duration > 1
                ? plan_overview.duration + " Days Plan"
                : "One Day Plan"}
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
          <PlanOverview {...this.state} />
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
                    delCard={this.delCard}
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
