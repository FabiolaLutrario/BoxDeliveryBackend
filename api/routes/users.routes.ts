import { Router } from "express";
const router = Router();
import { UsersControllers } from "../controllers/users.controller";

router.get("/all", UsersControllers.getAllUsers);

router.post("/register", UsersControllers.registerUser);

router.post("/login", UsersControllers.loginUser);

router.get("/deliverymen", UsersControllers.getDeliverymen);

router.get("/deliveryman/:id", UsersControllers.getOneDeliveryman);

// faltan validaciones
router.delete("/delete/deliveryman", UsersControllers.deleteDeliveryman);
// faltan validaciones
router.delete("/delete/admin", UsersControllers.deleteAdmin);

router.post("/logout", UsersControllers.logout);

router.put("/restore-password", UsersControllers.sendEmail);

export default router;
