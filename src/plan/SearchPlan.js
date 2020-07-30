import "../scss/SearchPlan.scss";
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
      { id: 8, name: "Must_go", nameShow: "Must go", isChecked: false },
      {
        id: 9,
        name: "Go_to_travel",
        nameShow: "Go to travel",
        isChecked: false,
      },
      { id: 10, name: "Nature", nameShow: "Nature", isChecked: false },
      {
        id: 11,
        name: "Social_distancing",
        nameShow: "Social distancing",
        isChecked: false,
      },
      { id: 12, name: "AUTO_TAG", nameShow: "Others", isChecked: false },
    ],
    budgetList: [
      { id: 1, name: "$", nameShow: "$", isChecked: false },
      { id: 2, name: "$$", nameShow: "$$", isChecked: false },
      { id: 3, name: "$$$", nameShow: "$$$", isChecked: false },
    ],
    url: process.env.REACT_APP_APIServer + "/load_plan/search?tags=AUTO_TAG",
    seeAll: false,
  };

  selectCity = (e) => {
    this.setState({ citySearch: Number(e.target.value) });
  };

  leastDayChanged = (e) => {
    this.setState({ leastDay: Number(e.target.value) });
  };

  mostDayChanged = (e) => {
    if (e !== 0) {
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

  priceChanged = (e) => {
    let { budgetList } = this.state;
    let itemName = e.target.name;
    let checked = e.target.checked;
    budgetList = budgetList.map((item) =>
      item.name === itemName ? { ...item, isChecked: checked } : item
    );
    this.setState({ budgetList });
  };

  allChanged = (e) => {
    let { list, allChecked } = this.state;
    allChecked = e.target.checked;
    list = list.map((item) => ({ ...item, isChecked: e.target.checked }));
    this.setState({ list: list, allChecked: allChecked });
  };

  criteria = async () => {
    const APIServer = process.env.REACT_APP_APIServer;
    const { list, citySearch, leastDay, mostDay } = this.state;
    let allFalse = true;
    // console.log(e);
    list.map((i) => {
      if (i.isChecked) {
        this.setState({ allFalse: false });
        allFalse = false;
        // console.log("not all false");
      }
      return null;
    });
    let url = "";
    url = APIServer + "/load_plan/search?cityId=" + citySearch;
    if (leastDay) url += "&start=" + leastDay;
    if (mostDay) url += "&stop=" + mostDay;
    url += "&tags=";
    if (!allFalse) {
      list.map((style) => {
        if (style.isChecked) url += style.name + ",";
        return null;
      });
    } else {
      list.map((style) => {
        url += style.name + ",";
        return null;
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
    this.showAll = this.showAll.bind(this);
    this.showSeeAll = this.showSeeAll.bind(this);
    this.enableSeeAll = this.enableSeeAll.bind(this);
    await axios
      .get(this.state.url)
      .then((result) => {
        console.log(result.data);
        this.setState({ data: result.data, isLoading: false, error: null });
      })
      .catch((error) => this.setState({ error, isLoading: false }));
  }

  enableSeeAll() {
    this.setState({ seeAll: true });
  }

  showAll() {
    const { data } = this.state;
    if (this.state.seeAll) {
      return (
        <React.Fragment>
          {data.map((plan) => (
            <PlanCard plan={plan} key={plan.plan_id} deletable={false} />
          ))}
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          {data.slice(0, 9).map((plan) => (
            <PlanCard plan={plan} key={plan.plan_id} deletable={false} />
          ))}
        </React.Fragment>
      );
    }
  }

  showSeeAll() {
    if (!this.state.seeAll) {
      return (
        <button className="see-all-button" onClick={this.enableSeeAll}>
          {" "}
          See all{" "}
        </button>
      );
    }
    return <React.Fragment />;
  }

  render() {
    const { list, allChecked, isLoading, error, budgetList } = this.state;
    if (isLoading) return <div></div>;

    return (
      <React.Fragment>
        {this.RenderRedirect()}
        <div className="search-plan-container">
          <span>Search Plan</span>
          {/*"city-search-container"*/}
          <div>
            <span>City:</span>
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
          </div>
          {/*"days-search-container"*/}
          <div>
            <span>Days:</span>
            <div>
              <span>At least </span>
              <select
                className="day-input"
                placeholder="0"
                onChange={this.leastDayChanged}
              >
                <option key={0} value="0">
                  None
                </option>
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
              <span>At most </span>
              <select
                className="day-input"
                placeholder="0"
                onChange={this.mostDayChanged}
              >
                <option key={0} value="0">
                  None
                </option>
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
          </div>
          {/*"style-search-container"*/}
          <div>
            <span>Plan style:</span>
            <div>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  className="search-checkbox"
                  name="all"
                  value="all"
                  checked={allChecked}
                  onChange={this.allChanged}
                />
                <span> All </span>
              </label>
              {list.map((style) => (
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    className="search-checkbox"
                    name={style.name}
                    value={style.name}
                    checked={style.isChecked}
                    onChange={this.styleChanged}
                  />
                  <span> {style.nameShow} </span>
                </label>
              ))}
            </div>
          </div>
          {/*"budget-search-container"*/}
          <div>
            <span>Budget:</span>
            <div>
              {budgetList.map((price) => (
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    className="search-checkbox"
                    name={price.name}
                    value={price.name}
                    checked={price.isChecked}
                    onChange={this.priceChanged}
                  />
                  <span> {price.nameShow} </span>
                </label>
              ))}
            </div>
          </div>
          <button className="search-button" onClick={this.criteria}>
            Search
          </button>
        </div>
        <CardDeck className="plan-card-deck-search">
          {(() => {
            if (error)
              return <div className="MyPlan-text">Can't find the plan</div>;
            return <React.Fragment>{this.showAll()}</React.Fragment>;
          })()}
          {this.showSeeAll()}
        </CardDeck>
      </React.Fragment>
    );
  }
}

export default SearchPlan;
