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
    })
    .catch((error) => console.error(error));

  let urlLocation = APIServer + "/plan_location/delete/plan/" + plan_id;
  let urlStartday = APIServer + "/plan_startday/delete/" + plan_id;
  let urlDetail = APIServer + "/plan_detail/delete/" + plan_id;

  //delete plan_location plan_startday and plan_detail

  await axios
    .all([
      axios.delete(urlLocation),
      axios.delete(urlStartday),
      axios.delete(urlDetail),
    ])
    .then(
      axios.spread((...res) => {
        data.plan_location = res[0].data;
        data.plan_startday = res[1].data;
        data.plan_detail = res[2].data;
      })
    )
    .catch((err) => console.log(err));

  await func(data);
  // console.log(data)
}
