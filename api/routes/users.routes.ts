import { Router } from "express";
const router = Router();
import { UsersController } from "../controllers/users.controller";

router.get("/all", UsersController.getAllUsers);

router.post("/register", UsersController.registerUser);

router.post("/login", UsersController.loginUser);

router.get("/deliverymen", UsersController.getDeliverymen);

router.get("/deliverymen/:id", UsersController.getOneDeliverymen);

// faltan validaciones
router.delete("/delete/deliverymen", UsersController.deleteDeliverymen);
// faltan validaciones
router.delete("/delete/admin", UsersController.deleteAdmin);

router.post("/logout", UsersController.logout);

router.put("/restore-password", UsersController.sendEmail);

export default router;
