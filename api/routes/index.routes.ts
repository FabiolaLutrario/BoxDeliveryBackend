import express, { Request, Response } from "express";
const router = express.Router();
import { verifyToken } from "../config/tokens";
import dotenv from "dotenv";
dotenv.config();

import users from "./users.routes";
import packages from "./packages.routes";

router.use("/users", users);
router.use("/packages", packages);

router.get("/private", verifyToken, (_req: Request, res: Response) =>
  res.send({ message: "Hello World! This is a private route." })
);

export default router;
