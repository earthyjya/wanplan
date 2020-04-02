const sql = require("./db.js");

const Load_plan = function(plan_overview) {
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

Load_plan.loadPlanId = (id, result) => {
  sql.query(
    `SELECT * FROM plan_overview 
  INNER JOIN user ON plan_overview.user_id = user.user_id 
  INNER JOIN city ON plan_overview.city_id = city.city_id 
  INNER JOIN country ON city.country_id = country.country_id 
  WHERE plan_overview.plan_id = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("found plan: ", res);
        result(null, res);
        return;
      }
      result({ kind: "not_found" }, null);
    }
  );
};

Load_plan.loadStartDay = (id, result) => {
  sql.query(
    `SELECT * FROM plan_startday WHERE plan_id = ${id} ORDER BY day`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("found plan_startday: ", res);
      result(null, res);
    }
  );
};

Load_plan.loadDetailId = (id, result) => {
  sql.query(
    `SELECT * FROM plan_detail
  INNER JOIN attraction ON plan_detail.attraction_id = attraction.attraction_id 
  WHERE plan_detail.plan_id = ${id} ORDER BY attraction_order`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("found plan: ", res);
      result(null, res);
    }
  );
};

module.exports = Load_plan;
