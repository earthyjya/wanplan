const sql = require("./db.js");

const Image = function(imagex) {
  this.image_id = imagex.image_id;
  this.image_name = imagex.image_name;
  this.image_url = imagex.image_url;
};

Image.create = (newImage, result) => {
  sql.query("INSERT INTO image SET ?", newImage, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created image: ", { id: res.insertId, ...newImage });
    result(null, { id: res.insertId, ...newImage });
  });
};

Image.findByImageId = (id, result) => {
  sql.query(`SELECT * FROM image WHERE image_id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found image: ", res);
      result(null, res);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Image.removeImageId = (id, result) => {
  sql.query("DELETE FROM image WHERE image_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted image with id: ", id);
    result(null, res);
  });
};

Image.updateById = (id, imagex,result) => {
  sql.query(
    "UPDATE image SET image_id = ?, image_name = ?, image_url = ? WHERE image_id = ?",
    [imagex.image_id, imagex.image_name, imagex.image_url, id],
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

      console.log("updated image: ", { id: id, ...imagex });
      result(null, { id: id, ...imagex });
    }
  );
};

module.exports = Image;
