import { Request, Response } from "express";
import { pool } from "../../config/db";
import { usersServices } from "../users/users.services";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await usersServices.createUser(req.body);
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const usersController = {
  createUser,
};
