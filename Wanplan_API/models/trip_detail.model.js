const sql = require("./db.js");

const Trip_detail = function(trip_detail) {
  this.trip_id = trip_detail.trip_id;
  this.user_id = trip_detail.user_id;
  this.day = trip_detail.day;
  this.attraction_order = trip_detail.attraction_order;
  this.start_time = trip_detail.start_time;
  this.end_time = trip_detail.end_time;
  this.time_spend = trip_detail.time_spend;
  this.attraction_id = trip_detail.attraction_id;
};

Trip_detail.create = (newTrip, result) => {
  sql.query("INSERT INTO trip_detail SET ?", newTrip, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created trip_detail: ", { id: res.insertId, ...newTrip });
    result(null, { id: res.insertId, ...newTrip });
  });
};

Trip_detail.findByTripId = (id, result) => {
  sql.query(`SELECT * FROM trip_detail WHERE trip_id = ${id} ORDER BY day, attraction_order`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found trip_detail: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Trip_detail.removeTripIdAll = (id, result) => {
  sql.query("DELETE FROM trip_detail WHERE trip_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted trip_detail with id: ", id);
    result(null, res);
  });
};

Trip_detail.removeTripIdOne = (id, day, order, result) => {
  sql.query("DELETE FROM trip_detail WHERE trip_id = ? AND day = ? AND attraction_order = ?", [id, day, order], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted trip_detail with id: ", id);
    result(null, res);
  });
};

Trip_detail.removeUser = (id, result) => {
  sql.query("DELETE FROM trip_detail WHERE user_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted trip_detail of user with id: ", id);
    result(null, res);
  });
};

Trip_detail.updateByIdOne = (id, day, order, trip_detail, result) => {
  sql.query(
    "UPDATE trip_detail SET trip_id = ?, user_id = ?, day = ?, attraction_order = ?, start_time = ?, end_time = ?, time_spend = ?, attraction_id = ? WHERE trip_id = ? AND day = ? AND attraction_order = ?",
    [trip_detail.trip_id, trip_detail.user_id, trip_detail.day, trip_detail.attraction_order, trip_detail.start_time, trip_detail.end_time, trip_detail.time_spend, trip_detail.attraction_id, id, day, order],
	(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found trip_detail with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated trip_detail: ", { id: id, ...trip_detail });
      result(null, { id: id, ...trip_detail });
    }
  );
};

module.exports = Trip_detail;
