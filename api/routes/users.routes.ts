import express from "express";
const router = express.Router();
const secretKey = process.env.JWT_SECRET_KEY;
import jwt from "jsonwebtoken";
import User from "../models/User.models";

router.get("/all", (_req, res) => {
  User.findAll()
    .then((users: object) => res.status(200).send(users))
    .catch((err: Error) => res.send(err));
});

router.post("/login", (_req, res) => {
  if (secretKey === undefined) {
    return res.send("Internal server error, refresh and try again");
  } else {
    const user = {
      id: 1,
      name: "userExample",
    };

    const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
    return res.cookie("token", token).send({ token });
  }
});

router.post("/register", (req, res) => {
  User.create(req.body)
    .then(() => res.send("creado"))
    .catch(() => {
      //console.error("Error when trying to register user:", error);
      return res.status(500).send("Internal Server Error");
    });
});

export default router;
