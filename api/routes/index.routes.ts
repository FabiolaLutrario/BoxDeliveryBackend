import express from "express";
const router = express.Router();
import verifyToken from "../controllers/users.controllers";
import dotenv from "dotenv";
dotenv.config();

import admin from "./admin.routes";
import deliveryman from "./deliveryman.routes";
import users from "./users.routes";
import packages from "./packages.routes";

router.use("/users", users);
router.use("/admin", admin);
router.use("/deliveryman", deliveryman);
router.use("/packages", packages);

router.get("/private", verifyToken, (_req, res) =>
  res.send({ message: "Hello World! This is a private route." })
);

export default router;
