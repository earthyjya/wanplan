import "../scss/EditPlan.scss";
import AttBar from "./AttBar/AttBar";
import axios from "axios";
import EditPlanContent from "./EditPlanContent";
import EditPlanOverview from "./EditPlanOverview";
import React from "react";
import Request from "../lib/Request.js";
import Share from "./Share";
import GGMap from "./GGMap/GGMap";
import PlanCover from "./PlanCover";
import Timeline from "./Timeline/Timeline";
import AttModal from "./AttModal.js";
import { DragDropContext } from "react-beautiful-dnd";
import { Redirect } from "react-router-dom";
import { Row, Col, Container, Toast, ToastBody, ToastHeader } from "reactstrap";
import UpdatePlan, {
  UpdateOverview,
  UpdateStartday,
  UpdateLocation,
  UpdateDetail,
} from "../lib/managePlan/UpdatePlan";
import { UpdatePlanInCache } from "../lib/Cache.js";
import { GetTransports, AssignTime } from "../lib/Transports";
import { ReorderDetail, ReorderStartday } from "../lib/Reorder";
import {
  GetPlanDetailExtraDatas,
  GetPlanDetailExtraDatasPromises,
} from "../lib/GetData";
import SearchPlaceNearbyCity, {
  FindNearby,
} from "../lib/SearchPlaceNearbyCity";
import { AddNewPlanToPlanDetail } from "../lib/DealWithAttCard";

class EditPlan extends React.Component {
  state = {
    attraction: [],
    days: [],
    dropdownOpen: false,
    editTitle: false,
    error: null,
    isUpdating: false,
    isLoading: true,
    overviewLoaded: false,
    locationLoaded: false,
    tagLoaded: false,
    startdayLoaded: false,
    detailLoaded: false,
    reviewLoaded: false,
    cityLoaded: false,
    nearbyLoaded: false,
    nearbyOption: "tourist_attraciton",
    transLoaded: false,
    editPlanOverviewKey: 0,
    modal: false,
    publishToast: false,
    redirect: false,
    redirectTo: "/",
    transports: [],
    updateToast: false,
    showAttModal: false,
    planCover: false,
    selectedCover: null,
    detailsDat: null,
    mode: "plan",
    cities: [],
    nearbyCenter: null,
    plan_city: [],
    plan_detail: [],
    plan_location: [],
    plan_overview: {},
    plan_review: [],
    plan_startday: [],
    plan_tag: [],
    nearbyPlaces: [],
    searchedPlace: {},
  };

  updatePlan = async () => {
    const {
      plan_overview,
      plan_startday,
      plan_detail,
      plan_location,
    } = this.state;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const toUpdate = {
      plan_overview,
      plan_startday,
      plan_detail,
      plan_location: plan_location[0],
    };
    this.setState({ isUpdating: true });

    //update current plan
    // this.toggleUpdateToast();
    await UpdatePlan(APIServer, plan_id, toUpdate);
    this.setState({
      redirect: true,
      redirectTo: "/plan/" + this.props.plan_id,
    });
  };

  updatePlanNoRedirect = async () => {
    const {
      plan_overview,
      plan_startday,
      plan_detail,
      plan_location,
    } = this.state;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const toUpdate = {
      plan_overview,
      plan_startday,
      plan_detail,
      plan_location: plan_location[0],
    };
    //update current plan
    // this.toggleUpdateToast();
    UpdatePlan(APIServer, plan_id, toUpdate);
  };

  updatePlanOverview = async (plan_overview) => {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const old_plan_overview = this.state.plan_overview;
    this.setState({
      plan_overview: { ...old_plan_overview, ...plan_overview },
    });
    await UpdateOverview(APIServer, plan_id, { plan_overview });

    if (old_plan_overview.city_id !== plan_overview.city_id)
      this.updatePlanCity(plan_overview);

    UpdatePlanInCache(plan_id, plan_overview);
  };

  updatePlanCity = async (plan_overview) => {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let plan_location = {
      plan_id: plan_id,
      city_id: plan_overview.city_id,
    };
    await UpdateLocation(APIServer, plan_id, { plan_location });
    this.setState({
      plan_location: [plan_location],
      plan_overview: {
        ...this.state.plan_overview,
        ...plan_location,
      },
    });
    this.searchPlaceNearbyCity();
  };

  showDetails = async (dat) => {
    const APIServer = process.env.REACT_APP_APIServer;
    this.setState({ detailsDat: dat });
    let res = await FindNearby(
      APIServer,
      dat.geometry.location.lat,
      dat.geometry.location.lng,
      this.state.nearbyOption,
      1500
    );
    this.setState({ nearbyPlaces: res });
  };

  updateStartdayTime = (day, time) => {
    const { plan_startday, plan_detail } = this.state;
    plan_startday[day - 1].start_day = time;
    this.setState({ plan_startday });
    setTimeout(async () => {
      await this.calPlan(plan_detail);
    }, 15);
  };

  updatePlanStartday = async () => {
    const { plan_id } = this.props;
    const { plan_startday } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    UpdateStartday(APIServer, plan_id, { plan_startday });
  };

  updatePlanDetails = async () => {
    //update current plan
    const { plan_id } = this.props;
    const { plan_detail } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    UpdateDetail(APIServer, plan_id, { plan_detail });
  };

  updateOnePlanDetail = async (order) => {
    const plan_id = this.props.plan_id;
    const detail = this.state.plan_detail[order];
    const APIServer = process.env.REACT_APP_APIServer;
    const url = APIServer + "/plan_detail/" + plan_id + "/" + order;
    // console.log(url);
    await axios
      .put(url, detail)
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
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

  toggleAttModal = () => {
    this.setState({ showAttModal: !this.state.showAttModal });
  };

  toggleDropDown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  togglePlanCover = () => {
    this.setState({ planCover: !this.state.planCover });
  };

  fileSelectedHandler = (e) => {
    this.setState({ selectedCover: e.target.files[0] });
  };

  modeMap = () => {
    this.setState({ mode: "map" });
  };

  modePlan = () => {
    this.setState({ mode: "plan" });
  };

  uploadSelectedCover = async () => {
    if (!this.state.selectedCover) {
      console.log("No file is selected"); // In case the no file is selected.
    } else {
      // console.log(this.state.selectedCover);
      // console.log(this.state.selectedCover.type);
      const { plan_id } = this.props;
      let url = "";
      // let options = {
      //   headers: {
      //     "Content-Type": this.state.selectedCover.type,
      //     type: this.state.selectedCover.type,
      //     plan_id: "" + plan_id
      //   }
      // };
      // await axios
      //   .put(process.env.REACT_APP_APIServer + "/plan_cover",this.state.selectedCover,  options)
      //   .then(res => {
      //     console.log(res);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
      await axios
        .post(process.env.REACT_APP_APIServer + "/plan_cover", {
          plan_id,
          type: this.state.selectedCover.type,
        })
        .then((res) => {
          // console.log(res);
          url = res.data;
          let options = {
            headers: {
              "Content-Type": this.state.selectedCover.type,
            },
          };

          return axios.put(url, this.state.selectedCover, options);
        })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  getTransports = async (plan_detail) => {
    const { days } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    return GetTransports(APIServer, plan_detail, days);
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

  addDay = (day) => {
    let { days, plan_overview, plan_detail, plan_startday } = this.state;
    days = days.concat(days.length + 1);
    plan_overview.duration += 1;
    plan_startday.splice(day, 0, {
      plan_id: this.props.plan_id,
      day: day,
      start_day: "09:00",
    });
    // console.log(plan_startday);
    plan_detail.map((detail) => {
      if (detail.day > day) detail.day += 1;
      return null;
    });
    this.setState({
      days,
      plan_overview,
      plan_startday,
    });
    setTimeout(() => this.calPlan(plan_detail), 15);
    this.updatePlanOverview(plan_overview);
    this.updatePlanStartday();
    this.updatePlanDetails();
  };

  delDay = (day) => {
    let { days, plan_overview, plan_detail, plan_startday } = this.state;
    days.pop();
    plan_overview.duration -= 1;
    plan_startday.splice(day - 1, 1);
    // console.log(plan_startday);
    plan_detail = plan_detail.filter((plan) => plan.day !== day);
    plan_detail.map((detail) => {
      if (detail.day >= day) detail.day -= 1;
      return null;
    });
    this.setState({
      days,
      plan_overview,
      plan_startday,
    });
    setTimeout(async () => {
      await this.calPlan(plan_detail);
      this.updatePlanOverview(plan_overview);
      this.updatePlanStartday();
      this.updatePlanDetails();
    }, 15);
  };

  reorderCards = (source, destination) => {
    // console.log(source, destination);
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
    this.setState(plan_detail);
    // console.log(plan_detail);
    this.setState({ transLoaded: false });
    setTimeout(async () => {
      await this.calPlan(plan_detail);
      this.updatePlanOverview(this.state.plan_overview);
      this.updatePlanStartday();
      this.updatePlanDetails();
    }, 15);
  };

  copyNameFromAttBar = (tail, index) => {
    let name = "";
    if (tail === "bar" && index !== 0)
      name = this.state.nearbyPlaces[index].name;
    else if (tail === "Bar") name = this.state.detailsDat.name;
    else name = this.state.searchedPlace.attraction_name;
    return name;
  };

  addNewPlanToPlanDetail = (plan_detail, index, toAdd) => {
    plan_detail = AddNewPlanToPlanDetail(plan_detail, index, toAdd);
    this.setState({ plan_detail, transLoaded: false });
    return plan_detail;
  };

  replacePlanInPlanDetail = (plan_detail, index, toReplace) => {
    plan_detail.splice(index, 1);
    plan_detail.splice(index, 0, toReplace);
    this.setState({ plan_detail });
    return plan_detail;
  };

  addCard = async (source, destination) => {
    let { droppableId, index } = destination;
    let { plan_detail } = this.state;
    let sourceId = source.droppableId;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const tail = sourceId.slice(sourceId.length - 3, sourceId.length);
    const google_place_id = sourceId.slice(0, sourceId.length - 3);

    const name = this.copyNameFromAttBar(tail, source.index);
    let toAdd = {
      attraction_name: name,
      plan_id,
      time_spend: 30, //// Can be changed to "recommended time"
      description: "",
      attraction_order: index,
      day: Number(droppableId),
    };

    plan_detail = this.addNewPlanToPlanDetail(plan_detail, index, toAdd);
    setTimeout(async () => {
      let results = await GetPlanDetailExtraDatas(APIServer, google_place_id);
      results = { ...plan_detail[index], ...results };
      plan_detail = this.replacePlanInPlanDetail(plan_detail, index, results);
      await this.calPlan(plan_detail);
      this.updatePlanDetails();
    }, 15);
  };

  delCard = (index) => {
    const { plan_detail } = this.state;
    plan_detail.splice(index, 1);
    this.setState({ plan_detail });
    this.setState({ transLoaded: false });
    setTimeout(async () => {
      await this.calPlan(plan_detail);
      this.updatePlanDetails();
    }, 15);
  };

  addFreeTime = (order, day) => {
    let { plan_detail } = this.state;
    const { plan_id } = this.props;
    let toAdd = {
      plan_id,
      time_spend: 30, //// Can be changed to "recommended time"
      description: "",
      attraction_order: order,
      day: day,
      google_place_id: "freetime",
    };
    plan_detail = this.addNewPlanToPlanDetail(plan_detail, order, toAdd);
    setTimeout(async () => {
      await this.calPlan(plan_detail);
      this.updatePlanDetails();
    }, 15);
  };

  changeDuration = (source, newDuration) => {
    const { plan_detail } = this.state;
    plan_detail[source].time_spend = Number(newDuration);
    setTimeout(async () => {
      await this.calPlan(plan_detail);
      this.updateOnePlanDetail(source);
    }, 15);
  };

  updateDescription = (source, newDescription) => {
    const { plan_detail } = this.state;
    plan_detail[source].description = newDescription;
    this.setState({ plan_detail });
    this.updateOnePlanDetail(source);
  };

  updateTitle = (source, newTitle) => {
    const { plan_detail } = this.state;
    plan_detail[source].attraction_name = newTitle;
    this.setState({ plan_detail });
    this.updateOnePlanDetail(source);
  };

  setNearbyOption = async (type) => {
    const APIServer = process.env.REACT_APP_APIServer;
    this.setState({ nearbyOption: type });
    let res = await FindNearby(
      APIServer,
      this.state.detailsDat.geometry.location.lat,
      this.state.detailsDat.geometry.location.lng,
      type,
      1500
    );
    this.setState({ nearbyPlaces: res });
  };

  updateNearby = (dat) => {
    this.setState({ nearbyCenter: dat });
  };

  searchPlaceNearbyCity = async () => {
    const APIServer = process.env.REACT_APP_APIServer;
    const { plan_overview } = this.state;
    const res = await SearchPlaceNearbyCity(APIServer, plan_overview);
    this.setState({ nearbyPlaces: res, nearbyLoaded: true });
  };

  setSearchedPlace = async (place) => {
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/googleplace/" + place.place_id;
    this.setState({ searchedPlace: {}, nearbyPlaces: [] });
    let res = await axios
      .get(url)
      .then((res) => res)
      .catch((err) => console.log(err));

    this.setState({ searchedPlace: res.data[0] });

    res = await FindNearby(
      APIServer,
      res.data[0].geometry.location.lat,
      res.data[0].geometry.location.lng,
      this.state.nearbyOption,
      1500
    );
    this.setState({ nearbyPlaces: res });
  };

  renderRedirect = () => {
    if (this.state.redirect) {
      window.history.pushState(this.state, "", window.location.href);
      return <Redirect to={this.state.redirectTo} />;
    }
  };

  reloadPlanOverview = async () => {
    this.setState({ editPlanOverviewKey: this.state.editPlanOverviewKey + 1 });
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
    axios
      .get(url + "/startday?planId=" + plan_id)
      .then((res) => {
        const days = res.data.reduce((acc, cur, idx) => [...acc, idx + 1], []);
        this.setState({
          plan_startday: res.data,
          days: days,
          startdayLoaded: true,
        });
      })
      .catch((err) => {
        this.setState({ startdayLoaded: true });
        console.log(err);
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

  reqCity = async (APIServer) =>
    axios.get(APIServer + "/city").then((res) => {
      this.setState({
        cities: res.data,
        cityLoaded: true,
      });
    });

  reqDataAll = async (APIServer, plan_id) => {
    const url = APIServer + "/load_plan/full";
    // console.log(url + "/overview?planId=" + plan_id);
    const req1 = this.reqOverview(url, plan_id);
    const req2 = this.reqLocation(url, plan_id);
    const req3 = this.reqTag(url, plan_id);
    const req4 = this.reqStartday(url, plan_id);
    const req5 = this.reqDetail(url, plan_id);
    const req6 = this.reqReview(url, plan_id);
    const req7 = this.reqCity(APIServer);

    //resolve req1 (overview) and req3 (location)
    // then search for nearby places
    Promise.all([req1, req2])
      .then(() => setTimeout(() => this.searchPlaceNearbyCity(), 15))
      .catch((err) => {
        this.setState({
          nearbyLoaded: true,
          overviewLoaded: true,
          locationLoaded: true,
        });
        console.log(err);
      });

    //resolve req4(planstartday) and req5(plandetail)
    Promise.all([req4, req5])
      .then((res) => setTimeout(() => this.calPlan(res[1]), 15))
      .catch((err) => {
        this.setState({
          isLoading: false,
          transLoaded: true,
          detailLoaded: true,
          startdayLoaded: true,
        });
        console.log(err);
      });

    //resolve other requests
    Promise.all([req3, req6, req7]).catch((err) => {
      this.setState({ tagLoaded: true, reviewLoaded: true, cityLoaded: true });
      console.log(err);
    });
  };

  async componentDidMount() {
    // Since it has to fetch three times, we fetch it here and store the data in the state
    console.log("didMount");
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    this.reqDataAll(APIServer, plan_id);
    // setInterval(() => this.reqDataAll(APIServer, plan_id), 10000);
    this.toggleAttModal = this.toggleAttModal.bind(this);
  }

  render() {
    const {
      isLoading,
      error,
      plan_overview,
      plan_city,
      modal,
      editTitle,
      planCover,
      overviewLoaded,
      locationLoaded,
      cityLoaded,
      isUpdating,
      editPlanOverviewKey,
    } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    if (!overviewLoaded) return <div>Loading...</div>;
    if (error) return <div>Something went wrong :(</div>;
    else {
      return (
        <React.Fragment>
          {this.renderRedirect()}
          {(() => {
            if (isUpdating) return <div>Updating...</div>;
            else
              return (
                <React.Fragment>
                  <AttModal
                    detail={this.state.detailsDat}
                    toggle={this.toggleAttModal}
                    isOpen={this.state.showAttModal}
                  />
                  <DragDropContext
                    onDragEnd={({ destination, source }) => {
                      if (!destination) {
                        return;
                      }

                      if (
                        source.droppableId.slice(
                          source.droppableId.length - 3,
                          source.droppableId.length
                        ) !== "bar" &&
                        source.droppableId.slice(
                          source.droppableId.length - 3,
                          source.droppableId.length
                        ) !== "Bar"
                      )
                        this.reorderCards(source, destination);
                      else this.addCard(source, destination);
                    }}
                  >
                    <div className="editplan-container">
                      <div className="timeline-container">
                        {(() => {
                          if (locationLoaded)
                            return (
                              <EditPlanOverview
                                key={editPlanOverviewKey}
                                {...this.state}
                                updatePlanOverview={this.updatePlanOverview}
                                togglePlanCover={this.togglePlanCover}
                              />
                            );
                          return;
                        })()}

                        <div className="title-bar">
                          {(() => {
                            if (locationLoaded)
                              return (
                                <div className="title">
                                  {plan_overview.city}
                                </div>
                              );
                          })()}
                          <div className="plan" onClick={this.modePlan}>
                            Plan
                          </div>
                          <div className="map" onClick={this.modeMap}>
                            Map
                          </div>
                          <div>
                            {/* eslint-disable-next-line */}
                            {(() => {
                              if (locationLoaded && cityLoaded)
                                return (
                                  <i
                                    className="fa fa-pencil-square-o fa-fw"
                                    aria-hidden="true"
                                    onClick={this.toggleEditPlanContent}
                                  />
                                );
                            })()}
                          </div>
                          {/*<button className="white-button" onClick={this.toggleShareModal}>
                    Share!
                    <span style={{ fontSize: "15px" }}>
                      <br />
                      this plan
                    </span>
                  </button>*/}
                          {(() => {
                            if (!isLoading)
                              return (
                                <button
                                  className="white-button"
                                  onClick={this.updatePlan}
                                >
                                  Update!
                                  <span style={{ fontSize: "15px" }}>
                                    <br />
                                    this plan
                                  </span>
                                </button>
                              );
                          })()}
                        </div>
                        {(() => {
                          if (this.state.mode === "plan")
                            return (
                              <Timeline
                                {...this.state}
                                {...this.props}
                                addDay={this.addDay}
                                delDay={this.delDay}
                                changeDuration={this.changeDuration}
                                updateTitle={this.updateTitle}
                                updateDescription={this.updateDescription}
                                delCard={this.delCard}
                                editing={true}
                                toggleAttModal={this.toggleAttModal}
                                showDetails={this.showDetails}
                                addFreeTime={this.addFreeTime}
                                updateNearby={this.updateNearby}
                                updateStartdayTime={this.updateStartdayTime}
                              />
                            );
                          else if (this.state.mode === "map")
                            return (
                              <GGMap
                                {...this.state}
                                {...this.props}
                                editing={true}
                              />
                            );
                        })()}
                      </div>
                      {(() => {
                        if (this.state.mode === "plan") {
                          if (locationLoaded)
                            return (
                              <div className="attbar-container">
                                <AttBar
                                  toggleAttModal={this.toggleAttModal}
                                  showDetails={this.showDetails}
                                  setSearchedPlace={this.setSearchedPlace}
                                  setNearbyOption={this.setNearbyOption}
                                  {...this.state}
                                />
                              </div>
                            );
                        }
                      })()}
                    </div>
                  </DragDropContext>
                  <Toast isOpen={this.state.updateToast}>
                    <ToastHeader toggle={this.toggleUpdateToast}>
                      Plan updated!
                    </ToastHeader>
                    <ToastBody>
                      If you want to save this plan, please sign-in or copy the
                      url. This plan will now show on 'My plan'.
                    </ToastBody>
                  </Toast>
                  <Toast isOpen={this.state.publishToast}>
                    <ToastHeader toggle={this.togglePublishToast}>
                      Plan published!
                    </ToastHeader>
                    <ToastBody>
                      The plan is opended to public. It will be available for
                      other user
                    </ToastBody>
                  </Toast>

                  {modal ? (
                    <div className="share-modal">
                      <Share toggleShareModal={this.toggleShareModal} />
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {planCover ? (
                    <div className="upload-plan-cover">
                      <PlanCover
                        togglePlanCover={this.togglePlanCover}
                        fileSelectedHandler={this.fileSelectedHandler}
                        uploadSelectedCover={this.uploadSelectedCover}
                      />
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
                        reloadPlanOverview={this.reloadPlanOverview}
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </React.Fragment>
              );
          })()}
        </React.Fragment>
      );
    }
  }
}

export default EditPlan;
