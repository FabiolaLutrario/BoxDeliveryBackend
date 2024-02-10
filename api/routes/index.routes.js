const express = require("express");
const router = express.Router();
require("dotenv").config();
const { verifyToken } = require("../controllers/users.controllers");
const admin = require("./admin.routes");
const deliveryman = require("./deliveryman.routes");
const users = require("./users.routes");

router.use("/users", users);
router.use("/admin", admin);
router.use("/deliveryman", deliveryman);

router.get("/private", verifyToken, (req, res) =>
  res.send({ message: "Hello World! This is a private route." })
);

module.exports = router;
