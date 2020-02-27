module.exports = app => {
  const plan_overview = require("../controllers/plan_overview.controller.js");
  app.get("/api/plan/:planId", plan_overview.loadAllId);
  app.post("/api/plan_overview", plan_overview.create);
  app.post("/api/plan_overview/:planId/:userId", plan_overview.duplicate);
  app.get("/api/plan_overview", plan_overview.findAll);
  app.get("/api/plan_overview/:planId", plan_overview.findId);
  app.get("/api/plan_overview/user/:userId", plan_overview.findUser);
  app.get("/api/plan_overview/city/:cityId", plan_overview.findCity);
  app.get("/api/plan_overview/style/:style", plan_overview.findStyle);
  app.put("/api/plan_overview/:planId", plan_overview.update);
  app.delete("/api/plan_overview/:planId", plan_overview.delete);
};