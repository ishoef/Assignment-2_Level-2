import { Router } from "express";
import { vehicleController } from "./vehicle.controller";

const router = Router();

router.post("/", vehicleController.addVehicle);
router.get("/", vehicleController.getVehicles);
router.get("/:id", vehicleController.getSingleVehicle);
router.put("/:id", vehicleController.updateVehicle);
router.delete("/:id", vehicleController.deleteVehicle);

export const vehicleRoutes = router;
