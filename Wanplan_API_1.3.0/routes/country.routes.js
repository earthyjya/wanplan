module.exports = app => {
  const country = require("../controllers/country.controller.js");
  app.post("/api/country", country.create);
  app.get("/api/country", country.findAll);
  app.delete("/api/country/:countryId", country.delete);
};