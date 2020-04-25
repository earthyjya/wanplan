import "./scss/Homepage.scss";
import axios from "axios";
import Myplan from "./plan/MyPlan.js";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRoute } from "@fortawesome/free-solid-svg-icons";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";

class Homepage extends Component {
  state = {
    citySearch: 0,
    error: null,
    isLoading: true,
    redirect: false,
    redirectTo: "/",
  };

  RedirectFunc = (plan_id) => {
    this.setState({
      redirect: true,
      redirectTo: "/plan/" + plan_id + "/edit_plan",
    });
  };

  RenderRedirect = () => {
    if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;
  };

  selectCity = (e) => {
    this.setState({ citySearch: Number(e.target.value) });
  };

  async componentDidMount() {
    const APIServer = process.env.REACT_APP_APIServer;
    await axios
      .get(APIServer + "/city")
      .then((result) => {
        this.setState({ cities: result.data, isLoading: false });
        console.log("got cities");
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
        console.log(error);
      });
  }

  render() {
    const { isLoading, error } = this.state;
    if (isLoading) return <div></div>;
    if (error) return <div>Something Went Wrong :(</div>;
    return (
      <React.Fragment>
        <Container
          fluid
          className="plan-description-picture-home"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1525230071276-4a87f42f469e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80)",
          }}
        />
        <div className="layer"></div>
        <Container className="plan-description-container-home">
          <Row className="oneplan-title">ONEPLAN</Row>
          <Row className="oneplan-description">The only plan for</Row>
          <Row className="oneplan-description-2">Travel Lover</Row>
        </Container>
        <Container fluid className="intro-container-home">
          <Row style={{ height: "40 px" }}>
            <Col className="howto-number">1</Col>
            <Col className="howto-number">2</Col>
            <Col className="howto-number">3</Col>
          </Row>
          <Row className="intro-container-home-row">
            <Col className="intro-container-home-col">
              <div>
                <div>
                  <span>เลือก </span>
                  <span className="intro-plan-home">PLAN</span>
                  <span> ที่เพื่อนๆนักท่องเที่ยวเตรียมไว้ให้แล้ว </span>
                  <br></br>
                </div>
                <div style={{ alignSelf: "center", textAlign: "center" }}>
                  O R
                </div>
                <div style={{ alignSelf: "flex-end", textAlign: "right" }}>
                  <br></br>
                  <span>สร้าง </span>
                  <span className="intro-plan-home">PLAN</span>
                  <span> ของคุณเอง</span>
                </div>
              </div>
            </Col>
            <Col className="intro-container-home-col">
              <div>
                <div style={{ alignSelf: "center", textAlign: "center" }}>
                  <span>ปรับแต่ง</span>
                  <span className="intro-plan-home"> PLAN </span>
                  <span>ของคุณ</span>
                </div>
                <div style={{ fontSize: "small" }}>
                  เลือกที่ท่องเที่ยวและปรับเวลาได้ตามสไตล์การเที่ยวของคุณ
                </div>
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <div className="gif"></div>
                </div>
              </div>
            </Col>
            <Col className="intro-container-home-col-2">
              <div >
                <FontAwesomeIcon icon={faRoute} size="1x" />
                <span> นำ</span>
                <span className="intro-plan-home"> PLAN </span> 
                <span>นี้ไปเที่ยว!!</span> 
                <br></br>
                <br></br>
                <div style={{ alignSelf: "center", textAlign: "center" }}>O R </div>
                <br></br>
                <FontAwesomeIcon icon={faShareAlt} size="1x" />
                <span> แชร์</span>
                <span className="intro-plan-home"> PLAN </span> 
                <span>นี้กับเพื่อนๆ</span> 
              </div>
             
                
            </Col>
          </Row>
        </Container>
        <Myplan data={this.props.data} {...this.state} {...this.props} />
      </React.Fragment>
    );
  }
}

export default Homepage;
