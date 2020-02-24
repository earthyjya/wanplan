const Attraction = require("../models/attraction.model.js");
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  const attraction = new Attraction({
	attraction_name: req.body.attraction_name,
	attraction_type: req.body.attraction_type,
	open_time: req.body.open_time,
	close_time: req.body.close_time,
	description: req.body.description,
	city_id: req.body.city_id
  });

  Attraction.create(attraction, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the attraction."
      });
    else res.send(data);
  });
};

exports.findId = (req, res) => {
  Attraction.findById(req.params.attractionId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found the attraction with attraction_id ${req.params.attractionId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving the attraction with attraction_id " + req.params.attractionId
        });
      }
    } else res.send(data);
  });
};

exports.findStyle = (req, res) => {
  Attraction.findByStyle(req.params.style, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found style ${req.params.style} attraction.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving style " + req.params.style + " attraction."
        });
      }
    } else res.send(data);
  });
};

exports.findCity = (req, res) => {
  Attraction.findByCity(req.params.cityId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found attraction in the city with city_id ${req.params.cityId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving attraction in the city with city_id " + req.params.cityId
        });
      }
    } else res.send(data);
  });
};

exports.findAll = (req, res) => {
  Attraction.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving attraction."
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  Attraction.updateById(
    req.params.attractionId,
    new Attraction(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found the attraction with attraction_id ${req.params.attractionId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating the attraction with attraction_id " + req.params.attractionId
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  Attraction.remove(req.params.attractionId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found the attraction with attraction_id ${req.params.attractionId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete the attraction with attraction_id " + req.params.attractionId
        });
      }
    } else res.send({ message: `The attraction with attraction_id ${req.params.attractionId} was deleted successfully!` });
  });
};