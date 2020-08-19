import axios from "axios";

const duplicatePlanOverview = async (url) => {
  return await axios
  .post(url)
  .then((result) => {
    if (result.data === null) alert("Could not duplicate plan :(");
    // console.log(result);
    //  console.log("new plan id is" + newPlanId)
    return result.data;
  })
  .catch((error) => console.log(error));
}

const duplicatePlanDetailnStuff = async (APIServer,oldPlanId,newPlanId) => {
  let urlStartday = APIServer + "/plan_startday/" + oldPlanId + "/" + newPlanId;
  let urlDetail = APIServer + "/plan_detail/" + oldPlanId + "/" + newPlanId;
  let urlLocation = APIServer + "/plan_location/" + oldPlanId + "/" + newPlanId;

  //duplicate plan_startday plan_detail and plan_location
  return await Promise.all([
    axios.post(urlStartday),
    axios.post(urlDetail),
    axios.post(urlLocation),
  ])
    .catch((err) => console.log(err));
}

export default async function DuplicatePlan(APIServer, oldPlanId, user_id) {
  // Duplicate plan_overview
  let newPlanId = null;
  let data = {};
  let url = APIServer + "/plan_overview/" + oldPlanId + "/" + user_id;
  data.plan_overview = await duplicatePlanOverview(url)
  newPlanId = data.plan_overview.id;

  const results = await duplicatePlanDetailnStuff (APIServer,oldPlanId,newPlanId)

  data.plan_startday = results[0].data;
  data.plan_detail = results[1].data;
  data.plan_location = results[2].data;
  return data;
  //  console.log(data)
}
