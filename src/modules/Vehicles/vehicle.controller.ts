import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

// Create Vehicle Data
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

// Get Vehicles
const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicle Data Arrived",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};

export const vehicleController = {
  addVehicle,
  getVehicles,
};
