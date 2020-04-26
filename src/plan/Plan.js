import "../scss/Plan.scss";
import axios from "axios";
import PlanOverview from "./PlanOverview";
import React from "react";
import Share from "./Share";
import Timeline from "./Timeline/Timeline";
import { Int2Str, Str2Int } from "../lib/ConvertTime.js";
import { Redirect } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { Toast, ToastBody, ToastHeader } from "reactstrap";

class Plan extends React.Component {
  state = {
    attraction: [],
    days: [],
    error: null,
    isLoading: true,
    modal: false,
    redirect: false,
    redirectTo: "/",
    toastOpen: false,
    transports: []
  };

  save = async () => {
    this.toggleToast();
    const { user_id } = this.props;
    if (this.props.isLoggedIn) {
      this.saveToUser(user_id, "/");
    } else {
      this.saveToUser(0, "/");
    }
  };

  saveToUser = async (user_id, redirect) => {
    const { isLoggedIn } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let oldPlanId = this.state.plan_overview.plan_id;
    let newPlanId = 0;
    let savedplan = {};
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (user_id !== this.state.plan_overview.user_id || user_id === 0) {
      let saved = false;
      _planlist.map(plan => {
        if (plan.plan_id === this.state.plan_overview.plan_id) saved = true;
        return null;
      });
      if (!saved) {
        // Duplicate plan_overview
        let url = APIServer + "/plan_overview/" + oldPlanId + "/" + user_id;
        await axios
          .post(url)
          .then(result => {
            if (result.data === null) alert("Could not duplicate plan :(");
            // console.log(result);
            newPlanId = result.data.id;
            savedplan = { ...result.data, plan_id: newPlanId };
          })
          .catch(error => {
            this.setState({ error });
          });

        // Duplicate plan_startday
        url = APIServer + "/plan_startday/" + oldPlanId + "/" + newPlanId;
        await axios
          .post(url)
          .then(result => {
            if (result.data === null) alert("Could not duplicate plan_startday :(");
            // console.log(result);
          })
          .catch(error => {
            this.setState({ error });
            console.log(error);
          });

        // Duplicate plan_detail
        url = APIServer + "/plan_detail/" + oldPlanId + "/" + newPlanId;
        await axios
          .post(url)
          .then(result => {
            if (result.data === null) alert("Could not duplicate plan_detail :(");
            else
              this.setState({
                redirect: true,
                redirectTo: "/plan/" + newPlanId + redirect
              });
            // console.log(result);
          })
          .catch(error => {
            this.setState({ error });
            console.log(error);
          });
      }
      if (!isLoggedIn) {
        savedplan.plan_id = newPlanId;
        if (_planlist === null || _planlist === []) {
          _planlist = [savedplan];
          _planlist[0] = savedplan;
          localStorage.setItem("planlist", JSON.stringify(_planlist));
        } else {
          _planlist.push(savedplan);
          localStorage.setItem("planlist", JSON.stringify(_planlist));
        }
      }
    }
  };

  updatePlanOverview = async plan_overview => {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const url = APIServer + "/plan_overview/" + plan_id;
    await axios
      .put(url, plan_overview)
      .then(result => {
        // console.log(result);
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

  toggleToast = () => {
    this.setState({ toastOpen: !this.state.toastOpen });
  };

  toggleShareModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  checkEdit = async () => {
    //If user already edit the plan before, go to the edit plan page on the same url
    const { user_id, plan_id } = this.props;
    if (!this.props.isLoggedIn) {
      let _planlist = JSON.parse(localStorage.getItem("planlist"));
      let saved = false;
      _planlist.map(plan => {
        if (plan.plan_id === plan_id) saved = true;
        return null;
      });
      if (!saved) {
        this.saveToUser(0, "/edit_plan");
      } else {
        this.setState({
          redirect: true,
          redirectTo: "/plan/" + plan_id + "/edit_plan"
        });
      }
    } else {
      if (user_id === this.state.plan_overview.user_id) {
        this.setState({
          redirect: true,
          redirectTo: "/plan/" + plan_id + "/edit_plan"
        });
      }
      //Else if user not edit the plan before, create new url and go to that url edit plan page
      else {
        this.saveToUser(user_id, "/edit_plan");
      }
    }
  };

  calPlan = async plan_detail => {
    //// Need to be updated when transportations are added
    // console.log(transports);

    const { plan_startday } = this.state;
    let i = 0;
    for (i = 0; i < plan_detail.length; i++) {
      plan_detail[i].attraction_order = i;
    }
    for (i = 0; i < plan_startday.length; i++) {
      plan_startday[i].day = i + 1;
    }
    const transports = await this.getTransports();
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
    this.setState({ transports });
    return transports;
  };

  renderEditRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectTo} />;
    }
  };

  async componentDidMount() {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/load_plan/" + plan_id;
    await axios
      .get(url)
      .then(async result => {
        await this.setState({ ...result.data });
        // console.log(result);
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });
    if (!this.state.plan_overview) {
      this.setState({ error: true, isLoading: false });
      return;
    }

    let plan_detail = this.state.plan_detail;
    for (let i = 0; i < plan_detail.length; ++i) {
      if (plan_detail[i].attraction_id === 0) {
        await axios
          .get(APIServer + "/attraction/google_id/" + plan_detail[i].google_place_id)
          .then(res => {
            plan_detail[i] = { ...plan_detail[i], ...res.data[0] };
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
    this.setState(plan_detail);

    let days = [];
    for (let i = 1; i <= this.state.plan_overview.duration; i++) {
      await days.push(i);
    }
    await this.getTransports();

    await this.setState({ days: days });
    await this.setState({ isLoading: false });
    console.log("Fetching done...");
    this.calPlan(this.state.plan_detail);
    if (process.env.NODE_ENV === "production") {
      plan_detail = this.state.plan_detail;
      for (let i = 0; i < plan_detail.length; ++i) {
        await axios
          .get(APIServer + "/googlephoto/" + plan_detail[i].google_place_id)
          .then(res => {
            plan_detail[i] = { ...plan_detail[i], ...res.data[0] };
          })
          .catch(err => {
            console.log(err);
          });
      }
      this.setState(plan_detail);
    }
  }

  render() {
    const { isLoading, error, plan_overview, modal } = this.state;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Something went wrong :(</div>;
    else {
      return (
        <React.Fragment>
          <Toast isOpen={this.state.toastOpen}>
            <ToastHeader toggle={this.toggleToast}>Plan saved!</ToastHeader>
            <ToastBody>The plan is saved to your device, view it in plan page!</ToastBody>
          </Toast>

          {modal ? (
            <div className="share-modal">
              <Share toggleShareModal={this.toggleShareModal} />
            </div>
          ) : (
            <div></div>
          )}

          {this.renderEditRedirect()}
          <PlanOverview {...this.state} />
          <div className="title-bar">
            <div className="title">{plan_overview.city}</div>
            <div className="city">Plan</div>
            <div className="days">Map</div>
            <button className="white-button" onClick={this.save}>
              Save!
              <span style={{ fontSize: "15px" }}>
                <br />
                to device
              </span>
            </button>
            <button
              style={{ marginLeft: "10px" }}
              className="white-button2"
              onClick={this.checkEdit}
            >
              Edit!
              <span style={{ fontSize: "15px" }}>
                <br />
                this plan
              </span>
            </button>
          </div>
          <Container fluid>
            <Row>
              <Col lg={12}>
                <Timeline {...this.state} {...this.props} editing={false} />
              </Col>
            </Row>
          </Container>
        </React.Fragment>
      );
    }
  }
}

export default Plan;
