import express from "express";
import { PackagesControllers } from "../controllers/packages.controllers";
import { validateAuth } from "../middlewares/auth";
import { validateAuthAdmin } from "../middlewares/validateAuthAdmin";

const router = express.Router();

router.post("/add-package", validateAuth, PackagesControllers.addPackage);

router.get("/", validateAuthAdmin, PackagesControllers.getAllPackages);

router.get("/single/:id", validateAuth, PackagesControllers.getSinglePackage);

router.get(
  "/:user_id/:status",
  validateAuth,
  PackagesControllers.getPackagesByUserAndStatus
);

router.put(
  "/assign-package/:packageId/:userId",
  PackagesControllers.assignPackage
);

router.put("/start/:packageId", PackagesControllers.startTrip);

router.put("/finish-trip/:packageId", PackagesControllers.finishTrip);

router.put("/remove-assign/:packageId", PackagesControllers.removeAssignedUser);

//Poner ruta delete como privada solo para uso de tests
router.delete("/package/:id", PackagesControllers.deletePackage);

export default router;
