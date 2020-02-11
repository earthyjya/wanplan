module.exports = app => {
  const attraction = require("../controllers/attraction.controller.js");
  app.post("/api/attraction", attraction.create);
  app.get("/api/attraction", attraction.findAll);
  app.get("/api/attraction/:attractionId", attraction.findId);
  app.get("/api/attraction/city/:cityId", attraction.findCity);
  app.get("/api/attraction/style/:style", attraction.findStyle);
  app.put("/api/attraction/:attractionId", attraction.update);
  app.delete("/api/attraction/:attractionId", attraction.delete);
};