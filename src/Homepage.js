import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Row, Col, Container } from "reactstrap";
import { CustomInput } from 'reactstrap';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import "./scss/Homepage.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Myplan from "./plan/MyPlan.js"
import Request from "./lib/Request";

class Homepage extends Component {
  state = {
    error: null,
    redirect: false,
    redirectTo: "/",
    APIServer:
      "http://ec2-18-222-207-98.us-east-2.compute.amazonaws.com:3030/api",
      nodeServer: "http://ec2-18-222-207-98.us-east-2.compute.amazonaws.com:8080"

  };

  savedPlan = () => {
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (this.props.isLoggedIn) {
      const { data, user_id } = this.props;
      return data
        .filter(plan => plan.user_id === user_id)
        .map(plan => {
          return (
            <div key={plan.plan_id}>
              <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
            </div>
          );
        });
    } else {
      if (_planlist !== null) {
        return _planlist.map(plan => (
          <div key={plan.plan_id}>
            <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
          </div>
        ));
      } else {
        return <div>No saved plan yet!</div>;
      }
    }
  };

  createNewPlan = () => {
    const { user_id, APIServer, isLoggedIn } = this.props;
    let newUserId = 6;
    if (this.props.isLoggedIn) newUserId = user_id;
    const newPlan = {
      plan_title: "untitled",
      user_id: newUserId,
      city_id: 2,
      duration: 0,
      plan_style: "",
      plan_description: "",
      original_id: 0,
      available: 0,
      star_rating: 0
    };
    const url = APIServer + "/plan_overview";
    console.log(url);
    axios
      .post(url, newPlan)
      .then(result => {
        if (result.data === null) alert("Could not create new plan :(");
        else {
          newPlan.plan_id = result.data.id;
          if (!this.props.isLoggedIn) {
            if (localStorage.getItem("planlist") === null ||localStorage.getItem("planlist") === [] ) {
              var _planlist = [];
              _planlist[0] = newPlan;
              localStorage.setItem("planlist", JSON.stringify(_planlist));
            } else {
              let _planlist = JSON.parse(localStorage.getItem("planlist"));
              _planlist.push(newPlan);
              console.log(_planlist)
              localStorage.setItem("planlist", JSON.stringify(_planlist));
            }
          }
          this.setState({
            redirect: true,
            redirectTo: "/plan/" + result.data.id + "/edit_plan"
          });
          console.log(result);
        }
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  RenderRedirect = () => {
    if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;
  };

  render() {
    const { user_id, APIServer, jsonServer, nodeServer } = this.state;
    const { isLoading, error, data } = this.props;
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Can't find the plan</div>;

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
       <Container
        fluid
        className="plan-description-container-home"
        >
          <div className="plan-search-container-home">
            <select className="plan-search-city-home" placeholder="choose a city...">
            <option value="0">เลือกเมืองที่คุณสนใจ</option>
            <option value="1">Tokyo</option>
            <option value="2">Kyoto</option>
            <option value="3">Osaka</option>
            <option value="4">Fukuoka</option>
    
            </select >
            {/* <select  className="plan-search-date" placeholder="select date">
            </select >
            <select className="plan-search-people" placeholder="people">
            </select > */}
            <button className="plan-search-button-home">
              Search!
            </button>
          </div>
        </Container>
        <Container fluid className="intro-container-home">
          <div>
            <span >เลือก </span>
            <span className="intro-plan-home" >plan</span>
            <span > ที่ตรงกับสไตล์การท่องเที่ยวของคุณ</span>
          </div>
          <div className="intro-plan-home" style={{alignSelf:"center", textAlign:"center"}}>O R</div>
          <div onClick={this.createNewPlan} style={{alignSelf:"flex-end", textAlign:"right"}}>
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
