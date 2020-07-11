import "../scss/MyPlan.scss";
import CreateNewPlan from "../lib/CreateNewPlan.js";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PlanCard from "./PlanCard.js";
import { CardDeck } from "reactstrap";

class MyPlan extends Component {
  state = {
    error: null,
    redirect: false,
    redirectTo: "/",
    citySearch: 0,
    cities: [],
    leastDay: 0,
    mostDay: 1000,
    allChecked: false,
    list: [
<<<<<<< HEAD
      { id: 1, name: "Adventure", isChecked: false },
      { id: 2, name: "Sightseeing", isChecked: false },
      { id: 3, name: "Cultural", isChecked: false },
      // { id: 4, name: "Others", isChecked: false },
    ],
=======
      { id: 1, name: "adventure", isChecked: false },
      { id: 2, name: "sightseeing", isChecked: false },
      { id: 3, name: "cultural", isChecked: false },
      { id: 4, name: "others", isChecked: false }
    ]
>>>>>>> dbb721d60eb36a748724c07b1bee3dd8916b4ee1
  };

  savedPlan = () => {
    let _planlist = JSON.parse(localStorage.getItem("planlist"));
    if (this.props.isLoggedIn) {
      const { data, user_id } = this.props;
      return data
        .filter(plan => plan.user_id === user_id)
        .map(plan => {
          return <PlanCard plan={plan} key={plan.plan_id} />;
        });
    } else {
      if (_planlist !== null && _planlist !== []) {
        return _planlist.map(plan => <PlanCard plan={plan} key={plan.plan_id} />);
      } else {
        return <div>Your saved plan will show here</div>;
      }
    }
  };

  onClickNewPlan = () => {
    const { user_id, isLoggedIn } = this.props;
    const APIServer = process.env.REACT_APP_APIServer;
    CreateNewPlan(APIServer, user_id, isLoggedIn, this.RedirectFunc);
  };

  selectCity = e => {
    this.setState({ citySearch: Number(e.target.value) });
  };

  leastDayChanged = (e) => {
    this.setState({ leastDay: Number(e.target.value) });
  };

  mostDayChanged = (e) => {
    if (e!= 0){
    this.setState({ mostDay: Number(e.target.value) });
    }else{
      this.setState({ mostDay: 1000 })
    }
  };

  styleChanged = (e) => {
    let { list, allChecked } = this.state;
    let itemName = e.target.name;
    let checked = e.target.checked;
    list = list.map((item) =>
      item.name === itemName ? { ...item, isChecked: checked } : item
    );
    allChecked = list.every((item) => item.isChecked);
    this.setState({ list: list, allChecked: allChecked });
  };

  allChanged = e => {
    let { list, allChecked } = this.state;
    allChecked = e.target.checked;
    list = list.map(item => ({ ...item, isChecked: e.target.checked }));
    this.setState({ list: list, allChecked: allChecked });
  };

<<<<<<< HEAD
  criteria = () => {
    let { citySearch, leastDay, mostDay, allChecked, list } = this.state;
    this.props.criteria({ citySearch, leastDay, mostDay, allChecked, list });
  };

  RedirectFunc = (plan_id) => {
=======
  RedirectFunc = plan_id => {
>>>>>>> dbb721d60eb36a748724c07b1bee3dd8916b4ee1
    this.setState({
      redirect: true,
      redirectTo: "/plan/" + plan_id + "/edit_new_plan"
    });
  };

  RenderRedirect = () => {
    if (this.state.redirect) return <Redirect to={this.state.redirectTo} />;
  };

  async componentDidMount() {
    // const APIServer = process.env.REACT_APP_APIServer;
    let cities = [
      {
        city_id: 13,
        city: "Fukuoka",
        prefecture: "Fukuoka",
        region: "Kyushu",
        country_id: 1,
        updated_time: "2020-04-07T05:24:20.000Z"
      },
      {
        city_id: 6,
        city: "Himeji",
        prefecture: "Hyogo",
        region: "Kansai",
        country_id: 1,
        updated_time: "2020-04-07T05:24:06.000Z"
      },
      {
        city_id: 5,
        city: "Hiroshima",
        prefecture: "Hiroshima",
        region: "Chugoku",
        country_id: 1,
        updated_time: "2020-04-07T05:24:04.000Z"
      },
      {
        city_id: 2,
        city: "Kanazawa",
        prefecture: "Ishikawa",
        region: "Chubu",
        country_id: 1,
        updated_time: "2020-04-07T05:23:57.000Z"
      },
      {
        city_id: 7,
        city: "Kobe",
        prefecture: "Hyogo",
        region: "Kansai",
        country_id: 1,
        updated_time: "2020-04-07T05:24:08.000Z"
      },
      {
        city_id: 8,
        city: "Kyoto",
        prefecture: "Kyoto",
        region: "Kansai",
        country_id: 1,
        updated_time: "2020-04-07T05:24:10.000Z"
      },
      {
        city_id: 1,
        city: "Nagoya",
        prefecture: "Aichi",
        region: "Chubu",
        country_id: 1,
        updated_time: "2020-04-07T05:23:55.000Z"
      },
      {
        city_id: 9,
        city: "Osaka",
        prefecture: "Osaka",
        region: "Kansai",
        country_id: 1,
        updated_time: "2020-04-07T05:24:12.000Z"
      },
      {
        city_id: 15,
        city: "Sendai",
        prefecture: "Miyagi",
        region: "Tohoku",
        country_id: 1,
        updated_time: "2020-04-07T05:24:24.000Z"
      },
      {
        city_id: 3,
        city: "Shizuoka",
        prefecture: "Shizuoka",
        region: "Chubu",
        country_id: 1,
        updated_time: "2020-04-07T05:23:59.000Z"
      },
      {
        city_id: 12,
        city: "Tokyo",
        prefecture: "Tokyo",
        region: "Kanto",
        country_id: 1,
        updated_time: "2020-04-07T05:24:18.000Z"
      },
      {
        city_id: 11,
        city: "Yokohama",
        prefecture: "Kanagawa",
        region: "Kanto",
        country_id: 1,
        updated_time: "2020-04-07T05:24:16.000Z"
      }
    ];
    this.setState({ cities });
    // await axios
    //   .get(APIServer + "/city")
    //   .then(result => {
    //     this.setState({ cities: result.data, isLoading: false });
    //   })
    //   .catch(error => {
    //     this.setState({ error, isLoading: false });
    //     console.log(error);
    //   });
    let { citySearch, leastDay, mostDay, allChecked, list } = this.props;
    this.setState({ citySearch, leastDay, mostDay, allChecked, list });
  }

  render() {
    const { isLoading, error, data } = this.props;
    const { list, allChecked } = this.state;
    if (isLoading) return <div></div>;

    return (
      <React.Fragment>
        <button className="new_plan_button" onClick={this.onClickNewPlan}>
          สร้าง plan ใหม่
        </button>
        {this.RenderRedirect()}
        <div className="myplan-container">
          <div className="myplan-text">My Plan</div>
          <CardDeck className="plan-card-deck">{this.savedPlan()}</CardDeck>
        </div>
        <div
          style={{
            marginTop: "20px",
            marginLeft: "10px",
            position: "relative",
            fontSize: "22px",
            fontWeight: "bold",
            alignSelf: "center",
            textAlign: "center"
          }}
        >
          Search Plan
          <div>
            <div className="search-subtitle">City</div>
            <select
              className="plan-search-city-home"
              placeholder="choose a city..."
              value={this.state.citySearch}
              onChange={this.selectCity}
            >
<<<<<<< HEAD
              <option value="0">All</option>
              {this.state.cities.map((city) => {
=======
              <option value="0">select city</option>
              {this.state.cities.map(city => {
>>>>>>> dbb721d60eb36a748724c07b1bee3dd8916b4ee1
                return (
                  <option key={city.city_id} value={city.city_id} text={city.city}>
                    {city.city}
                  </option>
                );
              })}
            </select>
            <div className="search-subtitle">
              Days
              <div style={{ fontWeight: "normal" }}>
                At least{" "}
                <select
                  className="day-input"
                  placeholder="None"
                  onChange={this.leastDayChanged}
                >
                  <option value="0">None</option>
                  {(() => {
                    let days = [];
                    for (var i = 1; i <= 8; i++) {
                      days.push(i);
                    }
                    return days.map((day) => (
                      <option key = {day} value={day}>{day}</option>
                    ));
                  })()}
                </select>{" "}
                At most{" "}
                <select
                  className="day-input"
                  placeholder="None"
                  onChange={this.mostDayChanged}
                >
                  <option value="0">None</option>
                  {(() => {
                    let days = [];
                    for (var i = 1; i <= 8; i++) {
                      days.push(i);
                    }
                    return days.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ));
                  })()}
                </select>
              </div>
              Plan style
              <div style={{ fontWeight: "normal" }}>
                <label style={{ paddingRight: "16px" }}>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      className="search-checkbox"
                      name="all"
                      value="all"
                      checked={allChecked}
                      onChange={this.allChanged}
                    />
                    <span> All </span>
                  </div>
                </label>
                <label style={{ paddingRight: "16px" }}>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      className="search-checkbox"
                      name={list[0].name}
                      value={list[0].name}
                      checked={list[0].isChecked}
                      onChange={this.styleChanged}
                    />
                    <span> Adventure </span>
                  </div>
                </label>
                <label style={{ paddingRight: "16px" }}>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      className="search-checkbox"
                      name={list[1].name}
                      value={list[1].name}
                      checked={list[1].isChecked}
                      onChange={this.styleChanged}
                    />
                    <span> Sightseeing </span>
                  </div>
                </label>
                <label style={{ paddingRight: "16px" }}>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      className="search-checkbox"
                      name={list[2].name}
                      value={list[2].name}
                      checked={list[2].isChecked}
                      onChange={this.styleChanged}
                    />
                    <span> Cultural </span>
                  </div>
                </label>
                {/* <label style={{ paddingRight: "16px" }}>
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      className="search-checkbox"
                      name={list[3].name}
                      value={list[3].name}
                      checked={list[3].isChecked}
                      onChange={this.styleChanged}
                    />
                    <span> Others </span>
                  </div>
                </label> */}
              </div>
              <button className="search-button" onClick = {this.criteria}>Search</button>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "40px",
            marginLeft: "10px",
            position: "relative"
          }}
        >
          {(() => {
            if (error) return <div className="MyPlan-text">Can't find the plan</div>;
              return (
                <div>
                  {data.map(plan => (
                    <div key={plan.plan_id}>
                      <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
                    </div>
                  ))}
                </div>
              );
<<<<<<< HEAD
=======
            } else {
              return (
                <div>
                  {data.map(plan => {
                    if (plan.city_id === this.state.citySearch) {
                      return (
                        <div key={plan.plan_id}>
                          <a href={"/plan/" + plan.plan_id}>{plan.plan_title}</a>
                        </div>
                      );
                    }
                    return <React.Fragment></React.Fragment>;
                  })}
                </div>
              );
            }
>>>>>>> dbb721d60eb36a748724c07b1bee3dd8916b4ee1
          })()}
        </div>
      </React.Fragment>
    );
  }
}

export default MyPlan;
