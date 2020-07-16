import "./scss/Homepage.scss";
import axios from "axios";
import Myplan from "./plan/MyPlan.js";
import SearchPlan from "./plan/SearchPlan.js";
import Footer from "./Footer.js"
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRoute,
  faExclamation,
  faCommentAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faShareAlt } from "@fortawesome/free-solid-svg-icons";
import FeedbackForm from "./FeedbackForm.js";
import "./scss/Feedback.scss"

class Homepage extends Component {
  state = {
    citySearch: 0,
    error: null,
    isLoading: true,
    feedback: false,
    redirect: false,
    redirectTo: "/",
  };

  // handleChange(e) {
  //   this.setState({ [e.target.name]: e.target.value });
  // }

  // login(e) {
  //   e.preventDefault();
  //   fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
  //   }).catch((error) => {
  //       console.log(error);
  //     });
  // }

  // signup(e){
  //   e.preventDefault();
  //   fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
  //   }).then((u)=>{console.log(u)})
  //   .catch((error) => {
  //       console.log(error);
  //     })
  // }

  toggleFeedback = () => {
    this.setState({ feedback: !this.state.feedback });
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
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
        console.log(error);
      });
  }

  render() {
    const { isLoading, error, feedback } = this.state;
    if (isLoading) return <div></div>;
    if (error) return <div>Something Went Wrong :(</div>;
    return (
      <React.Fragment>
        <button className="Feedback" onClick={this.toggleFeedback}>
          Give Feedback
        </button>
        <button className="Feedback-2" onClick={this.toggleFeedback}>
          <FontAwesomeIcon icon={faCommentAlt} size="1x" color="white" />
        </button>
        {feedback ? (
          <div className="feedbackForm">
            <FeedbackForm
              {...this.state}
              toggleFeedback={this.toggleFeedback}
            />
          </div>
        ) : (
          <div></div>
        )}
        <img
          className="plan-description-picture-home"
          src="https://images.unsplash.com/photo-1525230071276-4a87f42f469e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80"
        />
        <Container fluid className="plan-description-container-home">
          <Row className="oneplan-logo">
            <img
              style={{width:'200px'}}
              src="/oneplan-logo-white-removebg-preview.png"
            />
          </Row>
          <Row className="oneplan-title">ONE PLAN</Row>
          <Row className="oneplan-description">อยากเที่ยวไหน..ให้เราช่วยแพลน</Row>
        </Container>
        <Myplan data={this.props.data} {...this.state} {...this.props} />
        <SearchPlan data={this.props.data} {...this.state} {...this.props} />
        <div className="homepage-ending-container">
          <div className="title">Oneplan</div>
          <div className="content">
            ช่วยให้คนที่ไม่ชอบความยุ่งยากหรืออยากเริ่มต้นแพลนเที่ยวญี่ปุ่นด้วยตัวเองสามารถวางแผนได้ง่ายขึ้น ผ่าน Social platform ของเราที่ผู้ใช้สามารถเลือกแพลนที่เพื่อน ๆ คนอื่นแชร์ไว้มาปรับแต่งบนบอร์ดที่
            ออกแบบมาให้สามารถแก้ไขได้ง่ายและอิสระ พร้อมจองตั๋วและโรงแรมที่เหมาะที่สุดสำหรับทริปของคุณ
          </div>
          <button>สร้างแพลน</button>
          <img src="https://via.placeholder.com/300x300"/>
          <div className="circle"></div>
        </div>
        <Footer/>
      </React.Fragment>
    );
  }
}

export default Homepage;
