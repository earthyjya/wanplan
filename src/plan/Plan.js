import "../scss/Plan.scss";
import axios from "axios";
import PlanOverview from "./PlanOverview";
import React from "react";
import Share from "./Share";
import Timeline from "./Timeline/Timeline";
import { Redirect } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { Toast, ToastBody, ToastHeader } from "reactstrap";

class Plan extends React.Component {
  state = {
    isLoading: true,
    error: null,
    modal: false,
    toastOpen: false,
    days: [],
    attraction: [],
    redirect: false,
    redirectTo: "/"
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
    const { APIServer, isLoggedIn } = this.props;
    let oldPlanId = this.state.plan_overview.plan_id;
    let newPlanId = 0;
    let savedplan = {};
    if (user_id !== this.state.plan_overview.user_id || user_id === 0) {
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
      if (localStorage.getItem("planlist") === null || localStorage.getItem("planlist") === []) {
        var _planlist = [savedplan];
        _planlist[0] = savedplan;
        localStorage.setItem("planlist", JSON.stringify(_planlist));
      } else {
        let _planlist = JSON.parse(localStorage.getItem("planlist"));
        _planlist.push(savedplan);
        localStorage.setItem("planlist", JSON.stringify(_planlist));
      }
    }
  };

  updatePlanOverview = async plan_overview => {
    const { APIServer, plan_id } = this.props;
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
    const { user_id } = this.props;
    if (!this.props.isLoggedIn) {
      this.saveToUser(0, "/edit_plan");
    } else {
      if (user_id === this.state.plan_overview.user_id) {
        this.setState({
          redirect: true,
          redirectTo: "/plan/" + this.props.plan_id + "/edit_plan"
        });
      }
      //Else if user not edit the plan before, create new url and go to that url edit plan page
      else {
        this.saveToUser(user_id, "/edit_plan");
      }
    }
  };

  renderEditRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirectTo} />;
    }
  };

  async componentDidMount() {
    const { APIServer, plan_id } = this.props;
    let url = APIServer + "/load_plan/" + plan_id;
    let i = 0;
    await axios
      .get(url)
      .then(result => {
        this.setState({ ...result.data });
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

    let days = [];
    for (i = 1; i <= this.state.plan_overview.duration; i++) {
      await days.push(i);
    }

    await this.setState({ days: days, isLoading: false });

    // console.log("Fetching done...");
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
