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
import DuplicatePlan from "../lib/DuplicatePlan";

class Plan extends React.Component {
  state = {
    attractions: [],
    days: [],
    error: null,
    isLoading: true,
    modal: false,
    redirect: false,
    redirectTo: "/",
    toastOpen: false,
    transports: [],
    review: "",
    plan_review: [],
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

  saveToUser = async (user_id, redirect) => {
    // console.log("start to save to user");
    const { isLoggedIn } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let oldPlanId = this.state.plan_overview.plan_id;
    let newPlanId = 0;
    let savedplan = {};
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (!_planlist) {
      localStorage.setItem("planlist", JSON.stringify([]));
      _planlist = [];
    }
    if (user_id !== this.state.plan_overview.user_id || user_id === 0) {
      // console.log("set saved to false");
      let saved = false;
      if (user_id === 0) {
        _planlist.map((plan) => {
          if (plan.plan_id === this.state.plan_overview.plan_id) saved = true;
          return null;
        });
      }
      if (!saved) {
        // console.log("try to save to" + user_id);
        //Duplicate plan overview etc.
        this.setState({ isLoading: true });
        DuplicatePlan(APIServer, oldPlanId, user_id, async (data) => {
          // console.log(data);
          savedplan = { ...data.plan_overview, plan_id: data.plan_overview.id };
          if (!isLoggedIn) {
            if (_planlist === null || _planlist === []) {
              _planlist = [savedplan];
              _planlist[0] = savedplan;
              localStorage.setItem("planlist", JSON.stringify(_planlist));
            } else {
              _planlist.push(savedplan);
              localStorage.setItem("planlist", JSON.stringify(_planlist));
            }
          }
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
        });
      }
    }
  };

  // updatePlanOverview = async (plan_overview) => {
  //   const { plan_id } = this.props;
  //   const APIServer = process.env.REACT_APP_APIServer;
  //   const url = APIServer + "/plan_overview/" + plan_id;
  //   await axios
  //     .put(url, plan_overview)
  //     .then((result) => {
  //       // console.log(result);
  //     })
  //     .catch((error) => {
  //       this.setState({ error });
  //       console.log(error);
  //     });
  //   if (this.state.error) alert(this.state.error);
  //   else
  //     this.setState({
  //       plan_overview: { ...this.state.plan_overview, ...plan_overview },
  //     });
  // };

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

  calPlan = async (plan_detail) => {
    //// Need to be updated when transportations are added
    let { plan_startday } = this.state;
    if (plan_detail) {
      let i = 0;
      // give each plan attraction order
      plan_detail = plan_detail.reduce(
        (acc, cur, idx) => [...acc, { ...cur, attraction_order: idx }],
        []
      );
      // give each plan_startday the day
      plan_startday = plan_startday.reduce(
        (acc, cur, idx) => [...acc, { ...cur, day: idx + 1 }],
        []
      );
      // find transports between each attraction in each day
      let transports = [];
      await this.getTransports()
        .then((res) => {
          transports = res;
          // console.log(transports);
        })
        .catch((err) => {
          console.log(err);
        });

      let lastDay = 0;
      let lastTime = 0;
      let transTime = 0;
      let idx = 0;
      for (i = 0; i < plan_detail.length; i++) {
        if (plan_detail[i].day !== lastDay) {
          lastDay = plan_detail[i].day;
          idx = 0;
          if (transports[lastDay - 1]) {
            if (transports[lastDay - 1][idx])
              transTime =
                Math.ceil(transports[lastDay - 1][idx].value / 10) * 10;
            else transTime = 0;
          }
          lastTime = Str2Int(plan_startday[lastDay - 1].start_day) + transTime;
          ++idx;
        }
        plan_detail[i].start_time = Int2Str(lastTime);
        plan_detail[i].end_time = Int2Str(lastTime + plan_detail[i].time_spend);
        if (transports[lastDay - 1]) {
          if (transports[lastDay - 1][idx])
            transTime = Math.ceil(transports[lastDay - 1][idx].value / 10) * 10;
          else transTime = 0;
        }
        lastTime = lastTime + plan_detail[i].time_spend + transTime;
        // console.log(transTime);
        ++idx;
      }
    }
    this.setState({ plan_detail, plan_startday });
  };
  getTransports = async () => {
    const { days, plan_startday } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    let transports = [];
    // console.log(transports);
    transports = days.reduce(async (acc, day) => {
      console.log([...(await acc)]);
      let dayTrans = [];
      let places = this.state.plan_detail.filter((det) => det.day === day);
      let lastPlace = { attraction_name: "Hotel" };
      if (places)
        dayTrans = places.reduce(async (acc1, cur1, idx1) => {
          
          if (idx1 === 0) lastPlace = { attraction_name: "Hotel" };
          else lastPlace = places[idx1 - 1];
          if (
            !lastPlace.google_place_id ||
            !places[idx1].google_place_id ||
            lastPlace.google_place_id == undefined ||
            places[idx1].google_place_id == undefined
          ) {
            acc1 = [
              ...(await acc1),
              {
                key: idx1,
                text: "No transportation data",
                value: 0,
              },
            ];
            
          } else {
            let url =
              APIServer +
              "/googletransport/" +
              places[idx1 - 1].google_place_id +
              "/" +
              places[idx1].google_place_id;
            await axios
              .get(url)
              .then(async (res) => {
                acc1 = [
                  ...(await acc1),
                  {
                    text: res.data.duration.text,
                    mode: res.data.mode,
                    value: res.data.duration.value / 60,
                    distance: res.data.distance.text,
                  },
                ];
              })
              .catch((err) => {
                console.log(err);
              });
          }
          return [...(await acc1)];
        }, []);
      return [...(await acc), [...(await dayTrans)]];
    }, []);
    console.log([...(await transports)])
    this.setState({ transports: [...(await transports)] });
    return [...(await transports)];
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

  async componentDidMount() {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/load_plan/full?planId=" + plan_id;
    await axios
      .get(url)
      .then(async (result) => {
        console.log(result.data)
        await this.setState({ ...result.data });
        await this.setState({
          plan_overview: {
            ...this.state.plan_overview,
            city: result.data.plan_city[0].city,
            city_id: result.data.plan_city[0].city_id,
          },
        });
        if (result.data.plan_review == null) this.setState({ plan_review: [] });
      })
      .catch((error) => {
        // this.setState({ error });
        console.log(error);
      });
    if (!this.state.plan_overview) {
      this.setState({ error: true, isLoading: false });
      return;
    }

    let plan_detail = this.state.plan_detail;

    plan_detail = this.state.plan_detail.reduce(async (acc,plan) => {
      url = APIServer + "/googleplace/" + plan.google_place_id
      let data = {...plan,}
      console.log([acc])
      await axios
      .get(url)
      .then(async (result) => {
        console.log({...plan, ...result.data[0]})
        data ={...data, ...result.data[0]}
      })
      .catch(async (error) => {
        // this.setState({ error });
        console.log(error);
      })
      if (plan.attraction_id === 0) {
        await axios
          .get(
            APIServer +
              "/attraction/google_id/" +
              plan.google_place_id
          )
          // eslint-disable-next-line
          .then((res) => {
            data ={...data, ...res.data[0]}
          })
          .catch((err) => {
            console.log(err);
          });
      }
      acc = [...await acc, {...data}]
      return [...await acc]
    }
      ,[])
    this.setState({plan_detail: [...await plan_detail]});
    // console.log(plan_detail)

    let days = [];
    for (let i = 1; i <= this.state.plan_overview.duration; i++) {
      await days.push(i);
    }
    await this.getTransports().then((res) => {console.log(res)}).catch(err => console.log(err));
    console.log(this.state.transports)
    await this.setState({ days: days });
    await this.setState({ isLoading: false });
    // console.log("Fetching done...");
    // console.log(this.state.plan_detail, this.state.plan_startday);
    await this.calPlan([...await this.state.plan_detail]);
    if (process.env.NODE_ENV === "production") {
      plan_detail = this.state.plan_detail;
      for (let i = 0; i < plan_detail.length; ++i) {
        await axios
          .get(APIServer + "/googlephoto/" + plan_detail[i].google_place_id)
          .then((res) => {
            plan_detail[i] = { ...plan_detail[i], ...res.data[0] };
          })
          .catch((err) => {
            console.log(err);
          });
      }
      this.setState(plan_detail);
    }
  }

  render() {
    const {
      isLoading,
      error,
      plan_overview,
      modal,
      ratingList,
      plan_review,
    } = this.state;
    if (isLoading) return <div>Loading...</div>;
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
            <div className="title">{plan_overview.city}</div>
            <div className="plan" onClick={this.modePlan}>
              Plan
            </div>
            <div className="map" onClick={this.modeMap}>
              Map
            </div>
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
                    return(
                  plan_review.map((i) => {
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
                          <div>{i.review === "" ? "No comment" : i.review}</div>
                        </div>
                      </React.Fragment>
                    );
                  }))
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
