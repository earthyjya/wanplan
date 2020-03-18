const sql = require("./db.js");

const Plan_overview = function(plan_overview) {
  this.plan_title = plan_overview.plan_title;
  this.user_id = plan_overview.user_id;
  this.city_id = plan_overview.city_id;
  this.duration = plan_overview.duration;
  this.plan_style = plan_overview.plan_style;
  this.plan_description = plan_overview.plan_description;
  this.original_id = plan_overview.original_id;
  this.available = plan_overview.available;
  this.star_rating = plan_overview.star_rating;
};

Plan_overview.create = (newPlan, result) => {
  sql.query("INSERT INTO plan_overview SET ?", newPlan, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created plan_overview: ", { id: res.insertId, ...newPlan });
    result(null, { id: res.insertId, ...newPlan });
  });
};

Plan_overview.findById = (id, result) => {
  sql.query(`SELECT * FROM plan_overview WHERE plan_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found plan_overview: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Plan_overview.findByUser = (id, result) => {
  sql.query(`SELECT * FROM plan_overview WHERE user_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found plan_overview: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Plan_overview.findByCity = (id, result) => {
  sql.query(`SELECT * FROM plan_overview WHERE city_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found plan_overview: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Plan_overview.findByStyle = (style, result) => {
  sql.query(`SELECT * FROM plan_overview WHERE plan_style = "${style}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found plan_overview: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Plan_overview.getAll = result => {
  sql.query("SELECT * FROM plan_overview", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("plan_overview: ", res);
    result(null, res);
  });
};

Plan_overview.updateById = (id, plan_overview, result) => {
  sql.query(
    "UPDATE plan_overview SET plan_title = ?, user_id = ?, city_id = ?, duration = ?, plan_style = ?, plan_description = ?, original_id = ?, available = ?, star_rating = ? WHERE plan_id = ?",
    [plan_overview.plan_title, plan_overview.user_id, plan_overview.city_id, plan_overview.duration, plan_overview.plan_style, plan_overview.plan_description, plan_overview.original_id, plan_overview.available, plan_overview.star_rating, id],
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

      console.log("updated plan_overview: ", { id: id, ...plan_overview });
      result(null, { id: id, ...plan_overview });
    }
  );
};

Plan_overview.remove = (id, result) => {
  sql.query("DELETE FROM plan_overview WHERE plan_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted plan_overview with id: ", id);
    result(null, res);
  });
};

module.exports = Plan_overview;