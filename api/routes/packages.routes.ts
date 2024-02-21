import express from "express";
import { PackagesControllers } from "../controllers/packages.controllers";

const router = express.Router();

router.post("/add-package", PackagesControllers.addPackage);
router.get("/", PackagesControllers.getAllPackages);

router.get("/single/:id", PackagesControllers.getSinglePackage);
router.get("/:user_id/:status", PackagesControllers.getPackagesByUserAndStatus);

export default router;
