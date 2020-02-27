const User = require("../models/user.model.js");
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  const user = new User({
	username: req.body.username,
	name: req.body.name,
	surname: req.body.surname,
	user_description: req.body.user_description,
	email: req.body.email,
	nationality: req.body.nationality,
	city: req.body.city,
    origin: req.body.origin,
  });

  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the user."
      });
    else res.send(data);
  });
};

exports.findId = (req, res) => {
  User.findById(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with user_id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with user_id " + req.params.userId
        });
      }
    } else res.send(data);
  });
};

exports.findUsername = (req, res) => {
  User.findByUsername(req.params.username, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with username ${req.params.username}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with username " + req.params.username
        });
      }
    } else res.send(data);
  });
};

exports.findEmail = (req, res) => {
  User.findByEmail(req.params.email, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with email ${req.params.email}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with email " + req.params.email
        });
      }
    } else res.send(data);
  });
};

exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  User.updateById(
    req.params.userId,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found user with user_id ${req.params.userId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating user with user_id " + req.params.userId
          });
        }
      } else res.send(data);
    }
  );
};

exports.delete = (req, res) => {
  User.remove(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with user_id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete user with user_id " + req.params.userId
        });
      }
    } else res.send({ message: `User with user_id ${req.params.userId} was deleted successfully!` });
  });
};