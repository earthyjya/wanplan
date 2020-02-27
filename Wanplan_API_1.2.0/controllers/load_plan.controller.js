const Load_plan = require("../models/load_plan.model.js");

exports.loadAllId = (req, res) => {
  Load_plan.loadPlanId(req.params.planId, (err, data1) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found plan with plan_id ${req.params.planId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving plan with plan_id " + req.params.planId
        });
      }
    } else {
      Load_plan.loadStartDay(req.params.planId, (err, data2) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found startday of plan with plan_id ${req.params.planId}.`
            });
          } else {
            res.status(500).send({
              message:
                "Error retrieving startday of plan with plan_id " +
                req.params.planId
            });
          }
        } else {
          Load_plan.loadDetailId(req.params.planId, (err, data3) => {
            if (err) {
              if (err.kind === "not_found") {
                res.status(404).send({
                  message: `Not found detail of plan with plan_id ${req.params.planId}.`
                });
              } else {
                res.status(500).send({
                  message:
                    "Error retrieving detail of plan with plan_id " +
                    req.params.planId
                });
              }
            } else
              res.send({
                plan_overview: data1[0],
                plan_startday: data2,
                plan_detail: data3
              });
          });
        }
      });
    }
  });
};
