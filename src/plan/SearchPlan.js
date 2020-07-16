import "../scss/SearchPlan.scss";
import CreateNewPlan from "../lib/CreateNewPlan.js";
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PlanCard from "./PlanCard.js";
import { CardDeck } from "reactstrap";
import axios from "axios";

class SearchPlan extends Component {
  state = {
    data: [],
    error: null,
    redirect: false,
    redirectTo: "/",
    citySearch: 0,
    cities: [],
    leastDay: 0,
    mostDay: 1000,
    allChecked: false,
    list: [
      { id: 1, name: "Adventure", nameShow: "Adventure", isChecked: false },
      { id: 2, name: "Sightseeing", nameShow: "Sightseeing", isChecked: false },
      { id: 3, name: "Cultural", nameShow: "Cultural", isChecked: false },
      { id: 4, name: "Family", nameShow: "Family", isChecked: false },
      { id: 5, name: "Food", nameShow: "Food", isChecked: false },
      { id: 6, name: "Shopping", nameShow: "Shopping", isChecked: false },
      { id: 7, name: "Unseen", nameShow: "Unseen", isChecked: false },
      { id: 8, name: "Must go", nameShow: "Must go", isChecked: false },
      { id: 9, name: "AUTO_TAG", nameShow: "Others", isChecked: false },
    ],
    url: "https://api.oneplan.in.th/api/plan_overview",
    seeAll: false,
  };

  selectCity = (e) => {
    this.setState({ citySearch: Number(e.target.value) });
  };

  leastDayChanged = (e) => {
    this.setState({ leastDay: Number(e.target.value) });
  };

  mostDayChanged = (e) => {
    if (e != 0) {
      this.setState({ mostDay: Number(e.target.value) });
    } else {
      this.setState({ mostDay: 1000 });
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

  allChanged = (e) => {
    let { list, allChecked } = this.state;
    allChecked = e.target.checked;
    list = list.map((item) => ({ ...item, isChecked: e.target.checked }));
    this.setState({ list: list, allChecked: allChecked });
  };

  criteria = async () => {
    const APIServer = process.env.REACT_APP_APIServer;
    let allFalse = true;
    let e = this.state;
    // console.log(e);
    e.list.map((i) => {
      if (i.isChecked) {
        this.setState({ allFalse: false });
        allFalse = false;
        // console.log("not all false");
      }
    });
    let url = "";
    if (e.citySearch != 0)
      url = APIServer + "/plan_overview/criteria/" + e.citySearch + "/";
    else url = APIServer + "/plan_overview/criteria/all/";
    url = url + e.leastDay + "/" + e.mostDay + "/";
    if (!allFalse) {
      e.list.map((style) => {
        if (style.isChecked) url = url + style.name + ",";
      });
    } else {
      e.list.map((style) => {
        url = url + style.name + ",";
      });
    }
    this.setState({ url: url });

    console.log(url);
    await axios
      .get(url)
      .then((result) => {
        console.log(result.data);
        this.setState({ data: result.data, isLoading: false, error: null });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  };

  RedirectFunc = (plan_id) => {
    this.setState({
      redirect: true,
      redirectTo: "/plan/" + plan_id + "/edit_new_plan",
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
        updated_time: "2020-04-07T05:24:20.000Z",
      },
      {
        city_id: 6,
        city: "Himeji",
        prefecture: "Hyogo",
        region: "Kansai",
        country_id: 1,
        updated_time: "2020-04-07T05:24:06.000Z",
      },
      {
        city_id: 5,
        city: "Hiroshima",
        prefecture: "Hiroshima",
        region: "Chugoku",
        country_id: 1,
        updated_time: "2020-04-07T05:24:04.000Z",
      },
      {
        city_id: 2,
        city: "Kanazawa",
        prefecture: "Ishikawa",
        region: "Chubu",
        country_id: 1,
        updated_time: "2020-04-07T05:23:57.000Z",
      },
      {
        city_id: 7,
        city: "Kobe",
        prefecture: "Hyogo",
        region: "Kansai",
        country_id: 1,
        updated_time: "2020-04-07T05:24:08.000Z",
      },
      {
        city_id: 8,
        city: "Kyoto",
        prefecture: "Kyoto",
        region: "Kansai",
        country_id: 1,
        updated_time: "2020-04-07T05:24:10.000Z",
      },
      {
        city_id: 1,
        city: "Nagoya",
        prefecture: "Aichi",
        region: "Chubu",
        country_id: 1,
        updated_time: "2020-04-07T05:23:55.000Z",
      },
      {
        city_id: 9,
        city: "Osaka",
        prefecture: "Osaka",
        region: "Kansai",
        country_id: 1,
        updated_time: "2020-04-07T05:24:12.000Z",
      },
      {
        city_id: 15,
        city: "Sendai",
        prefecture: "Miyagi",
        region: "Tohoku",
        country_id: 1,
        updated_time: "2020-04-07T05:24:24.000Z",
      },
      {
        city_id: 3,
        city: "Shizuoka",
        prefecture: "Shizuoka",
        region: "Chubu",
        country_id: 1,
        updated_time: "2020-04-07T05:23:59.000Z",
      },
      {
        city_id: 12,
        city: "Tokyo",
        prefecture: "Tokyo",
        region: "Kanto",
        country_id: 1,
        updated_time: "2020-04-07T05:24:18.000Z",
      },
      {
        city_id: 11,
        city: "Yokohama",
        prefecture: "Kanagawa",
        region: "Kanto",
        country_id: 1,
        updated_time: "2020-04-07T05:24:16.000Z",
      },
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
    this.showAll = this.showAll.bind(this)
    this.showSeeAll = this.showSeeAll.bind(this)
    this.enableSeeAll = this.enableSeeAll.bind(this)
    await axios
      .get(this.state.url)
      .then((result) => {
        console.log(result.data);
        this.setState({ data: result.data, isLoading: false, error: null });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  }

  enableSeeAll(){
    this.setState({seeAll: true})
  }

  showAll(){
    const { data } = this.state;
    if (this.state.seeAll){
      return(
        <React.Fragment>
          {data.map((plan) => (
            <PlanCard plan={plan} key={plan.plan_id} />
          ))}
        </React.Fragment>
      )
    }
    else{
      return(
        <React.Fragment>
          {data.slice(0,9).map((plan) => (
            <PlanCard plan={plan} key={plan.plan_id} />
          ))}
        </React.Fragment>
      )
    }
  }

  showSeeAll(){
    if (!this.state.seeAll){
      return(
        <button className="see-all-button" onClick={this.enableSeeAll}> See all </button>
      )
    }
    return <React.Fragment/>
  }

  render() {

    const { list, allChecked, data, isLoading, error } = this.state;
    if (isLoading) return <div></div>;

    return (
      <React.Fragment>
        {this.RenderRedirect()}
        <div
          style={{
            marginTop: "20px",
            marginLeft: "10px",
            position: "relative",
            fontSize: "22px",
            fontWeight: "bold",
            alignSelf: "center",
            textAlign: "center",
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
              <option value="0">All</option>
              {this.state.cities.map((city) => {
                return (
                  <option
                    key={city.city_id}
                    value={city.city_id}
                    text={city.city}
                  >
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
                      <option key={day} value={day}>
                        {day}
                      </option>
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
                      <option key={day} value={day}>
                        {day}
                      </option>
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
                {list.map((style) => (
                  <label style={{ paddingRight: "16px" }}>
                    <div className="checkbox-container">
                      <input
                        type="checkbox"
                        className="search-checkbox"
                        name={style.name}
                        value={style.name}
                        checked={style.isChecked}
                        onChange={this.styleChanged}
                      />
                      <span> {style.nameShow} </span>
                    </div>
                  </label>
                ))}
              </div>
              <button className="search-button" onClick={this.criteria}>
                Search
              </button>
            </div>
          </div>
        </div>
        <CardDeck className="plan-card-deck-search">
          {(() => {
            if (error)
              return <div className="MyPlan-text">Can't find the plan</div>;
            return (
              <React.Fragment>
                {this.showAll()}
              </React.Fragment>
            );
          })()}
          {this.showSeeAll()}
        </CardDeck>

      </React.Fragment>
    );
  }
}

export default SearchPlan;
