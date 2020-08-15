import axios from "axios";
export default async function DuplicatePlan(
  APIServer,
  oldPlanId,
  user_id,
  func
) {
  // Duplicate plan_overview
  let newPlanId = null;
  let data = {};
  let url = APIServer + "/plan_overview/" + oldPlanId + "/" + user_id;
  await axios
    .post(url)
    .then((result) => {
      if (result.data === null) alert("Could not duplicate plan :(");
      // console.log(result);
      newPlanId = result.data.id;
      //  console.log("new plan id is" + newPlanId)
      data.plan_overview = result.data;
    })
    .catch((error) => {
      //  this.setState({ error });
    });

  let urlStartday = APIServer + "/plan_startday/" + oldPlanId + "/" + newPlanId;
  let urlDetail = APIServer + "/plan_detail/" + oldPlanId + "/" + newPlanId;
  let urlLocation = APIServer + "/plan_location/" + oldPlanId + "/" + newPlanId;

  //duplicate plan_startday plan_detail and plan_location

  await axios
    .all([
      axios.post(urlStartday),
      axios.post(urlDetail),
      axios.post(urlLocation),
    ])
    .then(
      axios.spread((...res) => {
        data.plan_startday = res[0].data;
        data.plan_detail = res[1].data;
        data.plan_location = res[2].data;
      })
    )
    .catch((err) => console.log(err));

  await func(data);
  //  console.log(data)
}
