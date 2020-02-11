module.exports = app => {
  const trip_overview = require("../controllers/trip_overview.controller.js");
  app.post("/api/trip_overview", trip_overview.create);
  app.post("/api/trip_overview/:tripId/:userId", trip_overview.duplicate);
  app.get("/api/trip_overview", trip_overview.findAll);
  app.get("/api/trip_overview/:tripId", trip_overview.findId);
  app.get("/api/trip_overview/user/:userId", trip_overview.findUser);
  app.get("/api/trip_overview/city/:cityId", trip_overview.findCity);
  app.get("/api/trip_overview/style/:style", trip_overview.findStyle);
  app.put("/api/trip_overview/:tripId", trip_overview.update);
  app.delete("/api/trip_overview/:tripId", trip_overview.delete);
};