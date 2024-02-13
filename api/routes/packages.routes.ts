import express from "express";
const router = express.Router();
import Package from "../models/Package.models";

router.get("/all", (_req, res) => {
  Package.findAll()
    .then((packages: object) => res.status(200).send(packages))
    .catch((err: Error) => res.send(err));
});

router.post("/new", (req, res) => {
  Package.create(req.body)
    .then(() => res.status(200).send("Created"))
    .catch((err: Error) => res.send(err));
});

export default router;
