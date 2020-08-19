import axios from "axios";

export const UpdateOverview = async (APIServer, plan_id, toUpdate) => {
  const url = APIServer + "/plan_overview/" + plan_id;
  console.log(toUpdate)
  return axios.put(url, toUpdate.plan_overview).then((res) => res.data).catch(err => console.log(err));
};

export const UpdateStartday = async (APIServer, plan_id, toUpdate) => {
  let url = APIServer + "/plan_startday/delete/" + plan_id;
  await axios.delete(url);

  url = APIServer + "/plan_startday/";
  let results = await Promise.all(
    toUpdate.plan_startday.map(
      async (day) => await axios.post(url, day).then((res) => res.data).catch(err => console.log(err))
    )
  );
  return results;
};

export const UpdateDetail = async (APIServer, plan_id, toUpdate) => {
  let url = APIServer + "/plan_detail/delete/" + plan_id;
  await axios.delete(url);

  url = APIServer + "/plan_detail/";
  let results = await Promise.all(
    toUpdate.plan_detail.map(
      async (plan) => await axios.post(url, plan).then((res) => res.data).catch(err => console.log(err))
    )
  );
  return results;
};

export const UpdateLocation = async (APIServer, plan_id, toUpdate) => {
  const url = APIServer + "/plan_location/" + plan_id;
  return axios.put(url, toUpdate.plan_location).then((res) => res.data).catch(err => console.log(err));
};

export default async function UpdatePlan(
  APIServer,
  plan_id,
  toUpdate
) {
  let promise1 = UpdateOverview(APIServer, plan_id,  toUpdate);
  let promise2 = UpdateStartday(APIServer, plan_id,  toUpdate);
  let promise3 = UpdateDetail(APIServer, plan_id,  toUpdate);
  let promise4 = UpdateLocation(APIServer, plan_id,  toUpdate);

  let data = await Promise.all([
    promise1,
    promise2,
    promise3,
    promise4,
  ]).catch((error) => console.log(error));
  return data;
}
