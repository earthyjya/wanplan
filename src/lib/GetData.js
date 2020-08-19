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
  return results
};
