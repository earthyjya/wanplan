module.exports = app => {
  const plan_detail = require("../controllers/plan_detail.controller.js");
  app.post("/api/plan_detail", plan_detail.create);
  app.post("/api/plan_detail/:planId/:newPlanId", plan_detail.duplicate);
  app.get("/api/plan_detail/:planId", plan_detail.findPlanId);
  app.put("/api/plan_detail/:planId/:day/:order", plan_detail.updateOne);
  app.delete("/api/plan_detail/delete/:planId", plan_detail.deletePlanIdAll);
  app.delete("/api/plan_detail/delete/:planId/:day/:order", plan_detail.deletePlanIdOne);
};