const Trip_overview = require("../models/trip_overview.model.js");
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const trip_overview = new Trip_overview({
	trip_name: req.body.trip_name,
	user_id: req.body.user_id,
	city_id: req.body.city_id,
	duration: req.body.duration,
	trip_style: req.body.trip_style,
	star_rating: req.body.star_rating
  });

  Trip_overview.create(trip_overview, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    else res.send(data);
  });
};

exports.findId = (req, res) => {
  Trip_overview.findById(req.params.tripId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip overview with id ${req.params.tripId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Trip overview with id " + req.params.tripId
        });
      }
    } else res.send(data);
  });
};

exports.findUser = (req, res) => {
  Trip_overview.findByUser(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip overview of user with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Trip overview of user with id " + req.params.userId
        });
      }
    } else res.send(data);
  });
};

exports.findCity = (req, res) => {
  Trip_overview.findByCity(req.params.cityId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip overview of city with id ${req.params.cityId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Trip overview of city with id " + req.params.cityId
        });
      }
    } else res.send(data);
  });
};

exports.findStyle = (req, res) => {
  Trip_overview.findByStyle(req.params.style, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip overview of style ${req.params.style}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Trip overview of style " + req.params.style
        });
      }
    } else res.send(data);
  });
};

exports.findAll = (req, res) => {
  Trip_overview.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving trip_overview."
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Trip_overview.updateById(
    req.params.tripId,
    new Trip_overview(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Trip_overview with id ${req.params.tripId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Trip_overview with id " + req.params.tripId
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  Trip_overview.remove(req.params.tripId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip_overview with id ${req.params.tripId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Trip_overview with id " + req.params.tripId
        });
      }
    } else res.send({ message: `Trip_overview was deleted successfully!` });
  });
};

exports.duplicate = (req, res) => {
  Trip_overview.findById(req.params.tripId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip overview with id ${req.params.tripId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Trip overview with id " + req.params.tripId
        });
      }
    } 
	else {
		const trip_overview = new Trip_overview({
			trip_name: data[0].trip_name,
			user_id: req.params.userId,
			city_id: data[0].city_id,
			duration: data[0].duration,
			trip_style: data[0].trip_style,
			star_rating: data[0].star_rating
		});
		Trip_overview.create(trip_overview, (err, data2) => {
			if (err)
			res.status(500).send({
				message:
				err.message || "Some error occurred while duplicating the trip overview."
			});
			else res.send(data2);
		});
	}
  });
};