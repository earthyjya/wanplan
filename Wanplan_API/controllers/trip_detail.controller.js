const Trip_detail = require("../models/trip_detail.model.js");
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const trip_detail = new Trip_detail({
	trip_id: req.body.trip_id,
	user_id: req.body.user_id,
	day: req.body.day,
	attraction_order: req.body.attraction_order,
	start_time: req.body.start_time,
	end_time: req.body.end_time,
	time_spend: req.body.time_spend,
	attraction_id: req.body.attraction_id
  });

  Trip_detail.create(trip_detail, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the trip detail."
      });
    else res.send(data);
  });
};

exports.findTripId = (req, res) => {
  Trip_detail.findByTripId(req.params.tripId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip detail with id ${req.params.tripId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Trip detail with id " + req.params.tripId
        });
      }
    } else res.send(data);
  });
};

exports.duplicate = (req, res) => {
  Trip_detail.findByTripId(req.params.tripId, (err, data) => {
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
		let array = [];
		for(let i=0;i<data.length;i++){
			const trip_detail = new Trip_detail({
				trip_id: req.params.newTripId,
				user_id: req.params.userId,
				day: data[i].day,
				attraction_order: data[i].attraction_order,
				start_time: data[i].start_time,
				end_time: data[i].end_time,
				time_spend: data[i].time_spend,
				attraction_id: data[i].attraction_id
			});
			Trip_detail.create(trip_detail, (err, data2) => {
				if (err)
				res.status(500).send({
					message:
					err.message || "Some error occurred while duplicating the trip detail."
				});
				else array.concat(data2);
			});
		}
		res.send(array);
	}
  });
};

exports.deleteTripIdAll = (req, res) => {
  Trip_detail.removeTripIdAll(req.params.tripId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip_detail with id ${req.params.tripId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Trip_detail with id " + req.params.tripId
        });
      }
    } else res.send({ message: `Trip_detail was deleted successfully!` });
  });
};

exports.deleteTripIdOne = (req, res) => {
  Trip_detail.removeTripIdOne(req.params.tripId, req.params.day, req.params.order, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip_detail with id ${req.params.tripId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Trip_detail with id " + req.params.tripId
        });
      }
    } else res.send({ message: `Trip_detail was deleted successfully!` });
  });
};

exports.deleteUser = (req, res) => {
  Trip_detail.removeUser(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Trip_detail with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Trip_detail of user with id " + req.params.userId
        });
      }
    } else res.send({ message: `Trip_detail was deleted successfully!` });
  });
};

exports.updateOne = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Trip_detail.updateByIdOne(
    req.params.tripId, req.params.day, req.params.order,
    new Trip_detail(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Trip_detail with id ${req.params.tripId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Trip_detail with id " + req.params.tripId
          });
        }
      } else res.send(data);
    }
  );
};