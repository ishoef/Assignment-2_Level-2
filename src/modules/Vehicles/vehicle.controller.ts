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

// Get single vehicle
const getSingleVehicle = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const result = await vehicleService.getSingleVehicle(id!);
    if (result.rows.length !== 0) {
      res.status(200).json({
        success: true,
        message: `user found by id ${id}`,
        data: result.rows[0],
      });
    } else {
      res.status(404).json({
        success: false,
        message: `User not found by id ${id}`,
      });
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: `getSingleVehicle: ${err.message}`,
      error: err,
    });
  }
};

// Update vehicle data
const updateVehicle = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await vehicleService.updateVehicle(req.body, id!);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: `not updated the vehicle by id ${id}`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `Vehicle updated successfully by id ${id}`,
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: `updateVehicle: ${err.message}`,
      error: err,
    });
  }
};

// Delte vehicle
const deleteVehicle = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await vehicleService.deleteVehicle(id!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: `Vehicle not found with id ${id} for deleting`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `Vehicle with id "${id}" deleted successfuly`,
      });
    }
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: `deleteVehicle: ${err.message}`,
      error: err,
    });
  }
};

export const vehicleController = {
  addVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
