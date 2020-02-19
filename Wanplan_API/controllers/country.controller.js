const Country = require("../models/country.model.js");

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const country = new Country({
	country_name: req.body.country_name,
	continent: req.body.continent,
  });

  Country.create(country, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the country."
      });
    else res.send(data);
  });
};

exports.findAll = (req, res) => {
  Country.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Country."
      });
    else res.send(data);
  });
};

exports.delete = (req, res) => {
  Country.remove(req.params.countryId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Country with id ${req.params.countryId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Country with id " + req.params.countryId
        });
      }
    } else res.send({ message: `Country was deleted successfully!` });
  });
};