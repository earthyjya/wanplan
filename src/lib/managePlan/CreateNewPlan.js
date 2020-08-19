import axios from "axios";

const createPlanStartday = (url, startDay) => {
  axios
    .post(url, startDay)
    .catch((error) => console.log(error));
};

const createPlanLocation = (url, plan_location) => {
  axios
    .post(url, plan_location)
    .catch((error) => console.log(error));
};

const createPlanOverview = async (url, newPlan) => {
  return axios
    .post(url, newPlan)
    .then((result) => {
      if (result.data === null) alert("Could not create new plan :(");
      return result
    })
    .catch((error) => {
      console.log(error);
    });
};

export async function CreateNewPlan(
  APIServer,
  newUserId
) {
  const newPlan = {
    plan_title: "untitled",
    user_id: newUserId,
    city_id: 12,
    duration: 1,
    plan_style: "",
    plan_description: "",
    original_id: 0,
    available: 0,
    star_rating: 0,
  };
  let startDay = { day: 1, start_day: "09:00" };
  let plan_location = { city_id: 12 };
  let url = APIServer + "/plan_overview";

  let result = await createPlanOverview(url, newPlan);

  newPlan.plan_id = result.data.id;
  startDay.plan_id = result.data.id;
  plan_location.plan_id = result.data.id;

  url = APIServer + "/plan_startday";
  createPlanStartday(url, startDay);

  url = APIServer + "/plan_location";
  createPlanLocation(url, plan_location);

  return newPlan
  // console.log(result);
}

export function CreateNewPlanInCache(newPlan){
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
