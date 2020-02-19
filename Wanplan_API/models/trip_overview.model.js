const sql = require("./db.js");

const Trip_overview = function(trip_overview) {
  this.trip_name = trip_overview.trip_name;
  this.user_id = trip_overview.user_id;
  this.city_id = trip_overview.city_id;
  this.duration = trip_overview.duration;
  this.trip_style = trip_overview.trip_style;
  this.star_rating = trip_overview.star_rating;
};

Trip_overview.create = (newTrip, result) => {
  sql.query("INSERT INTO trip_overview SET ?", newTrip, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created trip_overview: ", { id: res.insertId, ...newTrip });
    result(null, { id: res.insertId, ...newTrip });
  });
};

Trip_overview.findById = (id, result) => {
  sql.query(`SELECT * FROM trip_overview WHERE trip_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found trip_overview: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Trip_overview.findByUser = (id, result) => {
  sql.query(`SELECT * FROM trip_overview WHERE user_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found trip_overview: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Trip_overview.findByCity = (id, result) => {
  sql.query(`SELECT * FROM trip_overview WHERE city_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found trip_overview: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Trip_overview.findByStyle = (style, result) => {
  sql.query(`SELECT * FROM trip_overview WHERE trip_style = "${style}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found trip_overview: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Trip_overview.getAll = result => {
  sql.query("SELECT * FROM trip_overview", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("trip_overview: ", res);
    result(null, res);
  });
};

Trip_overview.updateById = (id, trip_overview, result) => {
  sql.query(
    "UPDATE trip_overview SET trip_name = ?, user_id = ?, city_id = ?, duration = ?, trip_style = ?, star_rating = ? WHERE trip_id = ?",
    [trip_overview.trip_name, trip_overview.user_id, trip_overview.city_id, trip_overview.duration, trip_overview.trip_style, trip_overview.star_rating, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found trip_overview with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated trip_overview: ", { id: id, ...trip_overview });
      result(null, { id: id, ...trip_overview });
    }
  );
};

Trip_overview.remove = (id, result) => {
  sql.query("DELETE FROM trip_overview WHERE trip_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted trip_overview with id: ", id);
    result(null, res);
  });
};

module.exports = Trip_overview;