const sql = require("./db.js");

const City = function(city) {
  this.city_id = city.city_id;
  this.city_name = city.city_name;
  this.prefecture = city.prefecture;
  this.region = city.region;
  this.country_id = city.country_id;
};

City.create = (newCity, result) => {
  sql.query("INSERT INTO city SET ?", newCity, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created city: ", { id: res.insertId, ...newCity });
    result(null, { id: res.insertId, ...newCity });
  });
};

City.getAll = result => {
  sql.query("SELECT * FROM city", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("cities: ", res);
    result(null, res);
  });
};

City.findById = (id, result) => {
  sql.query(`SELECT * FROM city WHERE city_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found city: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

City.findByPrefecture = (prefecture, result) => {
  sql.query(`SELECT * FROM city WHERE prefecture = "${prefecture}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found city: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

City.findByRegion = (region, result) => {
  sql.query(`SELECT * FROM city WHERE region = "${region}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found city: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

City.findByCountry = (id, result) => {
  sql.query(`SELECT * FROM city WHERE country_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found city: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

City.remove = (id, result) => {
  sql.query("DELETE FROM city WHERE city_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted city with id: ", id);
    result(null, res);
  });
};

module.exports = City;