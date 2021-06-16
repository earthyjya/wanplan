import "../scss/Plan.scss";
import axios from "axios";
import PlanOverview from "./PlanOverview";
import React from "react";
import Share from "./Share";
import GGMap from "./GGMap/GGMap";
import Timeline from "./Timeline/Timeline";
import { Int2Str, Str2Int } from "../lib/ConvertTime.js";
import { Redirect } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { Toast, ToastBody, ToastHeader } from "reactstrap";
import MobileWarningToast from "../components/MobileWarningToast.js";
import { isMobileOnly } from "react-device-detect";
import DuplicatePlan from "../lib/managePlan/DuplicatePlan";
import { GetTransports, AssignTime } from "../lib/Transports";
import { ReorderDetail, ReorderStartday } from "../lib/Reorder";
import { GetPlanDetailExtraDatasPromises } from "../lib/GetData";
import { SaveNewPlanToCache } from "../lib/Cache";

class Plan extends React.Component {
  state = {
    attractions: [],
    days: [],
    error: null,
    isLoading: true,
    overviewLoaded: false,
    locationLoaded: false,
    tagLoaded: false,
    startdayLoaded: false,
    detailLoaded: false,
    reviewLoaded: false,
    transLoaded: false,
    modal: false,
    redirect: false,
    redirectTo: "/",
    toastOpen: false,
    transports: [],
    review: "",
    ratingList: [
      { id: 1, isChecked: false },
      { id: 2, isChecked: false },
      { id: 3, isChecked: false },
      { id: 4, isChecked: false },
      { id: 5, isChecked: false },
    ],
    rating: 0,
    mode: "plan",
    showMobileWarning: false,
    plan_city: [],
    plan_detail: [],
    plan_location: [],
    plan_overview: {},
    plan_review: [],
    plan_startday: [],
    plan_tag: [],
  };

  save = () => {
    this.toggleToast();
    const { user_id } = this.props;
    if (this.props.isLoggedIn) {
      this.saveToUser(user_id, "/");
    } else {
      this.saveToUser(0, "/");
    }
  };

  duplicatePlanToNewUser = async (user_id, redirect) => {
    const { isLoggedIn } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let oldPlanId = this.state.plan_overview.plan_id;
    this.setState({ isLoading: true });
    let data = await DuplicatePlan(APIServer, oldPlanId, user_id);
    let savedplan = { ...data.plan_overview, plan_id: data.plan_overview.id };
    if (!isLoggedIn) SaveNewPlanToCache(savedplan);
    this.setState({
      redirect: true,
      redirectTo: "/plan/" + data.plan_overview.id + redirect,
      plan_review: [],
      plan_overview: {
        ...data.plan_overview,
        plan_id: data.plan_overview.id,
      },
      isLoading: false,
    });
  };

  saveToUser = async (user_id, redirect) => {
    // console.log("start to save to user");
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (!_planlist) {
      localStorage.setItem("planlist", JSON.stringify([]));
      _planlist = [];
    }
    let saved = false;
    if (user_id === 0)
      _planlist.map((plan) => {
        if (plan.plan_id === this.state.plan_overview.plan_id) saved = true;
        return null;
      });
    if (user_id === this.state.plan_overview.user_id) saved = true;
    if (!saved) this.duplicatePlanToNewUser(user_id, redirect);
  };

  toggleToast = () => {
    this.setState({ toastOpen: !this.state.toastOpen });
  };

  toggleShareModal = () => {
    this.setState({ modal: !this.state.modal });
  };

  checkEdit = async () => {
    if (isMobileOnly) {
      this.setState({ showMobileWarning: true });
      return;
    }
    //If user already edit the plan before, go to the edit plan page on the same url
    const { user_id, plan_id } = this.props;
    if (!this.props.isLoggedIn) {
      let _planlist = JSON.parse(localStorage.getItem("planlist"));
      if (!_planlist) _planlist = [];
      let saved = false;
      _planlist.map((plan) => {
        if (plan.plan_id === plan_id) saved = true;
        return null;
      });
      if (!saved) {
        this.saveToUser(0, "/edit_plan");
      } else {
        this.setState({
          redirect: true,
          redirectTo: "/plan/" + plan_id + "/edit_plan",
        });
      }
    } else {
      if (user_id === this.state.plan_overview.user_id) {
        this.setState({
          redirect: true,
          redirectTo: "/plan/" + plan_id + "/edit_plan",
        });
      }
      //Else if user not edit the plan before, create new url and go to that url edit plan page
      else {
        this.saveToUser(user_id, "/edit_plan");
      }
    }
  };

  getTransports = async (plan_detail) => {
    const { days } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    return GetTransports(APIServer, plan_detail, days);
  };

  reArrangePlanDetail = (plan_detail, plan_startday, transports) => {
    plan_detail = ReorderDetail(plan_detail);
    plan_startday = ReorderStartday(plan_startday);
    plan_detail = AssignTime(plan_detail, plan_startday, transports);
    this.setState({
      plan_detail,
      plan_startday,
      isLoading: false,
      transLoaded: true,
      transports,
    });
  };

  calPlan = async (plan_detail) => {
    let { plan_startday } = this.state;
    if (plan_detail) {
      plan_detail = ReorderDetail(plan_detail);
      plan_startday = ReorderStartday(plan_startday);
      // find transports between each attraction in each day
      let transports = await this.getTransports(plan_detail);
      plan_detail = AssignTime(plan_detail, plan_startday, transports);
      // console.log(plan_detail)
      this.setState({
        plan_detail,
        plan_startday,
        isLoading: false,
        transLoaded: true,
        transports,
      });
    }
  };

  ratingChanged = (e) => {
    let { ratingList, rating } = this.state;
    ratingList = ratingList.map((item) =>
      item.id > e.target.name
        ? { ...item, isChecked: false }
        : { ...item, isChecked: true }
    );
    rating = e.target.name;
    this.setState({ ratingList: ratingList, rating: rating });
  };

  submitReview = async (e) => {
    let { rating, review } = this.state;
    let { plan_id } = this.props;
    this.setState({
      review: "",
      rating: 0,
      ratingList: [
        { id: 1, isChecked: false },
        { id: 2, isChecked: false },
        { id: 3, isChecked: false },
        { id: 4, isChecked: false },
        { id: 5, isChecked: false },
      ],
    });

    let url = process.env.REACT_APP_APIServer + "/plan_review";
    // console.log({ plan_id, review, rating });
    await axios
      .post(url, { plan_id, review, rating })
      .then(async (result) => {
        // console.log(result.data);
        this.setState({
          plan_review: [...this.state.plan_review, result.data],
        });
      })
      .catch((error) => {
        // this.setState({ error });
        console.log(error);
      });
  };

  reviewChanged = (e) => {
    this.setState({ review: e.target.value });
  };

  renderEditRedirect = () => {
    if (this.state.redirect) {
      window.history.pushState(this.state, "", window.location.href);
      return <Redirect to={this.state.redirectTo} />;
    }
  };

  modeMap = () => {
    this.setState({ mode: "map" });
  };

  modePlan = () => {
    this.setState({ mode: "plan" });
  };

  reqOverview = async (url, plan_id) =>
    axios.get(url + "/overview?planId=" + plan_id).then((res) => {
      this.setState({
        plan_overview: { ...this.state.plan_overview, ...res.data[0] },
        overviewLoaded: true,
      });
    });

  reqLocation = async (url, plan_id) =>
    axios.get(url + "/location?planId=" + plan_id).then((res) => {
      this.setState({
        plan_location: res.data,
        plan_overview: {
          ...this.state.plan_overview,
          city: res.data[0].city,
          city_id: res.data[0].city_id,
        },
        locationLoaded: true,
      });
    });

  reqTag = async (url, plan_id) =>
    axios.get(url + "/tag?planId=" + plan_id).then((res) => {
      this.setState({ plan_tag: res.data, tagLoaded: true });
    });

  reqStartday = async (url, plan_id) =>
    axios.get(url + "/startday?planId=" + plan_id).then((res) => {
      const days = res.data.reduce((acc, cur, idx) => [...acc, idx + 1], []);
      this.setState({
        plan_startday: res.data,
        days: days,
        startdayLoaded: true,
      });
      return res.data;
    });

  reqDetail = async (url, plan_id) =>
    axios.get(url + "/attraction?planId=" + plan_id).then(async (res) => {
      this.setState({ plan_detail: res.data });
      const APIServer = process.env.REACT_APP_APIServer;
      let plan_detail = res.data.map(async (plan) =>
        GetPlanDetailExtraDatasPromises(APIServer, plan)
      );
      let result = await Promise.all(plan_detail).then((subPlans) =>
        Promise.all(subPlans.map((plan) => Promise.all(plan)))
      );
      // then merge plan_detail from all 3 requests
      let plans = result.map((res) => {
        res = res.reduce((acc, dat) => {
          return { ...acc, ...dat };
        }, {});
        return res;
      });
      this.setState({ plan_detail: plans, detailLoaded: true });
      return plans;
    });

  reqReview = async (url, plan_id) =>
    axios.get(url + "/review?planId=" + plan_id).then((res) => {
      this.setState({ plan_review: res.data, reviewLoaded: true });
    });

  reqTransport = async (url, plan_id) =>
    axios
      .get(url + "/transport?planId=" + plan_id)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });

  async componentDidMount() {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const url = APIServer + "/load_plan/full";

    const req1 = this.reqOverview(url, plan_id);
    const req2 = this.reqLocation(url, plan_id);
    const req3 = this.reqTag(url, plan_id);
    const req4 = this.reqStartday(url, plan_id);
    const req5 = this.reqDetail(url, plan_id);
    const req6 = this.reqReview(url, plan_id);
    const req8 = this.reqTransport(url, plan_id);

    // resolve req4(plan_detail) and req5(plan_startday) then
    // calculate transportation time etc.
    Promise.all([req4, req5, req8])
      .then((res) => {
        if (this.state.days.length === 0) {
          console.log("days is empty");
          this.addDay(1);
        }
        if (res[2].length == 0) setTimeout(() => this.calPlan(res[1]), 15);
        let transports = this.state.days.map((day) =>
          res[2].filter((tran) => tran.day === day)
        );
        let plan_detail = AssignTime(res[1], res[0], this.state.transports);
        console.log(transports);
        this.reArrangePlanDetail(plan_detail, res[0], transports);
      })
      .catch((err) => {
        this.setState({
          detailLoaded: true,
          startdayLoaded: true,
          isLoading: false,
          transLoaded: true,
        });
        console.log(err);
      });

    // resolve all other requests
    Promise.all([req1, req2, req3, req6]).catch((err) => {
      this.setState({
        overviewLoaded: true,
        locationLoaded: true,
        tagLoaded: true,
        reviewLoaded: true,
      });
      console.log(err);
    });
  }

  render() {
    const {
      isLoading,
      error,
      plan_overview,
      modal,
      ratingList,
      plan_review,
      overviewLoaded,
      locationLoaded,
      reviewLoaded,
    } = this.state;
    if (!overviewLoaded) return <div>Loading...</div>;
    if (error) return <div>Something went wrong :(</div>;
    else {
      return (
        <React.Fragment>
          <Toast isOpen={this.state.toastOpen}>
            <ToastHeader toggle={this.toggleToast}>Plan saved!</ToastHeader>
            <ToastBody>
              The plan is saved to your device, view it in plan page!
            </ToastBody>
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
            {(() => {
              if (locationLoaded)
                return <div className="title">{plan_overview.city}</div>;
            })()}
            <div className="plan" onClick={this.modePlan}>
              Plan
            </div>
            <div className="map" onClick={this.modeMap}>
              Map
            </div>
            {(() => {
              if (!isLoading)
                return (
                  <React.Fragment>
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
                  </React.Fragment>
                );
            })()}
          </div>
          <div>
            <div>
              <div>
                {(() => {
                  if (this.state.mode === "plan")
                    return (
                      <Timeline
                        {...this.state}
                        {...this.props}
                        editing={false}
                      />
                    );
                  else if (this.state.mode === "map")
                    return (
                      <GGMap {...this.state} {...this.props} editing={false} />
                    );
                })()}
              </div>
            </div>
          </div>
          {(() => {
            if (reviewLoaded)
              return (
                <div className="review">
                  <div style={{ flexGrow: "0.8" }}>
                    <div>Reviews</div>
                    <div>
                      <textarea
                        className="addReview"
                        placeholder="add a review"
                        value={this.state.review}
                        rows={3}
                        onChange={this.reviewChanged}
                      />
                    </div>
                    <div>
                      {(() => {
                        if (plan_review) {
                          return plan_review.map((i) => {
                            return (
                              <React.Fragment>
                                <div className="review-box">
                                  <div>
                                    {i.rating === 0
                                      ? "No rating"
                                      : String.fromCharCode(0x2605).repeat(
                                          i.rating
                                        )}{" "}
                                  </div>
                                  <div>
                                    {i.review === "" ? "No comment" : i.review}
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          });
                        }
                      })()}
                    </div>
                  </div>
                  <div>
                    <div className="rating">
                      <div>Rating</div>
                      {(() =>
                        ratingList.map((item) => (
                          <label key={item.id}>
                            <div className="rating-container">
                              <input
                                type="checkbox"
                                value={item.id}
                                name={item.id}
                                checked={item.isChecked}
                                className="search-rating"
                                onChange={this.ratingChanged}
                              />
                            </div>
                          </label>
                        )))()}
                    </div>
                    <input
                      type="submit"
                      value="post"
                      className="postReview"
                      onClick={this.submitReview}
                    />
                  </div>
                </div>
              );
          })()}
          {(() => {
            return (
              <MobileWarningToast
                toggleToast={() => {
                  this.setState({
                    showMobileWarning: !this.state.showMobileWarning,
                  });
                }}
                isOpen={this.state.showMobileWarning}
              />
            );
          })()}
        </React.Fragment>
      );
    }
  }
}

export default Plan;
