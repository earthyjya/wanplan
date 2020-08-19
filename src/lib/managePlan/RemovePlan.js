import axios from "axios";

const removePlanOverview = async (url) => {
  return axios
    .delete(url)
    .then(async (result) => result.data)
    .catch((error) => console.error(error));
};

const removePlanDetailnStuff = async (APIServer, plan_id) => {
  let urlLocation = APIServer + "/plan_location/delete/plan/" + plan_id;
  let urlStartday = APIServer + "/plan_startday/delete/" + plan_id;
  let urlDetail = APIServer + "/plan_detail/delete/" + plan_id;
  return Promise.all([
    axios.delete(urlLocation),
    axios.delete(urlStartday),
    axios.delete(urlDetail),
  ]).catch((err) => console.log(err));
};

export default async function RemovePlan(APIServer, plan_id) {
  let url = APIServer + "/plan_location/delete/plan/" + plan_id;
  let data = {};
  //delete plan_overview
  url = APIServer + "/plan_overview/" + plan_id;
  data.plan_overview = await removePlanOverview(url);

  //delete plan_location plan_startday and plan_detail
  const res = await removePlanDetailnStuff(APIServer, plan_id);
  data.plan_location = res[0].data;
  data.plan_startday = res[1].data;
  data.plan_detail = res[2].data;
  return data;
}