module.exports = app => {
  const imagex = require("../controllers/image.controller.js");
  app.post("/api/image", imagex.create);
  app.get("/api/image/:imageId", imagex.findImageId);
  app.put("/api/image/:imageId", imagex.updateId);
  app.delete("/api/image/:planId", imagex.deleteId);
};