module.exports = app => {
  const city = require("../controllers/city.controller.js");
  app.post("/api/city", city.create);
  app.get("/api/city", city.findAll);
  app.get("/api/city/:cityId", city.findId);
  app.get("/api/city/prefecture/:prefecture", city.findPrefecture);
  app.get("/api/city/region/:region", city.findRegion);
  app.get("/api/city/country/:countryId", city.findCountry);
  app.delete("/api/city/:cityId", city.delete);
};