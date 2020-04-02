module.exports = app => {
  const plan_startday = require("../controllers/plan_startday.controller.js");
  app.post("/api/plan_startday", plan_startday.create);
  app.post("/api/plan_startday/:planId/:newPlanId", plan_startday.duplicate);
  app.get("/api/plan_startday/:planId", plan_startday.findPlanId);
  app.put("/api/plan_startday/:planId/:day", plan_startday.updateOne);
  app.delete("/api/plan_startday/delete/:planId", plan_startday.deletePlanIdAll);
  app.delete("/api/plan_startday/delete/:planId/:day", plan_startday.deletePlanIdOne);
};