import axios from "axios";
export default async function CreateNewPlan(
  APIServer,
  user_id,
  isLoggedIn,
  RedirectFunc
) {
  let newUserId = 0;
  if (isLoggedIn) newUserId = user_id;
  const newPlan = {
    plan_title: "untitled",
    user_id: newUserId,
    city_id: 2,
    duration: 1,
    plan_style: "",
    plan_description: "",
    original_id: 0,
    available: 0,
    star_rating: 0,
  };
  // console.log(newPlan)
  let startDay = { day: 1, start_day: "09:00" };
  let plan_location = { city_id: 12 };
  let url = APIServer + "/plan_overview";
  await axios
    .post(url, newPlan)
    .then(async (result) => {
      // console.log(result)
      if (result.data === null) alert("Could not create new plan :(");
      else {
        newPlan.plan_id = result.data.id;
        if (!isLoggedIn) {
          if (
            localStorage.getItem("planlist") === null ||
            localStorage.getItem("planlist") === []
          ) {
            var _planlist = [];
            _planlist[0] = newPlan;
            localStorage.setItem("planlist", JSON.stringify(_planlist));
          } else {
            let _planlist = JSON.parse(localStorage.getItem("planlist"));
            _planlist.push(newPlan);
            // console.log(_planlist);
            localStorage.setItem("planlist", JSON.stringify(_planlist));
          }
        }
        startDay.plan_id = result.data.id;
        plan_location.plan_id = result.data.id;
        // console.log(startDay);
        url = APIServer + "/plan_startday";
        await axios
          .post(url, startDay)
          .then((result) => {
            // console.log(result);
          })
          .catch((error) => console.log(error));
        url = APIServer + "/plan_location";
        await axios
          .post(url, plan_location)
          .then((result) => {
            // console.log(result);
          })
          .catch((error) => console.log(error));
        RedirectFunc(newPlan.plan_id);
        // console.log(result);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
