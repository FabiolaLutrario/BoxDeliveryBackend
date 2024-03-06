import express from "express";
import { PackagesControllers } from "../controllers/packages.controllers";

const router = express.Router();

router.post("/add-package", PackagesControllers.addPackage);

router.get("/", PackagesControllers.getAllPackages);

router.get("/single/:id", PackagesControllers.getSinglePackage);

router.get("/:user_id/:status", PackagesControllers.getPackagesByUserAndStatus);

//Poner ruta delete como privada solo para uso de tests
router.delete("/package/:id", PackagesControllers.deletePackage);

export default router;
