import express from "express";
import { PackagesControllers } from "../controllers/packages.controllers";
import { validateAuth } from "../middlewares/auth";
import { validateAuthAdmin } from "../middlewares/validateAuthAdmin";
import { validateAuthDeliveryMan } from "../middlewares/validateAuthDeliveryMan";

const router = express.Router();

router.post("/add-package", validateAuthAdmin, PackagesControllers.addPackage);

router.get(
  "/",
  validateAuthDeliveryMan,
  PackagesControllers.getUnassignedPackages
);

router.get(
  "/number-of-pacakges-and-packages-delivered-by-date/:date",
  validateAuthAdmin,
  PackagesControllers.getNumberOfPacakgesAndPackagesDeliveredByDate
);

router.get("/single/:id", validateAuth, PackagesControllers.getSinglePackage);

router.get(
  "/:user_id/:status",
  validateAuth,
  PackagesControllers.getPackagesByUserAndStatus
);

router.get(
  "/by-status-and-date/:status/:date",
  validateAuthAdmin,
  PackagesControllers.getPackagesByStatusAndDate
);

router.put(
  "/assign-package/:packageId/:userId",
  validateAuth,
  PackagesControllers.assignPackage
);

router.put("/start/:packageId", validateAuth, PackagesControllers.startTrip);

router.put(
  "/finish-trip/:packageId",
  validateAuth,
  PackagesControllers.finishTrip
);

router.put("/cancel-trip/:packageId", PackagesControllers.cancelTrip);

router.put(
  "/remove-assign/:packageId",
  validateAuth,
  PackagesControllers.removeAssignedUser
);

router.put(
  "/remove-all-assign",
  validateAuth,
  PackagesControllers.removeAllAssigned
);

//Poner ruta delete como privada solo para uso de tests
router.delete(
  "/package/:id",
  validateAuthAdmin,
  PackagesControllers.deletePackage
);

router.delete("/packages", PackagesControllers.deletePackages);

export default router;
