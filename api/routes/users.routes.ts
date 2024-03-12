import { Router } from "express";
const router = Router();
import { UsersControllers } from "../controllers/users.controllers";
import { validateAuth } from "../middlewares/auth";
import { validateAuthAdmin } from "../middlewares/validateAuthAdmin";
import { validateAuthDeliveryMan } from "../middlewares/validateAuthDeliveryMan";

router.get("/", validateAuthAdmin, UsersControllers.getAllUsers);

router.get(
  "/number-of-deliverymen-and-enabled-deliverymen",
  validateAuthAdmin,
  UsersControllers.GetNumberOfDeliverymenAndEnadledDeliverymen
);

router.post("/register", UsersControllers.registerUser);

router.put("/confirm-email/:token", UsersControllers.confirmEmail);

router.post("/login", UsersControllers.loginUser);

router.get("/deliverymen", validateAuthAdmin, UsersControllers.getDeliverymen);

router.get("/single/:id", validateAuthAdmin, UsersControllers.getUser);

//Ruta usada sólo para testeo
router.get("/single-by-email/:email", UsersControllers.getUserByEmail);

router.delete(
  "/delete/deliveryman",
  validateAuthAdmin,
  UsersControllers.deleteDeliveryman
);

router.delete("/delete/admin", validateAuthAdmin, UsersControllers.deleteAdmin);

router.post("/logout", UsersControllers.logout);

router.put("/restore-password", UsersControllers.sendEmail);

router.get(
  "/validate-token/:token",
  UsersControllers.validateTokenToRestorePassword
);

router.put("/overwrite-password/:token", UsersControllers.overwritePassword);

router.get("/me", validateAuth, UsersControllers.me);

router.put(
  "/delivery-status",
  validateAuthDeliveryMan,
  UsersControllers.deliveryStatus
);

export default router;
