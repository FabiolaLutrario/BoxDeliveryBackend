import express from "express";
import { PackagesControllers } from "../controllers/packages.controllers";

const router = express.Router();

//Listo en swagger
router.post("/add-package", PackagesControllers.addPackage);

//Listo en swagger
router.get("/", PackagesControllers.getAllPackages);

//Listo en swagger
router.get("/single/:id", PackagesControllers.getSinglePackage);

//Listo en swagger
router.get("/:user_id/:status", PackagesControllers.getPackagesByUserAndStatus);

//Poner ruta delete como privada solo para uso de tests
router.delete("/package/:id", PackagesControllers.deletePackage);

export default router;
