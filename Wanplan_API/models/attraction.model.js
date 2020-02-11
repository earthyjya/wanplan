const sql = require("./db.js");

const Attraction = function(attraction) {
  this.attraction_name = attraction.attraction_name;
  this.attraction_type = attraction.attraction_type;
  this.open_time = attraction.open_time;
  this.close_time = attraction.close_time;
  this.description = attraction.description;
  this.city_id = attraction.city_id;
};

Attraction.create = (newAttraction, result) => {
  sql.query("INSERT INTO attraction SET ?", newAttraction, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created attraction: ", { id: res.insertId, ...newAttraction });
    result(null, { id: res.insertId, ...newAttraction });
  });
};

Attraction.findById = (id, result) => {
  sql.query(`SELECT * FROM attraction WHERE attraction_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found attraction: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Attraction.findByStyle = (style, result) => {
  sql.query(`SELECT * FROM attraction WHERE attraction_type = "${style}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found attraction: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Attraction.findByCity = (id, result) => {
  sql.query(`SELECT * FROM attraction WHERE city_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found attraction: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Attraction.getAll = result => {
  sql.query("SELECT * FROM attraction", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("attraction: ", res);
    result(null, res);
  });
};

Attraction.updateById = (id, attraction, result) => {
  sql.query(
    "UPDATE attraction SET attraction_name = ?, attraction_type = ?, open_time = ?, close_time = ?, description = ?, city_id = ? WHERE attraction_id = ?",
    [attraction.attraction_name, attraction.attraction_type, attraction.open_time, attraction.close_time, attraction.description, attraction.city_id, id],
	(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found attraction with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated attraction: ", { id: id, ...attraction });
      result(null, { id: id, ...attraction });
    }
  );
};

Attraction.remove = (id, result) => {
  sql.query("DELETE FROM attraction WHERE attraction_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted attraction with id: ", id);
    result(null, res);
  });
};

module.exports = Attraction;