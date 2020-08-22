import axios from "axios";
import { Int2Str, Str2Int } from "../lib/ConvertTime.js";

export const GetTransportsBetween2Places = async (
  APIServer,
  place1,
  place2
) => {
  // let url = APIServer + "/googletransport/" + place1 + "/" + place2;
  // return axios
  //   .get(url)
  //   .then((res) => {
  //     return {
  //       text: res.data.duration.text,
  //       mode: res.data.mode,
  //       value: res.data.duration.value / 60,
  //       distance: res.data.distance.text,
  //     };
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  return {};
};

export const CreateTransportInDayPromise = (APIServer, places) =>
  places.map(async (place, idx1) => {
    let lastPlace = { attraction_name: "Hotel" };
    if (idx1 === 0) lastPlace = { attraction_name: "Hotel" };
    else lastPlace = places[idx1 - 1];
    if (
      !lastPlace.google_place_id ||
      !places[idx1].google_place_id ||
      lastPlace.google_place_id == "freetime" ||
      places[idx1].google_place_id == "freetime"
    ) {
      return {
        key: idx1,
        text: "No transportation data",
        value: 0,
      };
    } else {
      let place1 = places[idx1 - 1].google_place_id;
      let place2 = places[idx1].google_place_id;
      return GetTransportsBetween2Places(APIServer, place1, place2);
    }
  });

export const ResolveTransportsPromise = async (transports) => {
  return Promise.all(transports)
    .then((twoDProms) =>
      Promise.all(twoDProms.map((prom) => Promise.all(prom)))
    )
    .then((res) => res)
    .catch((err) => console.log(err));
};

export const GetTransports = async (APIServer, plan_detail, days) => {
  // create transports as an array of promises of arrays of promises of the transport detail we need
  let transports = days.map((day) => {
    // dayTrans will become promises of arrays of promises
    let dayTrans = [];
    let places = plan_detail.filter((det) => det.day === day);

    if (places) dayTrans = CreateTransportInDayPromise(APIServer, places);
    return dayTrans;
  });

  let results = await ResolveTransportsPromise(transports);
  return results;
};

export const AssignTime = (plan_detail, plan_startday, transports) => {
  let lastDay = 0;
  let lastTime = 0;
  let transTime = 0;
  let idx = 0;
  for (let i = 0; i < plan_detail.length; i++) {
    if (plan_detail[i].day !== lastDay) {
      lastDay = plan_detail[i].day;
      idx = 0;
      if (transports[lastDay - 1]) {
        if (transports[lastDay - 1][idx])
          transTime = Math.ceil(transports[lastDay - 1][idx].value / 10) * 10;
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
  return plan_detail;
};