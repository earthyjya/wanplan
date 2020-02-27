module.exports = app => {
  const load_plan = require("../controllers/load_plan.controller.js");
  app.get("/api/load_plan/:planId", load_plan.loadAllId);
};