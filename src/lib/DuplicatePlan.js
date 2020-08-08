import axios from "axios";
export default async function DuplicatePlan(APIServer, oldPlanId, user_id, func){
     // Duplicate plan_overview
     let newPlanId = null
     let url = APIServer + "/plan_overview/" + oldPlanId + "/" + user_id;
     let data = {}
     await axios
       .post(url)
       .then((result) => {
         if (result.data === null) alert("Could not duplicate plan :(");
         // console.log(result);
         newPlanId = result.data.id;
        //  console.log("new plan id is" + newPlanId)
         data.plan_overview = result.data
       })
       .catch((error) => {
        //  this.setState({ error });
       });

     // Duplicate plan_startday
     url = APIServer + "/plan_startday/" + oldPlanId + "/" + newPlanId;
    //  console.log('url = ' + url)
     await axios
       .post(url)
       .then((result) => {
         if (result.data === null) alert("Could not duplicate plan_startday :(");
        data.plan_startday = result.data
        //  console.log(result);
       })
       .catch((error) => {
        //  this.setState({ error });
         console.log(error);
       });

     // Duplicate plan_detail
     url = APIServer + "/plan_detail/" + oldPlanId + "/" + newPlanId;
    //  console.log('url = ' + url)
     await axios
       .post(url)
       .then((result) => {
         if (result.data === null) alert("Could not duplicate plan_detail :(");
        //  console.log(result);
         data.plan_detail = result.data
       })
       .catch((error) => {
         console.log(error);
       });

     // Duplicate plan_location
     url = APIServer + "/plan_location/" + oldPlanId + "/" + newPlanId;
    //  console.log('url = ' + url)
     await axios
     .post(url)
     .then((result) => {
       if (result.data === null) alert("Could not duplicate plan_location :(");
        data.plan_location = result.data
        // console.log(result)
     })
     .catch((error) => {
      //  this.setState({ error });
       console.log(error);
     });
     await func(data)
    //  console.log(data)
}