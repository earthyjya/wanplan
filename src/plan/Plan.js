import React from "react";
import Share from "./Share";
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
    editPlan: false,
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
  }

  renderEditRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to = {this.state.redirectTo} />
    }
  }

  setPlanOverview = plan_overview => {
    this.setState({ plan_overview });
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

    await this.setState({ days: days, isLoading: false });

    console.log("Fetching done...");
  }

  render() {
    const { isLoading, error, plan_overview, modal, editPlan } = this.state;
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
              <a onClick = {this.checkEdit}>
                {/* eslint-disable-next-line */}
                <img
                  className="edit"
                  onClick={this.openEditPlan}
                  src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNTEyIiB2aWV3Qm94PSIwIC0xIDQwMS41MjI4OSA0MDEiIHdpZHRoPSI1MTIiIGNsYXNzPSIiPjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuOTk5OCAwIDAgMC45OTk4IDAuMDQwMTUwMiAwLjAzOTg5NzkpIj48cGF0aCBkPSJtMzcwLjU4OTg0NCAyNTAuOTcyNjU2Yy01LjUyMzQzOCAwLTEwIDQuNDc2NTYzLTEwIDEwdjg4Ljc4OTA2M2MtLjAxOTUzMiAxNi41NjI1LTEzLjQzNzUgMjkuOTg0Mzc1LTMwIDMwaC0yODAuNTg5ODQ0Yy0xNi41NjI1LS4wMTU2MjUtMjkuOTgwNDY5LTEzLjQzNzUtMzAtMzB2LTI2MC41ODk4NDRjLjAxOTUzMS0xNi41NTg1OTQgMTMuNDM3NS0yOS45ODA0NjkgMzAtMzBoODguNzg5MDYyYzUuNTIzNDM4IDAgMTAtNC40NzY1NjMgMTAtMTAgMC01LjUxOTUzMS00LjQ3NjU2Mi0xMC0xMC0xMGgtODguNzg5MDYyYy0yNy42MDE1NjIuMDMxMjUtNDkuOTY4NzUgMjIuMzk4NDM3LTUwIDUwdjI2MC41OTM3NWMuMDMxMjUgMjcuNjAxNTYzIDIyLjM5ODQzOCA0OS45Njg3NSA1MCA1MGgyODAuNTg5ODQ0YzI3LjYwMTU2Mi0uMDMxMjUgNDkuOTY4NzUtMjIuMzk4NDM3IDUwLTUwdi04OC43OTI5NjljMC01LjUyMzQzNy00LjQ3NjU2My0xMC0xMC0xMHptMCAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iIiBzdHlsZT0iZmlsbDojQkVCRUJFIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCI+PC9wYXRoPjxwYXRoIGQ9Im0zNzYuNjI4OTA2IDEzLjQ0MTQwNmMtMTcuNTc0MjE4LTE3LjU3NDIxOC00Ni4wNjY0MDYtMTcuNTc0MjE4LTYzLjY0MDYyNSAwbC0xNzguNDA2MjUgMTc4LjQwNjI1Yy0xLjIyMjY1NiAxLjIyMjY1Ni0yLjEwNTQ2OSAyLjczODI4Mi0yLjU2NjQwNiA0LjQwMjM0NGwtMjMuNDYwOTM3IDg0LjY5OTIxOWMtLjk2NDg0NCAzLjQ3MjY1Ni4wMTU2MjQgNy4xOTE0MDYgMi41NjI1IDkuNzQyMTg3IDIuNTUwNzgxIDIuNTQ2ODc1IDYuMjY5NTMxIDMuNTI3MzQ0IDkuNzQyMTg3IDIuNTY2NDA2bDg0LjY5OTIxOS0yMy40NjQ4NDNjMS42NjQwNjItLjQ2MDkzOCAzLjE3OTY4Ny0xLjM0Mzc1IDQuNDAyMzQ0LTIuNTY2NDA3bDE3OC40MDIzNDMtMTc4LjQxMDE1NmMxNy41NDY4NzUtMTcuNTg1OTM3IDE3LjU0Njg3NS00Ni4wNTQ2ODcgMC02My42NDA2MjV6bS0yMjAuMjU3ODEyIDE4NC45MDYyNSAxNDYuMDExNzE4LTE0Ni4wMTU2MjUgNDcuMDg5ODQ0IDQ3LjA4OTg0NC0xNDYuMDE1NjI1IDE0Ni4wMTU2MjV6bS05LjQwNjI1IDE4Ljg3NSAzNy42MjEwOTQgMzcuNjI1LTUyLjAzOTA2MyAxNC40MTc5Njl6bTIyNy4yNTc4MTItMTQyLjU0Njg3NS0xMC42MDU0NjggMTAuNjA1NDY5LTQ3LjA5Mzc1LTQ3LjA5Mzc1IDEwLjYwOTM3NC0xMC42MDU0NjljOS43NjE3MTktOS43NjE3MTkgMjUuNTg5ODQ0LTkuNzYxNzE5IDM1LjM1MTU2MyAwbDExLjczODI4MSAxMS43MzQzNzVjOS43NDYwOTQgOS43NzM0MzggOS43NDYwOTQgMjUuNTg5ODQ0IDAgMzUuMzU5Mzc1em0wIDAiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIGNsYXNzPSIiIHN0eWxlPSJmaWxsOiNCRUJFQkUiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIj48L3BhdGg+PC9nPiA8L3N2Zz4="
                  />
              </a>
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
