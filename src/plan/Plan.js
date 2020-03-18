import React from "react";
import Share from "./Share";
import EditPlanContent from "./EditPlanContent";
import EditPlan from "./EditPlan";
import PlanOverview from "./PlanOverview";
import Timeline from "./Timeline/Timeline";
import AttBar from "./AttBar/AttBar";
import axios from "axios";
import Request from "../lib/Request.js";
import { Int2Str, Str2Int } from "../lib/ConvertTime.js";
import { DragDropContext } from "react-beautiful-dnd";
import { Row, Col, Container } from "reactstrap";
import { Toast, ToastBody, ToastHeader } from "reactstrap";
import { Redirect } from 'react-router-dom';
import "./Plan.css";

class Plan extends React.Component {
  state = {
    isLoading: true,
    error: null,
    modal: false,
    editTitle: false,
    toastOpen: false,
    days: [],
    attraction: [],
    redirect: false,
    redirectTo: '/',
  };

  save = () => {
    this.openToast();
    if (localStorage.getItem("planlist") === null) {
      var _planlist = [];
      _planlist[0] = this.state.plan_overview;
      localStorage.setItem("planlist", JSON.stringify(_planlist));
    } else {
      let _planlist = JSON.parse(localStorage.getItem("planlist"));
      for (var i = 0; i < _planlist.length; i++) {
        if (_planlist[i].plan_id === this.props.plan_id) return;
      }
      _planlist.push(this.state.plan_overview);
      localStorage.setItem("planlist", JSON.stringify(_planlist));
    }
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

  openEditPlan = () => {
    this.setState({ editTitle: true });
  };

  checkEdit = () =>{
    //If user already edit the plan before, go to the edit plan page on the same url
    if(true){
      this.setState({redirect: true, redirectTo: "/plan/"+this.props.plan_id+"/edit_plan"});
    }
    //Else if user not edit the plan before, create new url and go to that url edit plan page
    else{
      //createNewUrl()
      this.setState({redirect: true, redirectTo: "/plan/"+this.props.plan_id+"/edit_plan"});
    }
  };
  
  renderEditRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to = {this.state.redirectTo} />
    }
  };

  setPlanOverview = plan_overview => {
    this.setState({ plan_overview });
  };

  closeEditPlan = () => {
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
    console.log(plan_detail[source]);
    plan_detail[source].time_spend = Number(newDuration);
    this.calPlan(plan_detail);
  };

  async componentDidMount() {
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

    await this.setState({ days: days, isLoading: false });

    console.log("Fetching done...");
  }

  render() {
    const { isLoading, error, plan_overview, modal, editTitle } = this.state;
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
            <div className="title">{plan_overview.plan_title}</div>
            <div className="city">{plan_overview.city_name}</div>
            <div className="days">
              {plan_overview.duration > 1
                ? plan_overview.duration + " Days Plan"
                : "One Day Plan"}
            </div>
            <div>
              {/* eslint-disable-next-line */}
              <i
                className="fa fa-pencil-square-o fa-fw"
                aria-hidden="true"
                onClick={this.openEditPlan}
              />
            </div>
            {this.renderEditRedirect()}
            <button className="save" onClick={this.save}>
              Save!
              <span style={{ fontSize: "15px" }}>
                <br />
                to device
              </span>
            </button>
            <button className="share" onClick={this.openShareModal}>
              Share!
              <span style={{ fontSize: "15px" }}>
                <br />
                this plan
              </span>
            </button>
          </div>
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
                closeEditPlan={this.closeEditPlan}
                updatePlanOverview={this.updatePlanOverview}
              />
            </div>
          ) : (
            <div></div>
          )}

          <PlanOverview {...this.state} />
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
                <Col lg={12}>
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
              </Row>
            </Container>
          </DragDropContext>
        </React.Fragment>
      );
    }
  }
}

export default Plan;
