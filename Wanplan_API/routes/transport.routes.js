module.exports = app => {
  const transport = require("../controllers/transport.controller.js");
  app.post("/api/transport", transport.create);
  app.get("/api/transport/find/from/:sourceId", transport.findAllFrom);
  app.get("/api/transport/find/to/:destinationId", transport.findAllTo);
  app.get("/api/transport/find/:sourceId/:destinationId", transport.findPair);
  app.put("/api/transport/:sourceId/:destinationId", transport.updateOne);
  app.delete("/api/transport/delete/from/:sourceId", transport.deleteFrom);
  app.delete("/api/transport/delete/to/:destinationId", transport.deleteTo);
  app.delete("/api/transport/delete/:sourceId/:destinationId", transport.deletePair);
};