module.exports = app => {
  const user = require("../controllers/user.controller.js");
  app.post("/api/user", user.create);
  app.get("/api/user/:userId", user.findId);
  app.get("/api/user/username/:username", user.findUsername);
  app.get("/api/user/email/:email", user.findEmail);
  app.get("/api/user", user.findAll);
  app.put("/api/user/:userId", user.update);
  app.delete("/api/user/:userId", user.delete);
};