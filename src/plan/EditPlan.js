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
  UpdateTransport,
} from "../lib/managePlan/UpdatePlan";
import { UpdatePlanInCache } from "../lib/Cache.js";
import {
  GetTransports,
  AssignTime,
  GetTransportsBetween2Places,
} from "../lib/Transports";
import {
  ReorderDetail,
  ReorderStartday,
  ReorderTransport,
} from "../lib/Reorder";
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
      transports,
    } = this.state;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const toUpdate = {
      plan_overview,
      plan_startday,
      plan_detail,
      plan_location: plan_location[0],
      transports,
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
      transports,
    } = this.state;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const toUpdate = {
      plan_overview,
      plan_startday,
      plan_detail,
      plan_location: plan_location[0],
      transports,
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

  updateTransport = async (transports) => {
    //update current plan
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    UpdateTransport(APIServer, plan_id, { transports });
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

  updateOneTransport = async (day, order, transports) => {
    const plan_id = this.props.plan_id;
    const detail = transports[day - 1][order];
    const APIServer = process.env.REACT_APP_APIServer;
    const url = APIServer + "/transport/" + plan_id + "/" + day + "/" + order;
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

  addDay = (day) => {
    let { days, plan_overview, plan_detail, plan_startday, transports } =
      this.state;
    days = days.concat(days.length + 1);
    plan_overview.duration += 1;
    plan_startday.splice(day, 0, {
      plan_id: this.props.plan_id,
      day: day,
      start_day: "09:00",
    });
    plan_startday = ReorderStartday(plan_startday);
    transports.splice(day, 0, []);
    transports = ReorderTransport(transports);
    // console.log(plan_startday);
    plan_detail.map((detail) => {
      if (detail.day > day) detail.day += 1;
      return null;
    });
    this.setState({
      days,
      plan_overview,
      plan_startday,
      plan_detail,
      transports,
    });
    // setTimeout(() => this.calPlan(plan_detail), 15);
    this.reArrangePlanDetail(plan_detail, plan_startday, transports);
    this.updatePlanOverview(plan_overview);
    this.updatePlanStartday();
    this.updatePlanDetails();
    this.updateTransport(transports);
  };

  delDay = (day) => {
    let { days, plan_overview, plan_detail, plan_startday, transports } =
      this.state;
    days.pop();
    plan_overview.duration -= 1;
    plan_startday.splice(day - 1, 1);
    // plan_startday = ReorderStartday(plan_startday);
    transports.splice(day - 1, 1);
    transports = ReorderTransport(transports);
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
      transports,
      plan_detail,
    });
    setTimeout(async () => {
      // await this.calPlan(plan_detail);
      this.reArrangePlanDetail(plan_detail.plan_startday, transports);
      this.updatePlanOverview(plan_overview);
      this.updatePlanStartday();
      this.updatePlanDetails();
      this.updateTransport(transports);
    }, 15);
  };

  loadNewTrans = async (
    new_plan_detail,
    transports,
    day,
    trans_order,
    index
  ) => {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    if (index === 0 || new_plan_detail[index - 1].day !== day) {
      // console.log(index,new_plan_detail[index - 1].day)
      transports[day - 1][trans_order] = {
        plan_id,
        day,
        trans_order,
        text: "No transportation data",
      };
    } else {
      transports[day - 1][trans_order] = await GetTransportsBetween2Places(
        APIServer,
        new_plan_detail[index - 1].google_place_id,
        new_plan_detail[index].google_place_id
      );
      transports[day - 1][trans_order] = {
        ...transports[day - 1][trans_order],
        plan_id,
        day,
        trans_order,
      };
    }
    return transports;
  };

  transDelCard = async (new_plan_detail, transports, index, day, trans_order) => {
    // let { plan_detail } = this.state;
    // let day = plan_detail[index].day;
    transports[day - 1].splice(trans_order, 1);
    // console.log(plan_detail.filter((plan) => plan.day === day)[0])
    // console.log(trans_order)
    // console.log(transports)
    if (trans_order < transports[day - 1].length)
      transports = await this.loadNewTrans(
        new_plan_detail,
        transports,
        day,
        trans_order,
        index
      );
    transports = ReorderTransport(transports);
    console.log(transports)
    return transports;
  };

  transAddCard = async (new_plan_detail, transports, index, day, trans_order) => {
    const { plan_id } = this.props;
    if (trans_order < transports[day - 1].length)
      transports = await this.loadNewTrans(
        new_plan_detail,
        transports,
        day,
        trans_order,
        index + 1
      );
    transports[day - 1].splice(trans_order, 0, null);
    transports = await this.loadNewTrans(
      new_plan_detail,
      transports,
      day,
      trans_order,
      index
    );
    transports = ReorderTransport(transports);
    console.log(transports)
    return transports;
  };

  reorderCards = async (source, destination) => {
    // console.log(source, destination);
    let { plan_detail, transports, plan_startday } = this.state;
    let a = source.index;
    let b = destination.index;
    const daya = Number(source.droppableId);
    const dayb = Number(destination.droppableId);
    const trans_order_a =
    a -
    plan_detail.filter((plan) => plan.day === daya)[0].attraction_order;
    const trans_order_b =
    b -
    plan_detail.filter((plan) => plan.day === dayb)[0].attraction_order;
    let [removed] = plan_detail.splice(a, 1);
    transports = await this.transDelCard(plan_detail, transports, a, daya, trans_order_a);
    removed.day = dayb;
    if (a < b && daya !== dayb && b !== 0) b -= 1;
    plan_detail.splice(b, 0, removed);
    plan_detail.sort((a, b) => a.day - b.day);
    transports = await this.transAddCard(plan_detail, transports, b, dayb, trans_order_b);
    this.setState({ plan_detail, transports });
    setTimeout(async () => {
      // await this.calPlan(plan_detail);
      this.reArrangePlanDetail(plan_detail, plan_startday, transports);
      this.updatePlanOverview(this.state.plan_overview);
      this.updatePlanStartday();
      this.updatePlanDetails();
      this.updateTransport(transports);
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
    return plan_detail;
  };

  replacePlanInPlanDetail = (plan_detail, index, toReplace) => {
    plan_detail.splice(index, 1);
    plan_detail.splice(index, 0, toReplace);
    return plan_detail;
  };

  addCard = async (source, destination) => {
    let { droppableId, index } = destination;
    let { plan_detail, plan_startday, transports } = this.state;
    let sourceId = source.droppableId;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const tail = sourceId.slice(sourceId.length - 3, sourceId.length);
    const google_place_id = sourceId.slice(0, sourceId.length - 3);

    const name = this.copyNameFromAttBar(tail, source.index);
    const day = Number(droppableId)
    const trans_order =
    index -
    plan_detail.filter((plan) => plan.day === day)[0].attraction_order;
    let toAdd = {
      attraction_name: name,
      plan_id,
      time_spend: 30, //// Can be changed to "recommended time"
      description: "",
      attraction_order: index,
      day: day,
    };

    plan_detail = this.addNewPlanToPlanDetail(plan_detail, index, toAdd);
    transports = await this.transAddCard(
      plan_detail,
      transports,
      index,
      day,
      trans_order,
    );
    this.setState({ transLoaded: false });
    setTimeout(async () => {
      let results = await GetPlanDetailExtraDatas(APIServer, google_place_id);
      results = { ...plan_detail[index], ...results };
      plan_detail = this.replacePlanInPlanDetail(plan_detail, index, results);
      // await this.calPlan(plan_detail);
      this.reArrangePlanDetail(plan_detail, plan_startday, transports);
      this.updatePlanDetails();
      this.updateTransport(transports);
    }, 15);
  };

  delCard = async (index) => {
    console.log(index)
    let { plan_detail, plan_startday, transports } = this.state;
    const day = plan_detail[index].day
    const trans_order =
    index -
    plan_detail.filter((plan) => plan.day === day)[0].attraction_order;
    plan_detail.splice(index, 1);
    transports = await this.transDelCard(plan_detail, transports, index, day, trans_order);
    this.setState({ plan_detail, transports });
    this.setState({ transLoaded: false });
    setTimeout(async () => {
      // await this.calPlan(plan_detail);
      this.reArrangePlanDetail(plan_detail, plan_startday, transports);
      this.updatePlanDetails();
      this.updateTransport(transports);
    }, 15);
  };

  addFreeTime = async (order, day) => {
    let { plan_detail, plan_startday, transports } = this.state;
    const { plan_id } = this.props;
    let toAdd = {
      plan_id,
      time_spend: 30, //// Can be changed to "recommended time"
      description: "",
      attraction_order: order,
      day: day,
      google_place_id: "freetime",
    };
    const trans_order =
    order -
    plan_detail.filter((plan) => plan.day === day)[0].attraction_order;
    plan_detail = this.addNewPlanToPlanDetail(plan_detail, order, toAdd);
    transports = await this.transAddCard(plan_detail, transports, order, day, trans_order);
    this.setState({ transLoaded: true });
    setTimeout(async () => {
      // await this.calPlan(plan_detail);
      this.reArrangePlanDetail(plan_detail, plan_startday, transports);
      this.updatePlanDetails();
      this.updateTransport(transports);
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

  changeTransportMode = (day, order, newMode) => {
    const { transports } = this.state;
    let newTransports = transports;
    newTransports[day - 1][order].mode = newMode;
    this.setState({ transports: newTransports });
    this.updateOneTransport(day, order, newTransports);
  };

  changeTransportText = (day, order, newText) => {
    const { transports } = this.state;
    let newTransports = transports;
    newTransports[day - 1][order].text = newText;
    newTransports[day - 1][order].value = parseFloat(newText.split(" ")[0]);
    this.setState({ transports: newTransports });
    this.updateOneTransport(day, order, newTransports);
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
    if (!this.state.searchedPlace) return;
    let res = await FindNearby(
      APIServer,
      this.state.searchedPlace.geometry.location.lat,
      this.state.searchedPlace.geometry.location.lng,
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
    console.log(this.state.searchedPlace);

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
        return res.data;
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

  reqTransport = async (url, plan_id) =>
    axios
      .get(url + "/transport?planId=" + plan_id)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
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
    const req8 = this.reqTransport(url, plan_id);

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
    // auto add a day if days is empty, then calculate plan
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
        // console.log(transports);
        this.reArrangePlanDetail(plan_detail, res[0], transports);
      })
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
                                changeTransportMode={this.changeTransportMode}
                                changeTransportText={this.changeTransportText}
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
