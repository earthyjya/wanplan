const Plan_detail = require("../models/plan_detail.model.js");
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  const plan_detail = new Plan_detail({
	plan_id: req.body.plan_id,
	day: req.body.day,
	attraction_order: req.body.attraction_order,
	start_time: req.body.start_time,
	end_time: req.body.end_time,
	time_spend: req.body.time_spend,
	attraction_id: req.body.attraction_id,
	description: req.body.description
  });

  Plan_detail.create(plan_detail, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the plan_detail."
      });
    else res.send(data);
  });
};

exports.findPlanId = (req, res) => {
  Plan_detail.findByPlanId(req.params.planId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found plan_detail with plan_id ${req.params.planId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving plan_detail with plan_id " + req.params.planId
        });
      }
    } else res.send(data);
  });
};

exports.duplicate = (req, res) => {
  Plan_detail.findByPlanId(req.params.planId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found plan_detail with plan_id ${req.params.planId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving plan_detail with plan_id " + req.params.planId
        });
      }
    } 
	else {
		let array = [];
		for(let i=0;i<data.length;i++){
			const plan_detail = new Plan_detail({
				plan_id: req.params.newPlanId,
				day: data[i].day,
				attraction_order: data[i].attraction_order,
				start_time: data[i].start_time,
				end_time: data[i].end_time,
				time_spend: data[i].time_spend,
				attraction_id: data[i].attraction_id,
				description: data[i].description
			});
			Plan_detail.create(plan_detail, (err, data2) => {
				if (err)
				res.status(500).send({
					message:
					err.message || "Some error occurred while duplicating plan_detail with plan_id " + req.params.planId
				});
				else array.concat(data2);
			});
		}
		res.send(array);
	}
  });
};

exports.deletePlanIdAll = (req, res) => {
  Plan_detail.removePlanIdAll(req.params.planId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found plan_detail with plan_id ${req.params.planId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete plan_detail with plan_id " + req.params.planId
        });
      }
    } else res.send({ message: `Plan_detail with plan_id was deleted successfully!` });
  });
};

exports.deletePlanIdOne = (req, res) => {
  Plan_detail.removePlanIdOne(req.params.planId, req.params.day, req.params.order, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found plan_detail with plan_id ${req.params.planId} day ${req.params.day} attraction_order ${req.params.order}..`
        });
      } else {
        res.status(500).send({
          message: `Not found plan_detail with plan_id ${req.params.planId} day ${req.params.day} attraction_order ${req.params.order}.`
        });
      }
    } else res.send({ message: `Plan_detail with plan_id ${req.params.planId} day ${req.params.day} attraction_order ${req.params.order}. was deleted successfully!` });
  });
};

exports.updateOne = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  Plan_detail.updateByIdOne(
    req.params.planId, req.params.day, req.params.order,
    new Plan_detail(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found plan_detail with plan_id  ${req.params.planId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating plan_detail with plan_id  " + req.params.planId
          });
        }
      } else res.send(data);
    }
  );
};