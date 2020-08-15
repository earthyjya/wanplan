import axios from "axios";
export default async function UpdatePlan(
  APIServer,
  plan_id,
  condition,
  toUpdate,
  func
) {
    let data = { error: [], plan_startday: [], plan_detail: [] };
    let url = "";
  console.log(toUpdate)
let promise1 = new Promise(async (resolve,reject) => {
    if (condition == "all" || condition == "plan_overview") {
        //update plan_overview
        url = APIServer + "/plan_overview/" + plan_id;
        await axios
          .put(url, toUpdate.plan_overview)
          .then((res) => {
            // console.log(res);
            data.plan_overview = res.data
            resolve(res.data)
          })
          .catch((error) => {
            console.log(error);
            data.error = [ ...data.error, error ];
            reject(error)
          });
      }else{
        resolve()
    }
})
  
 let promise2 = new Promise(async (resolve,reject) => {
    if (condition == "all" || condition == "plan_startday") {
        //update plan_startday
        url = APIServer + "/plan_startday/delete/" + plan_id;
        await axios
          .delete(url)
          .then((res) => {
            // console.log("delete", res);
          })
          .catch((error) => {
            console.log(error);
            reject(error)
          });
        url = APIServer + "/plan_startday/";
        Promise.all(
        toUpdate.plan_startday.map(async (day) => {
          await axios
            .post(url, day)
            .then((res) => {
              // console.log("post", res);
              data.plan_startday = [...data.plan_startday, res.data];
            })
            .catch((error) => {
              console.log(error);
              data.error = [...data.error, error];
              reject(error)
            });
        })).then(res=> {
            resolve(res.data)
        }).catch(error=>{
            reject(error)
        }
        )
      }else{
          resolve()
      }
})

 
  let promise3 = new Promise(async (resolve,reject) => {
    if (condition == "all" || condition == "plan_detail") {
        //update plan_detail
        url = APIServer + "/plan_detail/delete/" + plan_id;
        await axios
          .delete(url)
          .then((res) => {
            // console.log(res);
          })
          .catch((error) => {
            data.error = [...data.error, error];
            console.log(error);
            reject(error)
          });
    
        url = APIServer + "/plan_detail/";
        Promise.all(
        toUpdate.plan_detail.map(async (plan) => {
          await axios
            .post(url, plan)
            .then((res) => {
              // console.log(res);
              data.plan_detail = [...data.plan_detail, res.data];
            })
            .catch((error) => {
              data.error = [...data.error, error];
              console.log(error);
              
            });
        })).then(res=> {
            resolve(res.data)
        }).catch(error=>{
            reject(error)
        }
        )
      }else{
        resolve()
    }
})

  

 let promise4 = new Promise(async (resolve,reject) => {
    if (condition == "all" || condition == "plan_location") {
        //update plan_location
        url = APIServer + "/plan_location/" + plan_id;
        await axios
          .put(url, toUpdate.plan_location)
          .then((res) => {
            // console.log(res);
            data.plan_location = res.data;
            resolve(res.data)
          })
          .catch((error) => {
            console.log(error);
            data.error = [...data.error, error];
            reject(error)
          });
      }else{
        resolve()
    }
})

Promise.all([promise1,promise2,promise3,promise4]).then(res => {
    func(data);
}).catch(error=>{
    console.log(error)
})
  
  console.log(data)
}
