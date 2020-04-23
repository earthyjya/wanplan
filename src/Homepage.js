import "./scss/Homepage.scss";
import axios from "axios";
import Myplan from "./plan/MyPlan.js";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Container } from "reactstrap";

class Homepage extends Component {
  state = {
    citySearch: 0,
    error: null,
    isLoading: true,
    redirect: false,
    redirectTo: "/"
  };

  RedirectFunc = plan_id => {
    this.setState({
      redirect: true,
      redirectTo: "/plan/" + plan_id + "/edit_plan"
    });
  };

  RenderRedirect = () => {
    if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;
  };

  selectCity = e => {
    this.setState({ citySearch: Number(e.target.value) });
  };

  async componentDidMount() {
    const APIServer = process.env.REACT_APP_APIServer;
    await axios
      .get(APIServer + "/city")
      .then(result => {
        this.setState({ cities: result.data, isLoading: false });
        console.log("got cities");
      })
      .catch(error => {
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
              "url(https://images.unsplash.com/photo-1525230071276-4a87f42f469e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80)"
          }}
        />
        <Container fluid className="plan-description-container-home">
          <div className="plan-search-container-home">
            <select
              className="plan-search-city-home"
              placeholder="choose a city..."
              value={this.state.citySearch}
              onChange={this.selectCity}
            >
              <option value="0">choose a city...</option>
              {this.state.cities.map(city => {
                return <option value={city.city_id}>{city.city}</option>;
              })}
            </select>
            {/* <select  className="plan-search-date" placeholder="select date">
            </select >
            <select className="plan-search-people" placeholder="people">
            </select > */}
            <button className="plan-search-button-home">Search!</button>
          </div>
        </Container>
        <Container fluid className="intro-container-home">
          <div>
            <span>เลือก </span>
            <span className="intro-plan-home">plan</span>
            <span> ที่ตรงกับสไตล์การท่องเที่ยวของคุณ</span>
          </div>
          <div className="intro-plan-home" style={{ alignSelf: "center", textAlign: "center" }}>
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
