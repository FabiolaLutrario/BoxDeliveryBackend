import express from "express";
const router = express.Router();
import User from "../models/User.models";
import { generateToken } from "../config/token.config";

router.get("/all", (_req, res) => {
  User.findAll()
    .then((users: object) => res.status(200).send(users))
    .catch((err: Error) => res.send(err));
});

router.post("/register", (req, res) => {
  const { email, name, last_name, password } = req.body;

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

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(406).send("Please complete all the fields");
  return User.findOne({ where: { email } })
    .then((user) => {
      if (!user) return res.status(401).send("Incorrect email or password");
      return user
        .validatePassword(password)
        .then((isOk) => {
          if (!isOk) return res.status(401).send("Validation error, try again");
          if (!user.isConfirmed)
            return res
              .status(401)
              .send("Please confirm your account before trying to log in");
          const payload = {
            email,
            name: user.name,
            last_name: user.last_name,
            isAdmin: user.isAdmin,
            isConfirmed: user.isConfirmed,
          };
          const token = generateToken(payload);
          res.cookie("auth-token", token).send("You are now logged in!");

          return;
          // res.status(200).send("All good");
        })
        .catch((err) => res.status(401).send(err));
    })
    .catch((err) => res.status(401).send(err));

  // if (secretKey === undefined) {
  //   return res.send("Internal server error, refresh and try again");
  // } else {
  //   const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
  //   return res.cookie("token", token).send({ token });
  // }
});

router.get("/deliverymen", (_req, res) => {
  User.findAll({ where: { isAdmin: false } })
    .then((deliverymen) => res.status(200).send(deliverymen))
    .catch((err) => res.status(400).send(err));
});

router.get("/deliverymen/:id", (req, res) => {
  User.findOne({ where: { id: req.params.id } })
    .then((deliverymen) => {
      if (!deliverymen || deliverymen.isAdmin) return res.sendStatus(204);
      return res.status(200).send(deliverymen);
    })
    .catch((err) => res.status(400).send(err));
});

// faltan validaciones
router.put("/delete/deliverymen", (req, res) => {
  const { email } = req.body;
  User.findOne({ where: { email } }).then((user) => {
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

router.post("/logout", (_req, res) => {
  res.clearCookie("auth-token");
  res.sendStatus(200);
});
export default router;
