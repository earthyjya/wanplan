const Image = require("../models/image.model.js");
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  const imagex = new Image({
	image_id: req.body.image_id,
	image_name: req.body.image_name,
	image_url: req.body.image_url
  });

  Image.create(imagex, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the image."
      });
    else res.send(data);
  });
};

exports.findImageId = (req, res) => {
  Image.findByImageId(req.params.imageId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found image with image_id ${req.params.imageId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving image with image_id " + req.params.imageId
        });
      }
    } else res.send(data);
  });
};

exports.deleteId = (req, res) => {
  Image.removeImageId(req.params.imageId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found image with image_id ${req.params.imageId}`
        });
      } else {
        res.status(500).send({
          message: `Not found image with image_id ${req.params.imageId}`
        });
      }
    } else res.send({ message: `Image with image_id ${req.params.imageId} was deleted successfully!`});
  });
};

exports.updateId = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty."
    });
  }

  Image.updateById(
    req.params.imageId,
    new Image(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found image with image_id  ${req.params.imageId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating image with image_id  " + req.params.imageId
          });
        }
      } else res.send(data);
    }
  );
};