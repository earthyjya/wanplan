import "./scss/Homepage.scss";
import axios from "axios";
import Myplan from "./plan/MyPlan.js";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row } from "reactstrap";

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
          <Row className="oneplan-title">
            ONEPLAN
          </Row>
          <Row className="oneplan-description">
            The only plan for 
          </Row>
          <Row className="oneplan-description-2">
            Travel Lover
          </Row>
        </Container>
        <Container fluid className="intro-container-home">
          <div>
            <span>เลือก </span>
            <span className="intro-plan-home">plan</span>
            <span> ที่ตรงกับสไตล์การท่องเที่ยวของคุณ</span>
          </div>
          <div
            className="intro-plan-home"
            style={{ alignSelf: "center", textAlign: "center" }}
          >
            O R
          </div>
          <div style={{ alignSelf: "flex-end", textAlign: "right" }}>
            <span>สร้าง </span>
            <span className="intro-plan-home">plan</span>
            <span> ของคุณเอง</span>
          </div>
        </Container>
        <Myplan data={this.props.data} {...this.state} {...this.props} />
      </React.Fragment>
    );
  }
}

export default Homepage;
