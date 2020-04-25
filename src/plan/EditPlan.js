import "../scss/EditPlan.scss";
import AttBar from "./AttBar/AttBar";
import axios from "axios";
import EditPlanContent from "./EditPlanContent";
import EditPlanOverview from "./EditPlanOverview";
import React from "react";
import Request from "../lib/Request.js";
import Share from "./Share";
import Timeline from "./Timeline/Timeline";
import { DragDropContext } from "react-beautiful-dnd";
import { Int2Str, Str2Int } from "../lib/ConvertTime.js";
import { Redirect } from "react-router-dom";
import { Row, Col, Container, Toast, ToastBody, ToastHeader } from "reactstrap";

class EditPlan extends React.Component {
  state = {
    attraction: [],
    days: [],
    daysBefUpdate: 0,
    dropdownOpen: false,
    editTitle: false,
    error: null,
    isLoading: true,
    modal: false,
    orders: 0,
    plan_detail: [],
    publishToast: false,
    redirect: false,
    redirectTo: "/",
    transports: [],
    updateToast: false
  };

  updatePlan = async () => {
    //update current plan
    //this.toggleUpdateToast();
    await this.updatePlanStartday();
    await this.updatePlanDetails();
    await this.setState({ redirect: true, redirectTo: "/plan/" + this.props.plan_id });
  };

  updatePlanOverview = async plan_overview => {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const url = APIServer + "/plan_overview/" + plan_id;
    await axios
      .put(url, plan_overview)
      .then(response => {
        // console.log(response);
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });
    if (this.state.error) alert(this.state.error);
    else
      this.setState({
        plan_overview: { ...this.state.plan_overview, ...plan_overview }
      });
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (_planlist !== [] && _planlist !== null) {
      await localStorage.setItem(
        "planlist",
        JSON.stringify(
          _planlist.map(plan => {
            if (plan.plan_id === plan_id) return plan_overview;
            return plan;
          })
        )
      );
    }
  };

  updatePlanStartday = async () => {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let url = "";

    if (this.state.daysBefUpdate !== 0) {
      url = APIServer + "/plan_startday/delete/" + plan_id;
      await axios.delete(url).catch(error => {
        console.log(error);
      });
    }

    this.state.plan_startday.map(async day => {
      url = APIServer + "/plan_startday/";
      await axios.post(url, day).catch(error => {
        this.setState({ error });
        console.log(error);
      });
    });
  };

  updatePlanDetails = async () => {
    //update current plan
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let url = "";

    if (this.state.orders !== 0) {
      url = APIServer + "/plan_detail/delete/" + plan_id;
      await axios.delete(url).catch(error => {
        console.log(error);
      });
    }

    this.state.plan_detail.map(async plan => {
      url = APIServer + "/plan_detail/";
      await axios.post(url, plan).catch(error => {
        this.setState({ error });
        console.log(error);
      });
    });
  };

  updateOnePlanDetail = async order => {
    const plan_id = this.props.plan_id;
    const detail = this.state.plan_detail[order];
    const APIServer = process.env.REACT_APP_APIServer;
    const url = APIServer + "/plan_detail/" + plan_id + "/" + order;
    console.log(url);
    await axios
      .put(url, detail)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  getTransports = async () => {
    const { days } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    let transports = [];
    for (let i = 1; i <= this.state.plan_overview.duration; i++) {
      await transports.push([]);
    }
    await Promise.all(
      days.map(async day => {
        let idx = day - 1;
        let places = await this.state.plan_detail.filter(det => det.day === day);
        // console.log(places);
        let lastPlace = { attraction_name: "Hotel" };
        for (let j = 0; j < places.length; j++) {
          if (!lastPlace.google_place_id || !places[j].google_place_id) {
            await transports[idx].push({ text: "No transportation data", value: 0 });
            lastPlace = places[j];
            continue;
          }
          let url =
            APIServer +
            "/googletransport/" +
            lastPlace.google_place_id +
            "/" +
            places[j].google_place_id;
          await axios
            .get(url)
            .then(async res => {
              // console.log(res.data);
              await transports[idx].push({
                text: res.data.duration.text,
                mode: res.data.mode,
                value: res.data.duration.value / 60
              });
            })
            .catch(err => {
              console.log(err);
            });
          lastPlace = places[j];
        }
      })
    );
    // console.log(transports);
    await this.setState({ transports });
    return transports;
  };

  publishPlan = () => {
    //publish current plan
    this.togglePublishToast();
  };

  toggleUpdateToast = () => {
    this.setState({ updateToast: !this.state.updateToast });
  };

  togglePublishToast = () => {
    this.setState({ publishToast: !this.state.publishToast });
  };

  toggleShareModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  toggleEditPlanContent = () => {
    this.setState({ editTitle: !this.state.editTitle });
  };

  toggleDropDown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  calPlan = async plan_detail => {
    //// Need to be updated when transportations are added
    const transports = await this.getTransports();
    // console.log(transports);

    const { plan_startday } = this.state;
    let i = 0;
    for (i = 0; i < plan_detail.length; i++) {
      plan_detail[i].attraction_order = i;
    }
    for (i = 0; i < plan_startday.length; i++) {
      plan_startday[i].day = i + 1;
    }
    let lastDay = 0;
    let lastTime = 0;
    let transTime = 0;
    let idx = 0;
    for (i = 0; i < plan_detail.length; i++) {
      if (plan_detail[i].day !== lastDay) {
        lastDay = plan_detail[i].day;
        idx = 0;
        transTime = Math.ceil(transports[lastDay - 1][idx].value / 10) * 10;
        lastTime = Str2Int(plan_startday[lastDay - 1].start_day) + transTime;
        ++idx;
      }
      plan_detail[i].start_time = Int2Str(lastTime);
      plan_detail[i].end_time = Int2Str(lastTime + plan_detail[i].time_spend);
      if (transports[lastDay - 1][idx])
        transTime = Math.ceil(transports[lastDay - 1][idx].value / 10) * 10;
      else transTime = 0;
      lastTime = lastTime + plan_detail[i].time_spend + transTime;
      // console.log(transTime);
      ++idx;
    }
    await this.setState({ plan_detail, plan_startday });
    this.updatePlanDetails();
    this.updatePlanStartday();
  };

  addDay = day => {
    let { days, plan_overview, plan_detail, plan_startday } = this.state;
    days = days.concat(days.length + 1);
    plan_overview.duration += 1;
    plan_startday.splice(day, 0, {
      plan_id: this.props.plan_id,
      day: day,
      start_day: "09:00"
    });
    plan_detail.map(detail => {
      if (detail.day > day) detail.day += 1;
      return null;
    });
    this.setState({
      days,
      plan_overview,
      plan_startday
    });
    this.calPlan(plan_detail);
    this.updatePlanOverview(plan_overview);
  };

  delDay = day => {
    let { days, plan_overview, plan_detail, plan_startday } = this.state;
    days.pop();
    plan_overview.duration -= 1;
    plan_startday.splice(day - 1, 1);
    plan_detail = plan_detail.filter(plan => plan.day !== day);
    plan_detail.map(detail => {
      if (detail.day >= day) detail.day -= 1;
      return null;
    });
    this.setState({
      days,
      plan_overview,
      plan_startday
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
    if (a < b && daya !== dayb && b !== 0) b -= 1;
    plan_detail.splice(b, 0, removed);
    plan_detail.sort((a, b) => a.day - b.day);
    this.calPlan(plan_detail);
  };

  addCard = async (source, destination) => {
    let { droppableId, index } = destination;
    const { plan_detail } = this.state;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let toAdd = {
      plan_id,
      time_spend: 30, //// Can be changed to "recommended time"
      day: Number(droppableId)
    };
    const url = APIServer + "/attraction/" + source.index;
    await axios
      .get(url)
      .then(result => (toAdd = { ...toAdd, ...result.data[0] }))
      .catch(error => {
        this.setState({ error });
        // console.error(error);
      });
    plan_detail.splice(index, 0, toAdd);
    this.calPlan(plan_detail);
  };

  delCard = index => {
    const { plan_detail } = this.state;
    plan_detail.splice(index, 1);
    this.calPlan(plan_detail);
  };

  changeDuration = (source, newDuration) => {
    const { plan_detail } = this.state;
    plan_detail[source].time_spend = Number(newDuration);
    this.calPlan(plan_detail);
  };

  updateDescription = (source, newDescription) => {
    const { plan_detail } = this.state;
    plan_detail[source].description = newDescription;
    this.setState({ plan_detail });
    this.updateOnePlanDetail(source);
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectTo} />;
    }
  };

  async componentDidMount() {
    // Since it has to fetch three times, we fetch it here and store the data in the state
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/load_plan/" + plan_id;
    let i = 0;
    await axios
      .get(url)
      .then(async result => {
        await this.setState({ ...result.data });
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });
    if (!this.state.plan_overview) {
      this.setState({ error: true, isLoading: false });
      return;
    }
    url = APIServer + "/city";
    await axios
      .get(url)
      .then(result => {
        this.setState({ cities: result.data });
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });

    let days = [];
    for (i = 1; i <= this.state.plan_overview.duration; i++) {
      await days.push(i);
    }

    await this.getTransports();

    await this.setState({
      days: days,
      daysBefUpdate: days.length,
      orders: this.state.plan_detail.length
    });
    await this.setState({ isLoading: false });
    console.log("Fetching done...");
    this.calPlan(this.state.plan_detail);
  }

  render() {
    const { isLoading, error, plan_overview, modal, editTitle } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Something went wrong :(</div>;
    else {
      return (
        <React.Fragment>
          <DragDropContext
            onDragEnd={({ destination, source }) => {
              if (!destination) {
                return;
              }

              if (source.droppableId !== "bar") this.reorderCards(source, destination);
              else this.addCard(source, destination);
            }}
          >
            <Container fluid className="p-0">
              <Row className="m-0">
                <Col lg={8} className="p-0">
                  <EditPlanOverview {...this.state} updatePlanOverview={this.updatePlanOverview} />
                  <div className="title-bar">
                    <div className="title">{plan_overview.city}</div>
                    <div className="city">Plan</div>
                    <div className="days">Map</div>
                    <div>
                      {/* eslint-disable-next-line */}
                      <i
                        className="fa fa-pencil-square-o fa-fw"
                        aria-hidden="true"
                        onClick={this.toggleEditPlanContent}
                      />
                    </div>
                    <button className="white-button" onClick={this.toggleShareModal}>
                      Share!
                      <span style={{ fontSize: "15px" }}>
                        <br />
                        this plan
                      </span>
                    </button>
                    <button
                      style={{ marginLeft: "10px" }}
                      className="white-button2"
                      onClick={this.updatePlan}
                    >
                      Update!
                      <span style={{ fontSize: "15px" }}>
                        <br />
                        this plan
                      </span>
                    </button>
                  </div>
                  {this.renderRedirect()}
                  <Timeline
                    {...this.state}
                    {...this.props}
                    addDay={this.addDay}
                    delDay={this.delDay}
                    changeOrder={this.changeOrder}
                    changeDuration={this.changeDuration}
                    updateDescription={this.updateDescription}
                    delCard={this.delCard}
                    editing={true}
                  />
                </Col>
                <Col className="p-0">
                  <Request url={APIServer + "/attraction/city/" + plan_overview.city_id}>
                    {result => <AttBar {...result} />}
                  </Request>
                </Col>
              </Row>
            </Container>
          </DragDropContext>
          <Toast isOpen={this.state.updateToast}>
            <ToastHeader toggle={this.toggleUpdateToast}>Plan updated!</ToastHeader>
            <ToastBody>
              If you want to save this plan, please sign-in or copy the url. This plan will now show
              on 'My plan'.
            </ToastBody>
          </Toast>
          <Toast isOpen={this.state.publishToast}>
            <ToastHeader toggle={this.togglePublishToast}>Plan published!</ToastHeader>
            <ToastBody>
              The plan is opended to public. It will be available for other user
            </ToastBody>
          </Toast>

          {modal ? (
            <div className="share-modal">
              <Share toggleShareModal={this.toggleShareModal} />
            </div>
          ) : (
            <div></div>
          )}

          {editTitle ? (
            <div className="edit-plan-modal">
              <EditPlanContent
                {...this.state}
                toggleEditPlanContent={this.toggleEditPlanContent}
                updatePlanOverview={this.updatePlanOverview}
              />
            </div>
          ) : (
            <div></div>
          )}
        </React.Fragment>
      );
    }
  }
}

export default EditPlan;
