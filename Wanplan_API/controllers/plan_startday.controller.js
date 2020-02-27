const Plan_startday = require("../models/plan_startday.model.js");

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  const plan_startday = new Plan_startday({
	plan_id: req.body.plan_id,
	day: req.body.day,
	start_day: req.body.start_day
  });

  Plan_startday.create(plan_startday, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the plan_startday."
      });
    else res.send(data);
  });
};

exports.findAll = (req, res) => {
  Plan_startday.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving plan_startday."
      });
    else res.send(data);
  });
};

exports.findPlanId = (req, res) => {
  Plan_startday.findByPlanId(req.params.planId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found plan_startday with plan_id ${req.params.planId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving plan_startday with plan_id " + req.params.planId
        });
      }
    } else res.send(data);
  });
};

exports.duplicate = (req, res) => {
  Plan_startday.findByPlanId(req.params.planId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found plan_startday with plan_id ${req.params.planId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving plan_startday with plan_id " + req.params.planId
        });
      }
    } 
	else {
		let array = [];
		for(let i=0;i<data.length;i++){
			const plan_startday = new Plan_startday({
				plan_id: req.params.newPlanId,
				day: data[i].day,
				start_day: data[i].start_day
			});
			Plan_startday.create(plan_startday, (err, data2) => {
				if (err)
				res.status(500).send({
					message:
					err.message || "Some error occurred while duplicating plan_startday with plan_id." + req.params.planId
				});
				else array.concat(data2);
			});
		}
		res.send(array);
	}
  });
};

exports.deletePlanIdAll = (req, res) => {
  Plan_startday.removePlanIdAll(req.params.planId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found plan_startday with plan_id ${req.params.planId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete plan_startday with plan_id " + req.params.planId
        });
      }
    } else res.send({ message: `Plan_startday with plan_id ${req.params.planId} was deleted successfully!` });
  });
};

exports.deletePlanIdOne = (req, res) => {
  Plan_startday.removePlanIdOne(req.params.planId, req.params.day, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found plan_startday with plan_id ${req.params.planId} day ${req.params.day}.`
        });
      } else {
        res.status(500).send({
          message: `Could not delete plan_startday with plan_id ${req.params.planId} day ${req.params.day}.`
        });
      }
    } else res.send({ message: `Plan_id ${req.params.planId} day ${req.params.day} was deleted successfully!` });
  });
};

exports.updateOne = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  Plan_startday.updateByIdOne(
    req.params.planId, req.params.day,
    new Plan_startday(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found plan_startday with plan_id ${req.params.planId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating plan_startday with plan_id " + req.params.planId
          });
        }
      } else res.send(data);
    }
  );
};