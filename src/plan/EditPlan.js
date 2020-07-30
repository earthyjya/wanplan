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

class EditPlan extends React.Component {
  state = {
    attraction: [],
    days: [],
    dropdownOpen: false,
    editTitle: false,
    error: null,
    isLoading: true,
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
  };

  updatePlan = async () => {
    //update current plan
    this.toggleUpdateToast();
    await this.updatePlanOverview(this.state.plan_overview);
    await this.updatePlanStartday();
    await this.updatePlanDetails();
    await this.setState({
      redirect: true,
      redirectTo: "/plan/" + this.props.plan_id,
    });
  };

  updatePlanNoRedirect = async () => {
    //update current plan
    //this.toggleUpdateToast();
    await this.updatePlanOverview(this.state.plan_overview);
    await this.updatePlanStartday();
    await this.updatePlanDetails();
  };

  updatePlanOverview = async (plan_overview) => {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    const url = APIServer + "/plan_overview/" + plan_id;
    await axios
      .put(url, plan_overview)
      .then((response) => {
        // console.log(response);
      })
      .catch((error) => {
        this.setState({ error });
        console.log(error);
      });
    if (this.state.error) alert(this.state.error);
    else {
      const old_plan_overview = this.state.plan_overview;
      await this.setState({
        plan_overview: { ...old_plan_overview, ...plan_overview },
      });
      if (old_plan_overview.city_id !== plan_overview.city_id)
        this.reloadAttBar();
      // if (old_plan_overview.plan_title !== plan_overview.plan_title) this.reloadPlanOverview();
    }
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (_planlist !== [] && _planlist !== null) {
      await localStorage.setItem(
        "planlist",
        JSON.stringify(
          _planlist.map((plan) => {
            if (plan.plan_id === plan_id) return plan_overview;
            return plan;
          })
        )
      );
    }
  };

  showDetails = (dat) => {
    this.setState({ detailsDat: dat });
  };

  updatePlanStartday = async () => {
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let url = "";

    url = APIServer + "/plan_startday/delete/" + plan_id;
    await axios
      .delete(url)
      .then((res) => {
        console.log("delete", res);
      })
      .catch((error) => {
        console.log(error);
      });

    this.state.plan_startday.map(async (day) => {
      url = APIServer + "/plan_startday/";
      await axios
        .post(url, day)
        .then((res) => {
          console.log("post", res);
        })
        .catch((error) => {
          this.setState({ error });
          console.log(error);
        });
    });
  };

  updatePlanDetails = async () => {
    //update current plan
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let url = "";

    url = APIServer + "/plan_detail/delete/" + plan_id;
    await axios
      .delete(url)
      .then((res) => {
        // console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });

    this.state.plan_detail.map(async (plan) => {
      url = APIServer + "/plan_detail/";
      await axios
        .post(url, plan)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          this.setState({ error });
          console.log(error);
        });
    });
  };

  updateOnePlanDetail = async (order) => {
    const plan_id = this.props.plan_id;
    const detail = this.state.plan_detail[order];
    const APIServer = process.env.REACT_APP_APIServer;
    const url = APIServer + "/plan_detail/" + plan_id + "/" + order;
    console.log(url);
    await axios
      .put(url, detail)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getTransports = async () => {
    const { days } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    let transports = [];
    for (let i = 1; i <= this.state.plan_overview.duration; i++) {
      await transports.push([]);
    }
    await Promise.all(
      days.map(async (day) => {
        let idx = day - 1;
        let places = await this.state.plan_detail.filter(
          (det) => det.day === day
        );
        // console.log(places);
        let lastPlace = { attraction_name: "Hotel" };
        for (let j = 0; j < places.length; j++) {
          if (!lastPlace.google_place_id || !places[j].google_place_id) {
            await transports[idx].push({
              text: "No transportation data",
              value: 0,
            });
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
            .then(async (res) => {
              // console.log(res.data);
              await transports[idx].push({
                text: res.data.duration.text,
                mode: res.data.mode,
                value: res.data.duration.value / 60,
                distance: res.data.distance.text,
              });
            })
            .catch((err) => {
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
      console.log(this.state.selectedCover);
      console.log(this.state.selectedCover.type);
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
          console.log(res);
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

  calPlan = async (plan_detail) => {
    //// Need to be updated when transportations are added
    // console.log(transports);

    let { plan_startday } = this.state;
    let i = 0;
    for (i = 0; i < plan_detail.length; i++) {
      plan_detail[i].attraction_order = i;
    }
    plan_startday = plan_startday.slice(0, this.state.plan_overview.duration);
    for (i = 0; i < plan_startday.length; i++) {
      plan_startday[i].day = i + 1;
    }
    let transports = [];
    await this.getTransports()
      .then((res) => {
        transports = res;
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

  addDay = (day) => {
    let { days, plan_overview, plan_detail, plan_startday } = this.state;
    days = days.concat(days.length + 1);
    plan_overview.duration += 1;
    plan_startday.splice(day, 0, {
      plan_id: this.props.plan_id,
      day: day,
      start_day: "09:00",
    });
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
    this.updatePlanOverview(plan_overview);
    this.updatePlanStartday();
  };

  delDay = (day) => {
    let { days, plan_overview, plan_detail, plan_startday } = this.state;
    days.pop();
    plan_overview.duration -= 1;
    plan_startday.splice(day - 1, 1);
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
    this.updatePlanOverview(plan_overview);
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
    this.calPlan(plan_detail);
  };

  addCard = async (source, destination) => {
    let { droppableId, index } = destination;
    const { plan_detail } = this.state;
    const { plan_id } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    let toAdd = {
      plan_id,
      time_spend: 30, //// Can be changed to "recommended time"
      description: "",
      attraction_order: index,
      day: Number(droppableId),
    };
    // console.log(source, destination);
    const url =
      APIServer +
      "/attraction/google_id/" +
      source.droppableId.slice(0, source.droppableId.length - 3);
    await axios
      .get(url)
      .then((result) => (toAdd = { ...toAdd, ...result.data[0] }))
      .catch((error) => {
        this.setState({ error });
        // console.error(error);
      });
    plan_detail.splice(index, 0, toAdd);
    for (let i = 0; i < plan_detail.length; i++) {
      plan_detail[i].attraction_order = i;
    }
    this.setState({ plan_detail });
    this.calPlan(plan_detail);
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

  renderRedirect = () => {
    if (this.state.redirect) {
      window.history.pushState(this.state, "", window.location.href);
      return <Redirect to={this.state.redirectTo} />;
    }
  };

  reloadAttBar = async () => {
    await this.setState({ loadAttBar: false });
    await this.setState({ loadAttBar: true });
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
        await this.setState({ ...result.data, editTitle: new_plan });
      })
      .catch((error) => {
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
          .get(
            APIServer +
              "/attraction/google_id/" +
              plan_detail[i].google_place_id
          )
          // eslint-disable-next-line
          .then((res) => {
            plan_detail[i] = { ...plan_detail[i], ...res.data[0] };
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    this.setState(plan_detail);
    url = APIServer + "/city";
    await axios
      .get(url)
      .then((result) => {
        this.setState({ cities: result.data });
      })
      .catch((error) => {
        this.setState({ error });
        console.log(error);
      });

    let days = [];
    for (let i = 1; i <= this.state.plan_overview.duration; i++) {
      await days.push(i);
    }

    await this.getTransports();

    await this.setState({
      days: days,
    });
    await this.setState({ isLoading: false });
    console.log("Fetching done...");
    this.calPlan(this.state.plan_detail);
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
    } = this.state;
    const APIServer = process.env.REACT_APP_APIServer;
    if (isLoading) return <div>Loading...</div>;
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
                ) !== "bar"
              )
                this.reorderCards(source, destination);
              else this.addCard(source, destination);
            }}
          >
            <Container fluid className="p-0">
              <Row className="m-0">
                <Col sm={12} lg={8} className="p-0">
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
                    <div className="title">{plan_city[0].city}</div>
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
                          updateDescription={this.updateDescription}
                          delCard={this.delCard}
                          editing={true}
                          toggleAttModal={this.toggleAttModal}
                          showDetails={this.showDetails}
                        />
                      );
                    else if (this.state.mode === "map")
                      return (
                        <GGMap {...this.state} {...this.props} editing={true} />
                      );
                  })()}
                </Col>
                <Col lg={4} className="p-0">
                  {(() => {
                    if (this.state.loadAttBar)
                      return (
                        <Request
                          url={
                            APIServer +
                            "/attraction/city/" +
                            plan_city[0].city_id
                          }
                        >
                          {(result) => (
                            <AttBar
                              toggleAttModal={this.toggleAttModal}
                              showDetails={this.showDetails}
                              {...result}
                            />
                          )}
                        </Request>
                      );
                    return;
                  })()}
                </Col>
              </Row>
            </Container>
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
