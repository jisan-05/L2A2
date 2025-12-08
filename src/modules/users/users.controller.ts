import { Request, Response } from "express";
import { pool } from "../../config/db";
import { usersServices } from "./users.services";
import { JwtPayload } from "jsonwebtoken";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const payload = req.body;
  const loggedInUser = req.user as JwtPayload;
  const { userId } = req.params;
  console.log("1st ->",loggedInUser.id, typeof loggedInUser.id);
  console.log("2nd ->",req.params.userId, typeof req.params.userId);

  try {
    if (loggedInUser.role !== "admin" && Number(loggedInUser.id) !== Number(userId)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only update your own profile",
      });
    }

    const result = await usersServices.updateUser(
      payload,
      req.params.userId as string
    );
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteUsers = async (req: Request, res: Response) => {
  const payload = req.body;
  try {
    const result = await usersServices.deleteVehicles(
      req.params.userId as string
    );
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

export const usersController = {
  getAllUsers,
  updateUser,
  deleteUsers,
};
