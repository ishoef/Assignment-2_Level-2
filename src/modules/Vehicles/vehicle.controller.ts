import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const addVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.addVehicle(req.body);
    res.status(201).json({
      success: true,
      message: "Added vehicle successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

export const vehicleController = {
  addVehicle,
};
