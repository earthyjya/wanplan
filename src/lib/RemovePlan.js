import axios from "axios";
export default async function RemovePlan(APIServer, plan_id, func) {
  let url = APIServer + "/plan_location/delete/plan/" + plan_id;
  let data = {};
  //delete plan_overview
  url = APIServer + "/plan_overview/" + plan_id;
  await axios
    .delete(url)
    .then(async (result) => {
      data.plan_overview = result.data;
      //delete plan_location
      await axios
        .delete(url)
        .then((result) => (data.plan_location = result.data))
        .catch((error) => console.error(error));

      //delete plan_startday
      url = APIServer + "/plan_startday/delete/" + plan_id;
      await axios
        .delete(url)
        .then((result) => (data.plan_startday = result.data))
        .catch((error) => console.error(error));

      //delete plan_detail
      url = APIServer + "/plan_detail/delete/" + plan_id;
      await axios
        .delete(url)
        .then((result) => (data.plan_detail = result.data))
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));

  await func(data);
  // console.log(data)
}
