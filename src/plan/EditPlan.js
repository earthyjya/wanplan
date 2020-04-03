import React from "react";
import "../scss/EditPlan.scss";
import Share from "./Share";
import EditPlanContent from "./EditPlanContent";
import EditPlanOverview from "./EditPlanOverview";
import Timeline from "./Timeline/Timeline";
import AttBar from "./AttBar/AttBar";
import axios from "axios";
import Request from "../lib/Request.js";
import { Int2Str, Str2Int } from "../lib/ConvertTime.js";
import { DragDropContext } from "react-beautiful-dnd";
import { Row, Col, Container } from "reactstrap";
import { Toast, ToastBody, ToastHeader } from "reactstrap";
import { Redirect } from "react-router-dom";

class EditPlan extends React.Component {
  state = {
    isLoading: true,
    error: null,
    modal: false,
    editTitle: false,
    updateToastOpen: false,
    publishToastOpen: false,
    plan_detail: [],
    days: [],
    daysBefUpdate: 0,
    orders: 0,
    attraction: [],
    redirect: false,
    redirectTo: "/"
  };

  updatePlan = async () => {
    //update current plan
    this.updateToastOpen();
    const { APIServer, plan_id } = this.props;
    let url = "";

    if (this.state.daysBefUpdate !== 0) {
      url = APIServer + "/plan_startday/delete/" + this.state.plan_overview.plan_id;

      await axios
        .delete(url)
        .then(result => {
          if (result.data === null) alert("Could not update plan :(");
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        });
    }

    this.state.plan_startday.map(async day => {
      url = APIServer + "/plan_startday/";
      await axios
        .post(url, day)
        .then(result => {
          if (result.data === null) alert("Could not update plan :(");
          console.log(result);
        })
        .catch(error => {
          this.setState({ error });
          console.log(error);
        });
    });

    if (this.state.orders !== 0) {
      url = APIServer + "/plan_detail/delete/" + this.state.plan_overview.plan_id;

      await axios
        .delete(url)
        .then(result => {
          if (result.data === null) alert("Could not update plan :(");
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        });
    }

    this.state.plan_detail.map(async plan => {
      url = APIServer + "/plan_detail/";
      await axios
        .post(url, this.state.plan_detail[plan.attraction_order])
        .then(result => {
          if (result.data === null) alert("Could not update plan :(");
          console.log(result);
        })
        .catch(error => {
          this.setState({ error });
          console.log(error);
        });
    });

    url = APIServer + "/plan_overview/" + plan_id;
    await axios
      .put(url, this.state.plan_overview)
      .then(result => {
        if (result.data === null) alert("Could not update plan :(");
        else
          this.setState({
            redirect: true,
            redirectTo: "/plan/" + this.state.plan_overview.plan_id
          });
        console.log(result);
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });
  };

  updatePlanOverview = async plan_overview => {
    const { APIServer, plan_id } = this.props;
    const url = APIServer + "/plan_overview/" + plan_id;
    await axios
      .put(url, plan_overview)
      .then(response => {
        console.log(response);
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
  };

  renderOverviewRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectTo} />;
    }
  };

  publishPlan = () => {
    //publish current plan
    this.publishToastOpen();
  };

  updateToastOpen = () => {
    this.setState({ updateToastOpen: true });
  };

  updateToastClose = () => {
    this.setState({ updateToastOpen: false });
  };

  publishToastOpen = () => {
    this.setState({ publishToastOpen: true });
  };

  publishToastClose = () => {
    this.setState({ publishToastOpen: false });
  };

  openShareModal = () => {
    this.setState({ modal: true });
  };

  closeShareModal = () => {
    this.setState({ modal: false });
  };

  openEditPlanContent = () => {
    this.setState({ editTitle: true });
  };

  closeEditPlanContent = () => {
    this.setState({ editTitle: false });
  };

  calPlan = async plan_detail => {
    //// Need to be updated when transportations are added

    const { plan_startday } = this.state;
    var i = 0;
    for (i = 0; i < plan_detail.length; i++) {
      plan_detail[i].attraction_order = i;
    }
    for (i = 0; i < plan_startday.length; i++) {
      plan_startday[i].day = i + 1;
    }
    let lastDay = 0;
    let lastTime = 0;
    for (i = 0; i < plan_detail.length; i++) {
      if (plan_detail[i].day !== lastDay) {
        lastDay = plan_detail[i].day;
        lastTime = Str2Int(plan_startday[lastDay - 1].start_day);
      }
      plan_detail[i].start_time = Int2Str(lastTime);
      plan_detail[i].end_time = Int2Str(lastTime + plan_detail[i].time_spend);
      lastTime = lastTime + plan_detail[i].time_spend;
    }

    await this.setState({ plan_detail, plan_startday });
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

  reorderCards = async (source, destination) => {
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
    await this.calPlan(plan_detail);
  };

  addCard = async (source, destination) => {
    let { droppableId, index } = destination;
    const { plan_detail } = this.state;
    const { APIServer, plan_id } = this.props;
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
        console.error(error);
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
  };

  async componentDidMount() {
    // Since it has to fetch three times, we fetch it here and store the data in the state
    const { APIServer, plan_id } = this.props;
    let url = APIServer + "/load_plan/" + plan_id;
    let i = 0;
    await axios
      .get(url)
      .then(result => {
        this.setState({ ...result.data });
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });
    if (!this.state.plan_overview) {
      this.setState({ error: true });
      return;
    }

    let days = [];
    for (i = 1; i <= this.state.plan_overview.duration; i++) {
      await days.push(i);
    }

    await this.setState({
      days: days,
      daysBefUpdate: days.length,
      orders: this.state.plan_detail.length,
      isLoading: false
    });
    console.log("Fetching done...");
  }

  render() {
    const { isLoading, error, plan_overview, modal, editTitle } = this.state;
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
                  <EditPlanOverview {...this.state} />
                  <div className="title-bar">
                    <div className="title">{plan_overview.plan_title}</div>
                    <div className="city">Plan</div>
                    <div className="days">Map</div>
                    <div>
                      {/* eslint-disable-next-line */}
                      <i
                        className="fa fa-pencil-square-o fa-fw"
                        aria-hidden="true"
                        onClick={this.openEditPlanContent}
                      />
                    </div>
                    <button className="white-button" onClick={this.openShareModal}>
                      Share!
                      <span style={{ fontSize: "15px" }}>
                        <br />
                        this plan
                      </span>
                    </button>
                    <button
                      style={{ marginLeft: "10px" }}
                      className="white-button"
                      onClick={this.updatePlan}
                    >
                      Update!
                      <span style={{ fontSize: "15px" }}>
                        <br />
                        this plan
                      </span>
                    </button>
                  </div>
                  <div className="publish-div">
                    <button onClick={this.publishPlan} className="publish-button">
                      Publish
                    </button>
                  </div>
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
                  <Request url={this.props.APIServer + "/attraction/city/" + plan_overview.city_id}>
                    {result => <AttBar {...result} />}
                  </Request>
                </Col>
              </Row>
            </Container>
          </DragDropContext>
          <Toast isOpen={this.state.updateToastOpen}>
            <ToastHeader toggle={this.updateToastClose}>Plan updated!</ToastHeader>
            <ToastBody>
              If you want to save this plan, please sign-in or copy the url. This plan will now show
              on 'My plan'.
            </ToastBody>
          </Toast>
          <Toast isOpen={this.state.publishToastOpen}>
            <ToastHeader toggle={this.publishToastClose}>Plan published!</ToastHeader>
            <ToastBody>
              The plan is opended to public. It will be available for other user
            </ToastBody>
          </Toast>

          {modal ? (
            <div className="share-modal">
              <Share closeShareModal={this.closeShareModal} />
            </div>
          ) : (
            <div></div>
          )}

          {editTitle ? (
            <div className="edit-plan-modal">
              <EditPlanContent
                {...this.state}
                closeEditPlanContent={this.closeEditPlanContent}
                updatePlanOverview={this.updatePlanOverview}
              />
            </div>
          ) : (
            <div></div>
          )}
          {this.renderOverviewRedirect()}
        </React.Fragment>
      );
    }
  }
}

export default EditPlan;
