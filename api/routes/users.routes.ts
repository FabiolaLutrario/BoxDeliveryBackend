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

router.post("/register", (req, res) => {
  const {
    email,
    name,
    last_name,
    password,
    // profile_photo,
    // isAdmin,
    // isConfirmed,
  } = req.body;

  if (!email || !name || !last_name || !password)
    return res.status(406).send("Please complete all fields");

  return User.findOne({ where: { email } })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .send("There is already an account associated with this email");
      }
      return User.create(req.body)
        .then(() => res.status(201).send("Created"))
        .catch(() => {
          //console.error("Error when trying to register user:", error);
          return res.status(500).send("Internal Server Error");
        });
    })
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

router.get("/deliverymen", (_req, res) => {
  User.findAll({ where: { isAdmin: false } })
    .then((deliverymen) => res.status(200).send(deliverymen))
    .catch((err) => res.status(400).send(err));
});

// faltan validaciones
router.put("/delete/deliverymen", (req, res) => {
  const { email } = req.body;
  User.findOne({ where: { email, isAdmin: false } }).then((user) => {
    if (user) {
      return user
        .destroy()
        .then(() => res.status(200).send("Deliverymen deleted successfully"))
        .catch(() =>
          res.status(500).send("Failure when trying to delete delivery man")
        );
    }
    return res
      .status(400)
      .send("We could not find the deliverymen asociated with that email");
  });
});

// faltan validaciones
router.put("/delete/admin", (req, res) => {
  const { email } = req.body;
  User.findOne({ where: { email, isAdmin: true } }).then((user) => {
    if (user) {
      return user
        .destroy()
        .then(() => res.status(200).send("Account deleted successfully"))
        .catch(() =>
          res.status(500).send("Failure when trying to delete account")
        );
    }
    return res
      .status(400)
      .send("We could not find an account asociated with that email");
  });
});

export default router;
