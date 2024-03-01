import { Router } from "express";
const router = Router();
import { UsersControllers } from "../controllers/users.controllers";
import { validateAuthAdmin } from "../middlewares/validateAuthAdmin";
import { validateAuth } from "../middlewares/auth";

router.get("/", UsersControllers.getAllUsers);

router.post("/register", UsersControllers.registerUser);

router.put("/confirm-email/:token", UsersControllers.confirmEmail);

router.post("/login", UsersControllers.loginUser);

router.get("/deliverymen", UsersControllers.getDeliverymen);

router.get("/single/:id", UsersControllers.getUser);

router.get("/single-by-email/:email", UsersControllers.getUserByEmail);

// faltan validaciones
router.delete(
  "/delete/deliveryman",
  validateAuthAdmin,

  UsersControllers.deleteDeliveryman
);
// faltan validaciones
router.delete("/delete/admin", validateAuthAdmin, UsersControllers.deleteAdmin);

router.post("/logout", UsersControllers.logout);

router.put("/restore-password", UsersControllers.sendEmail);

router.get(
  "/validate-token/:token",
  UsersControllers.validateTokenToRestorePassword
);

router.post("/overwrite-password/:token", UsersControllers.overwritePassword);

router.get("/me", validateAuth, UsersControllers.me);

export default router;
