const express = require("express");
const router = express.Router();
const Package = require("../models/Package.models");

router.get("/all", (req, res) => {
  Package.findAll()
    .then((packages) => res.status(200).send(packages))
    .catch((err) => console.error(err));
});

router.post("/new", (req, res) => {
  Package.create(req.body)
    .then(() => res.status(200).send("Created"))
    .catch((err) => console.error(err));
});

module.exports = router;
