import express from "express";
const router = express.Router();
import * as userController from "../controllers/users.controllers";

router.get("/all", userController.getAllUsers);

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/deliverymen", userController.getDeliverymen);

router.get("/deliverymen/:id", userController.getOneDeliverymen);

// faltan validaciones
router.delete("/delete/deliverymen", userController.deleteDeliverymen);
// faltan validaciones
router.delete("/delete/admin", userController.deleteAdmin);

router.post("/logout", userController.logout);

export default router;
