const sql = require("./db.js");

const Transport = function(transport) {
  this.source_id = transport.source_id;
  this.destination_id = transport.destination_id;
  this.walk = transport.walk;
  this.bicycle = transport.bicycle;
  this.train = transport.train;
  this.car = transport.car;
};

Transport.create = (newTransport, result) => {
  sql.query("INSERT INTO transport SET ?", newTransport, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created transport: ", {...newTransport });
    result(null, {...newTransport });
  });
};

Transport.findAllFromOne = (source_id, result) => {
  sql.query(`SELECT * FROM transport WHERE source_id = ${source_id} ORDER BY destination_id`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found transport: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Transport.findAllToOne = (destination_id, result) => {
  sql.query(`SELECT * FROM transport WHERE destination_id = ${destination_id} ORDER BY source_id`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found transport: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Transport.findByPair = (source, sink, result) => {
  sql.query(
    `SELECT * FROM transport WHERE source_id = ${source} AND destination_id = ${sink}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found transport: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Transport.removeFromOne = (source_id, result) => {
  sql.query("DELETE FROM transport WHERE source_id = ?", source_id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted transport with source_id: ", source_id);
    result(null, res);
  });
};

Transport.removeToOne = (destination_id, result) => {
  sql.query("DELETE FROM transport WHERE destination_id = ?", destination_id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted transport with destination_id: ", destination_id);
    result(null, res);
  });
};

Transport.removePair = (source, sink, result) => {
  sql.query("DELETE FROM transport WHERE source_id = ? AND destination_id = ?", [source,sink], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted transport with source_id: ", source);
    result(null, res);
  });
};

Transport.updateByPair = (source, sink, transport, result) => {
  sql.query(
    "UPDATE transport SET source_id = ?, destination_id = ?, walk = ?, bicycle = ?, train = ?, car = ? WHERE source_id = ? AND destination_id = ?",
    [transport.source_id, transport.destination_id, transport.walk, transport.bicycle, transport.train, transport.car, source, sink],
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

      console.log("updated transport: ", {...transport });
      result(null, {...transport });
    }
  );
};

module.exports = Transport;
