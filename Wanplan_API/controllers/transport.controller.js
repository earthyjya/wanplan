const Transport = require("../models/transport.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  const transport = new Transport({
	source_id: req.body.source_id,
	destination_id: req.body.destination_id,
	walk: req.body.walk,
	bicycle: req.body.bicycle,
	train: req.body.train,
	car: req.body.car
  });

  Transport.create(transport, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the transport."
      });
    else res.send(data);
  });
};

exports.findAllFrom = (req, res) => {
  Transport.findAllFromOne(req.params.sourceId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transport with source_id ${req.params.sourceId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving transport with source_id " + req.params.sourceId
        });
      }
    } else res.send(data);
  });
};

exports.findAllTo = (req, res) => {
  Transport.findAllToOne(req.params.destinationId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transport with destination_id ${req.params.destinationId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving transport with destination_id " + req.params.destinationId
        });
      }
    } else res.send(data);
  });
};

exports.findPair = (req, res) => {
  Transport.findByPair(req.params.sourceId, req.params.destinationId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transport with source_id ${req.params.sourceId} destination_id ${req.params.destinationId}.`
        });
      } else {
        res.status(500).send({
          message: `Error retrieving transport with source_id ${req.params.sourceId} destination_id ${req.params.destinationId}.`
        });
      }
    } else res.send(data);
  });
};

exports.deleteFrom = (req, res) => {
  Transport.removeFromOne(req.params.sourceId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transport with source_id ${req.params.sourceId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete transport with source_id " + req.params.sourceId
        });
      }
    } else res.send({ message: `Transport with source_id ${req.params.sourceId} was deleted successfully!` });
  });
};

exports.deleteTo = (req, res) => {
  Transport.removeToOne(req.params.destinationId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transport with destination_id ${req.params.destinationId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete transport with destination_id " + req.params.destinationId
        });
      }
    } else res.send({ message: `Transport with destination_id ${req.params.destinationId} was deleted successfully!` });
  });
};

exports.deletePair = (req, res) => {
  Transport.removePair(req.params.sourceId, req.params.destinationId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found transport with source_id ${req.params.sourceId} destination_id ${req.params.destinationId}.`
        });
      } else {
        res.status(500).send({
          message: `Could not delete transport with source_id ${req.params.sourceId} destination_id ${req.params.destinationId}.`
        });
      }
    } else res.send({ message: `Transport with source_id ${req.params.sourceId} destination_id ${req.params.destinationId} was deleted successfully!` });
  });
};

exports.updateOne = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  Transport.updateByPair(
    req.params.sourceId, req.params.destinationId,
    new Transport(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found transport with source_id ${req.params.sourceId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating transport with source_id " + req.params.sourceId
          });
        }
      } else res.send(data);
    }
  );
};