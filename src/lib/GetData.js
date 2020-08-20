import axios from "axios";

export const GetPlanDetailExtraDatas = async (APIServer, google_place_id) => {
  //request for attraction link etc
  let url = APIServer + "/attraction/google_id/" + google_place_id;
  let req1 = axios
    .get(url)
    .then((result) => ({ ...result.data[0] }))
    .catch((error) => console.error(error));

  //request for attraction name and other detail
  url = APIServer + "/googleplace/" + google_place_id;
  let req2 = axios
    .get(url)
    .then((result) => ({ ...result.data[0] }))
    .catch((error) => console.error(error));

  //request for google photo in production stage
  let req3 = null;
  if (process.env.NODE_ENV === "production") {
    req3 = axios
      .get(APIServer + "/googlephoto/" + google_place_id)
      .then((result) => ({ ...result.data[0] }))
      .catch((err) => console.log(err));
  }

  //resolve all requests
  let results = await Promise.all([req1, req2, req3]);
  results = results.reduce((acc, plan) => {
    return { ...acc, ...plan };
  }, {});
  return results;
};

export const GetPlanDetailExtraDatasPromises = async (APIServer, plan) => {
  let reqPlace = { ...plan };
  let reqPhoto = { ...plan };
  let reqLink = { ...plan };

  //request for photo if in production stage
  if (process.env.NODE_ENV === "production") {
    reqPhoto = axios
      .get(APIServer + "/googlephoto/" + plan.google_place_id)
      .then((res) => ({ ...plan, ...res.data[0] }));
  }

  //request for attraction name etc.
  if (plan.google_place_id !== "freetime") {
    reqPlace = axios
      .get(APIServer + "/googleplace/" + plan.google_place_id)
      .then((result) => ({ ...plan, ...result.data[0] }));
  }

  // request for attraction link
  reqLink = (async () => {
    if ((await reqPlace.attraction_id) === 0)
      return axios
        .get(APIServer + "/attraction/google_id/" + plan.google_place_id)
        .then((res) => ({ ...plan, ...res.data[0] }));
    else return { ...plan };
  })();
  return [reqPlace, reqLink, reqPhoto];
};
