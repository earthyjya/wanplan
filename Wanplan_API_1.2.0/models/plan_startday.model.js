const sql = require("./db.js");

const Plan_startday = function(plan_startday) {
  this.plan_id = plan_startday.plan_id;
  this.day = plan_startday.day;
  this.start_day = plan_startday.start_day;
};

Plan_startday.create = (newPlan, result) => {
  sql.query("INSERT INTO plan_startday SET ?", newPlan, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created plan_startday: ", { id: res.insertId, ...newPlan });
    result(null, { id: res.insertId, ...newPlan });
  });
};

Plan_startday.findByPlanId = (id, result) => {
  sql.query(`SELECT * FROM plan_startday WHERE plan_id = ${id} ORDER BY day`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found plan_startday: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Plan_startday.removePlanIdAll = (id, result) => {
  sql.query("DELETE FROM plan_startday WHERE plan_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted plan_startday with id: ", id);
    result(null, res);
  });
};

Plan_startday.removePlanIdOne = (id, day, result) => {
  sql.query("DELETE FROM plan_startday WHERE plan_id = ? AND day = ?", [id, day], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted plan_startday with id: ", id);
    result(null, res);
  });
};

Plan_startday.updateByIdOne = (id, day, plan_startday, result) => {
  sql.query(
    "UPDATE plan_startday SET plan_id = ?, day = ?, start_day = ? WHERE plan_id = ? AND day = ?",
    [plan_startday.plan_id, plan_startday.day, plan_startday.start_day, id, day],
	(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated plan_startday: ", { id: id, ...plan_startday });
      result(null, { id: id, ...plan_startday });
    }
  );
};

module.exports = Plan_startday;
