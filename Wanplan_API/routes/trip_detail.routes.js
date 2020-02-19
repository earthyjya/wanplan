module.exports = app => {
  const trip_detail = require("../controllers/trip_detail.controller.js");
  app.post("/api/trip_detail", trip_detail.create);
  app.post("/api/trip_detail/:tripId/:userId/:newTripId", trip_detail.duplicate);
  app.get("/api/trip_detail/:tripId", trip_detail.findTripId);
  app.put("/api/trip_detail/:tripId/:day/:order", trip_detail.updateOne);
  app.delete("/api/trip_detail/delete/trip/:tripId", trip_detail.deleteTripIdAll);
  app.delete("/api/trip_detail/delete/trip/:tripId/:day/:order", trip_detail.deleteTripIdOne);
  app.delete("/api/trip_detail/delete/user/:userId", trip_detail.deleteUser);
};