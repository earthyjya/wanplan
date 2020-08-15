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
import { Int2Str, Str2Int } from "../lib/ConvertTime.js";
import { Redirect } from "react-router-dom";
import { Row, Col, Container, Toast, ToastBody, ToastHeader } from "reactstrap";
import UpdatePlan from "../lib/UpdatePlan";

class EditPlan extends React.Component {
  state = {
    attraction: [],
    days: [],
    dropdownOpen: false,
    editTitle: false,
    error: null,
    isLoading: true,
    overviewLoaded: false,
    loadAttBar: true,
    loadPlanOverview: true,
    modal: false,
    plan_detail: [],
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
    // console.log(toUpdate)
    //update current plan
    // this.toggleUpdateToast();
    UpdatePlan(APIServer, plan_id, "all", toUpdate, (data) => {
      this.setState({
        redirect: true,
        redirectTo: "/plan/" + this.props.plan_id,
      });
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
    this.toggleUpdateToast();
    UpdatePlan(APIServer, plan_id, "all", toUpdate, (data) => {});
  };

  updatePlanOverview = async (plan_overview, reload) => {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    UpdatePlan(
      APIServer,
      plan_id,
      "plan_overview",
      { plan_overview },
      (data) => {
        const old_plan_overview = this.state.plan_overview;
        this.setState({
          plan_overview: { ...old_plan_overview, ...plan_overview },
        });
        if (old_plan_overview.city_id !== plan_overview.city_id) {
          // console.log("trying to update plan location")
          let plan_location = {
            plan_id: plan_id,
            city_id: plan_overview.city_id,
          };
          UpdatePlan(
            APIServer,
            plan_id,
            "plan_location",
            { plan_location },
            (data) => {
              this.setState({
                plan_overview: {
                  ...this.state.plan_overview,
                  ...plan_location,
                },
              });
              // console.log("finished updating location")
              if (reload) {
                this.setState({ loadAttBar: false });
                // console.log("reload attBar")
              }
            }
          );
        }
        let _planlist = JSON.parse(localStorage.getItem("planlist"));
        if (_planlist !== [] && _planlist !== null) {
          localStorage.setItem(
            "planlist",
            JSON.stringify(
              _planlist.map((plan) => {
                if (plan.plan_id === plan_id) return plan_overview;
                return plan;
              })
            )
          );
        }
      }
    );
  };

  showDetails = (dat) => {
    this.setState({ detailsDat: dat });
  };

  updatePlanStartday = async () => {
    const { plan_id } = this.props;
    const { plan_startday } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    UpdatePlan(
      APIServer,
      plan_id,
      "plan_startday",
      { plan_startday },
      (data) => {}
    );
  };

  updatePlanDetails = async () => {
    //update current plan
    const { plan_id } = this.props;
    const { plan_detail } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    UpdatePlan(
      APIServer,
      plan_id,
      "plan_detail",
      { plan_detail },
      (data) => {}
    );
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

  getTransports = async () => {
    const { days, plan_startday } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    let transports = [];
    // console.log(transports);
    transports = days.reduce(async (acc, day) => {
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
            // console.log([...(await acc1)]);
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
    this.setState({ transports: [...(await transports)] });
    return [...(await transports)];
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
          // console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
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
    this.calPlan(plan_detail);
    this.updatePlanOverview(plan_overview, false);
    this.updatePlanStartday();
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
    this.calPlan(plan_detail);
    this.updatePlanOverview(plan_overview, false);
    this.updatePlanStartday();
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
    // console.log(plan_detail);
    this.calPlan(plan_detail);
  };

  addCard = async (source, destination) => {
    // console.log("addingCard");
    let { droppableId, index } = destination;
    // console.log(source, destination);
    let { plan_detail, plan_startday } = this.state;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let toAdd = {
      plan_id,
      time_spend: 30, //// Can be changed to "recommended time"
      description: "",
      attraction_order: index,
      day: Number(droppableId),
    };
    let url =
      APIServer +
      "/attraction/google_id/" +
      source.droppableId.slice(0, source.droppableId.length - 3);
    await axios
      .get(url)
      .then((result) => (toAdd = { ...toAdd, ...result.data[0] }))
      .catch((error) => {
        // this.setState({ error });
        console.error(error);
      });
      url =
      APIServer +
      "/googleplace/" + toAdd.google_place_id
      source.droppableId.slice(0, source.droppableId.length - 3);
    await axios
      .get(url)
      .then((result) => (toAdd = { ...toAdd, ...result.data[0] }))
      .catch((error) => {
        // this.setState({ error });
        console.error(error);
      });

    plan_detail.splice(index, 0, toAdd);
    let newPlan = plan_startday.reduce(async (acc, day) => {
      let plans = plan_detail.filter((det) => det.day === day.day);
      plans = plans.reduce(
        (acc1, plan, idx) => [...acc1, { ...plan, attraction_order: idx }],
        []
      );
      return [...(await acc), ...plans];
    }, []);
    plan_detail = newPlan;
    this.setState({ plan_detail: [...(await plan_detail)] });
    // console.log(plan_detail);
    this.calPlan([...(await plan_detail)]);
    if (process.env.NODE_ENV === "production") {
      await axios
        .get(APIServer + "/googlephoto/" + plan_detail[index].google_place_id)
        .then((res) => {
          plan_detail[index] = { ...plan_detail[index], ...res.data[0] };
        })
        .catch((err) => {
          console.log(err);
        });
      this.setState(plan_detail);
    }
  };

  delCard = (index) => {
    const { plan_detail } = this.state;
    plan_detail.splice(index, 1);
    this.setState({ plan_detail });
    this.calPlan(plan_detail);
  };

  addFreeTime = async (order, day) => {
    // console.log(`adding free time`);
    let { plan_detail, plan_startday } = this.state;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let toAdd = {
      plan_id,
      time_spend: 30, //// Can be changed to "recommended time"
      description: "",
      attraction_order: order,
      day: day,
    };
    plan_detail.splice(order, 0, toAdd);
    let newPlan = plan_startday.reduce(async (acc, day) => {
      let plans = plan_detail.filter((det) => det.day === day.day);
      plans = plans.reduce(
        (acc1, plan, idx) => [...acc1, { ...plan, attraction_order: idx }],
        []
      );
      return [...(await acc), ...plans];
    }, []);
    plan_detail = newPlan;
    this.setState({ plan_detail: [...(await plan_detail)] });
    // console.log(plan_detail);
    this.calPlan([...(await plan_detail)]);
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

  updateTitle = (source, newTitle) => {
    const { plan_detail } = this.state;
    plan_detail[source].attraction_name = newTitle;
    this.setState({ plan_detail });
    this.updateOnePlanDetail(source);
  };

  updateNearby = (dat) => {
    this.setState({nearbyCenter: dat});
  }

  renderRedirect = () => {
    if (this.state.redirect) {
      window.history.pushState(this.state, "", window.location.href);
      return <Redirect to={this.state.redirectTo} />;
    }
  };

  reloadAttBar = async () => {
    // await this.setState({ loadAttBar: false });
    this.setState({ loadAttBar: true });
  };

  reloadPlanOverview = async () => {
    await this.setState({ loadPlanOverview: false });
    await this.setState({ loadPlanOverview: true });
  };

  async componentDidMount() {
    // Since it has to fetch three times, we fetch it here and store the data in the state
    const { plan_id, new_plan } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let url = APIServer + "/load_plan/full?planId=" + plan_id;
    await axios
      .get(url)
      .then(async (result) => {
        this.setState({ ...result.data, editTitle: new_plan });
        this.setState({
          plan_overview: {
            ...this.state.plan_overview,
            city: result.data.plan_city[0].city,
            city_id: result.data.plan_city[0].city_id,
          },overviewLoaded:true,
        });
        // console.log(result.data)
      })
      .catch((error) => {
        console.log(error);
      });
    if (!this.state.plan_overview) {
      this.setState({ error: true, isLoading: false });
      return;
    }
    let plan_detail = this.state.plan_detail;
    plan_detail = plan_detail.reduce(async (acc, plan) => {
      // console.log(acc);
      if (plan.attraction_id === 0) {
        await axios
          .get(APIServer + "/attraction/google_id/" + plan.google_place_id)
          // eslint-disable-next-line
          .then(async (res) => {
            // console.log(acc.push({ ...plan, ...res.data[0] }));
            acc = [...(await acc), { ...plan, ...res.data[0] }];
          })
          .catch(async (err) => {
            // console.log(err);
            acc = [...(await acc), null];
          });
      } else {
        // console.log(plan);
        acc = [...(await acc), plan];
      }
      return [...(await acc)];
    }, []);

    plan_detail = this.state.plan_detail.reduce(async (acc,plan) => {
      let data = {...plan,}
      if (plan.google_place_id){
      url = APIServer + "/googleplace/" + plan.google_place_id
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
    }
    acc = [...await acc, {...data}]
      return [...await acc]
    }
      ,[])
    this.setState({plan_detail: [...await plan_detail]});

    url = APIServer + "/city";
    await axios
      .get(url)
      .then((result) => {
        this.setState({ cities: result.data });
      })
      .catch((error) => {
        // this.setState({ error });
        console.log(error);
      });

    let days = this.state.plan_startday.reduce(
      (acc, cur, idx) => [...acc, idx + 1],
      []
    );

    await this.getTransports();

    this.setState({
      days: days,
    });

    // console.log("Fetching done...");
    this.calPlan(this.state.plan_detail);
    await this.setState({ isLoading: false });
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
      overviewLoaded
    } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    if (!overviewLoaded) return <div>Loading...</div>;
    if (error) return <div>Something went wrong :(</div>;
    else {
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
                  if (this.state.loadPlanOverview)
                    return (
                      <EditPlanOverview
                        {...this.state}
                        updatePlanOverview={this.updatePlanOverview}
                        togglePlanCover={this.togglePlanCover}
                      />
                    );
                  return;
                })()}

                <div className="title-bar">
                  <div className="title">{plan_overview.city}</div>
                  <div className="plan" onClick={this.modePlan}>
                    Plan
                  </div>
                  <div className="map" onClick={this.modeMap}>
                    Map
                  </div>
                  <div>
                    {/* eslint-disable-next-line */}
                    <i
                      className="fa fa-pencil-square-o fa-fw"
                      aria-hidden="true"
                      onClick={this.toggleEditPlanContent}
                    />
                  </div>
                  {/*<button className="white-button" onClick={this.toggleShareModal}>
                    Share!
                    <span style={{ fontSize: "15px" }}>
                      <br />
                      this plan
                    </span>
                  </button>*/}
                  <button className="white-button" onClick={this.updatePlan}>
                    Update!
                    <span style={{ fontSize: "15px" }}>
                      <br />
                      this plan
                    </span>
                  </button>
                </div>
                {this.renderRedirect()}
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
                      />
                    );
                  else if (this.state.mode === "map")
                    return (
                      <GGMap {...this.state} {...this.props} editing={true} />
                    );
                })()}
              </div>
              {(() => {
                if (this.state.mode === "plan") {
                  return (
                    <div className="attbar-container">
                      {(() => {
                        if (this.state.loadAttBar)
                          return (
                            // <Request
                            //   url={
                            //     APIServer +
                            //     "/attraction/city/" +
                            //     plan_city[0].city_id
                            //   }
                            // >
                            //   {(result) => (
                            <AttBar
                              toggleAttModal={this.toggleAttModal}
                              showDetails={this.showDetails}
                              reloadAttBar={this.reloadAttBar}
                              {...this.state}
                            />
                            //    )}
                            // </Request>
                          );
                        else {
                          this.reloadAttBar();
                          return;
                        }
                      })()}
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
              If you want to save this plan, please sign-in or copy the url.
              This plan will now show on 'My plan'.
            </ToastBody>
          </Toast>
          <Toast isOpen={this.state.publishToast}>
            <ToastHeader toggle={this.togglePublishToast}>
              Plan published!
            </ToastHeader>
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
    }
  }
}

export default EditPlan;
