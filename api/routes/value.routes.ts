import express from "express";
const router = express.Router();
import Value from "../models/Value.models";

router.post("/new", (req, res) => {
  Value.create(req.body)
    .then(() => res.status(200).send("Created"))
    .catch((err: Error) => res.send(err));
});

export default router;
