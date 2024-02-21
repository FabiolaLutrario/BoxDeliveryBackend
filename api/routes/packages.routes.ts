import express from "express";
import packageController from "../controllers/packages.controllers";

const router = express.Router();

router.post("/add-package", packageController.addPackage);
router.get("/", packageController.getAllPackages);

router.get("/single/:id", packageController.getSinglePackage);
router.get("/:user_id/:status", packageController.getPackagesByUserAndStatus);

export default router;
