const sql = require("./db.js");

const Country = function(country) {
  this.country_name = country.country_name;
  this.continent = country.continent;
};

Country.create = (newCountry, result) => {
  sql.query("INSERT INTO country SET ?", newCountry, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created country: ", { id: res.insertId, ...newCountry });
    result(null, { id: res.insertId, ...newCountry });
  });
};

Country.getAll = result => {
  sql.query("SELECT * FROM country", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("country: ", res);
    result(null, res);
  });
};

Country.remove = (id, result) => {
  sql.query("DELETE FROM country WHERE country_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted country with id: ", id);
    result(null, res);
  });
};

module.exports = Country;