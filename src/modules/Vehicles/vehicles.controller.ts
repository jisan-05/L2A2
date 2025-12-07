import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";

const createVehicles = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    const result = await vehiclesService.createVehicles(payload);
    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getVehicles();
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found",
        data: [],
      });
    }
    return res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getSingleVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehiclesService.getSingleVehicles(
      req.params.vehicleId as string
    );
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateVehicles = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    const result = await vehiclesService.updateVehicles(
      payload,
      req.params.vehicleId as string
    );
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};
const deleteVehicles = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    const result = await vehiclesService.deleteVehicles(
      req.params.vehicleId as string
    );
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

export const vehiclesController = {
  createVehicles,
  getVehicles,
  getSingleVehicles,
  updateVehicles,
  deleteVehicles
};
