const express = require("express");
const router = express.Router();
const secretKey = process.env.JWT_SECRET_KEY;
const jwt = require("jsonwebtoken");
const User = require("../models/User.models");

router.get("/all", (req, res) => {
  User.findAll()
    .then((users) => res.status(200).send(users))
    .catch((err) => console.error(err));
});

router.post("/login", (req, res) => {
  const user = {
    id: 1,
    name: "userExample",
  };

  const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
  res.cookie("token", token).send({ token });
});

router.post("/register", (req, res) => {
  User.create(req.body).then(() => res.send("creado"));
});

module.exports = router;
