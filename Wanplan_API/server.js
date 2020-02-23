const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

/*
app.get("/", (req, res) => {
  res.json({ message: "Hello World." });
});
*/

require("./routes/city.routes.js")(app);
require("./routes/user.routes.js")(app);
require("./routes/trip_overview.routes.js")(app);
require("./routes/attraction.routes.js")(app);
require("./routes/country.routes.js")(app);
require("./routes/trip_detail.routes.js")(app);

// set port, listen for requests
app.listen(3030, () => {
  console.log("Server is running on port 3030.");
});