import { Router } from "express";
const router = Router();
import { UsersControllers } from "../controllers/users.controllers";
import { validateAuthAdmin } from "../middlewares/validateAuthAdmin";
import { validateAuth } from "../middlewares/auth";

router.get("/", validateAuthAdmin, UsersControllers.getAllUsers);

router.post("/register", UsersControllers.registerUser);

router.put("/confirm-email/:token", UsersControllers.confirmEmail);

router.post("/login", UsersControllers.loginUser);

router.get("/deliverymen", UsersControllers.getDeliverymen);

router.get("/single/:id", validateAuthAdmin, UsersControllers.getUser);

router.get(
  "/single-by-email/:email",
  validateAuthAdmin,
  UsersControllers.getUserByEmail
);

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

router.post("/overwrite-password/:token", UsersControllers.overwritePassword);

router.get("/me", validateAuth, UsersControllers.me);

export default router;
