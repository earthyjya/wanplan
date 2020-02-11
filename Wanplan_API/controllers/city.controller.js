const City = require("../models/city.model.js");
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const city = new City({
	city_name: req.body.city_name,
	prefecture: req.body.prefecture,
	region: req.body.region,
	country_id: req.body.country_id,
  });

  City.create(city, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the City."
      });
    else res.send(data);
  });
};

exports.findAll = (req, res) => {
  City.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving cities."
      });
    else res.send(data);
  });
};

exports.findId = (req, res) => {
  City.findById(req.params.cityId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found city with id ${req.params.cityId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving city with id " + req.params.cityId
        });
      }
    } else res.send(data);
  });
};

exports.findPrefecture = (req, res) => {
  City.findByPrefecture(req.params.prefecture, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found city in prefecture ${req.params.prefecture}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving city in prefecture " + req.params.prefecture
        });
      }
    } else res.send(data);
  });
};

exports.findRegion = (req, res) => {
  City.findByRegion(req.params.region, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found city in region ${req.params.region}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving city in region " + req.params.region
        });
      }
    } else res.send(data);
  });
};

exports.findCountry = (req, res) => {
  City.findByCountry(req.params.countryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found city in country ${req.params.countryId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving city in country " + req.params.countryId
        });
      }
    } else res.send(data);
  });
};

exports.delete = (req, res) => {
  City.remove(req.params.cityId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found City with id ${req.params.cityId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete City with id " + req.params.cityId
        });
      }
    } else res.send({ message: `City was deleted successfully!` });
  });
};