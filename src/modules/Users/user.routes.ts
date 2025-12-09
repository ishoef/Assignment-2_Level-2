import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import adminOrOwner from "../../middleware/ownerOrAdmin";

const router = Router();

router.get("/", auth("admin"), userController.getUsers); // admin only
router.get("/:userId", userController.getSingleUser);
router.put("/:userId", auth(), adminOrOwner, userController.updateUser); // admin or owner
router.delete("/:userId", auth("admin"), userController.deleteUser);

export const userRoutes = router;
