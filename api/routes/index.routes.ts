import express from "express";
const router = express.Router();
import { verifyToken } from "../controllers/user.controllers";
import dotenv from "dotenv";
dotenv.config();

import users from "./users.routes";
import packages from "./packages.routes";

router.use("/users", users);
router.use("/packages", packages);

router.get("/private", verifyToken, (_req, res) =>
  res.send({ message: "Hello World! This is a private route." })
);

export default router;
