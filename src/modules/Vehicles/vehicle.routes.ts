import { Router } from "express";
import { vehicleController } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth("admin"), vehicleController.addVehicle); // admin only
router.get("/", vehicleController.getVehicles); // public
router.get("/:vehicleId", vehicleController.getSingleVehicle); // public
router.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle); // admin only
router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle); // admin only

export const vehicleRoutes = router;
