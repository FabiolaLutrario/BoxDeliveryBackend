import { Router } from "express";
const router = Router();
import { UsersControllers } from "../controllers/users.controllers";

import { validateAuth } from "../middlewares/auth";
import { validateAuthAdmin } from "../middlewares/validateAuthAdmin";

router.get("/", validateAuthAdmin, UsersControllers.getAllUsers);

//Listo en swagger
router.post("/register", UsersControllers.registerUser);

//Listo en swagger
router.put("/confirm-email/:token", UsersControllers.confirmEmail);

//Listo en swagger
router.post("/login", UsersControllers.loginUser);


router.get("/deliverymen", validateAuth, UsersControllers.getDeliverymen);
//Listo en swagger


//Listo en swagger
router.get("/single/:id", UsersControllers.getUser);

router.get(
  "/single-by-email/:email",

  UsersControllers.getUserByEmail
);

router.delete(
  "/delete/deliveryman",
  validateAuthAdmin,
  UsersControllers.deleteDeliveryman
);

router.delete("/delete/admin", validateAuthAdmin, UsersControllers.deleteAdmin);

//Listo en swagger
router.post("/logout", UsersControllers.logout);

//Listo en swagger
router.put("/restore-password", UsersControllers.sendEmail);

//Listo en swagger
router.get(
  "/validate-token/:token",
  UsersControllers.validateTokenToRestorePassword
);

//Listo en swagger
router.post("/overwrite-password/:token", UsersControllers.overwritePassword);

//Listo en swagger
router.get("/me", validateAuth, UsersControllers.me);

export default router;
