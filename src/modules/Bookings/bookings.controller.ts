import { Request, Response } from "express";
import { bookingsServices } from "./bookings.service";
import { JwtPayload } from "jsonwebtoken";

const addBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingsServices.addBookings(req.body as any);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...result.booking,
        vehicle: result.vehicle,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user as JwtPayload;

    // Admin: undefined → get all bookings
    // Customer: pass userId → get only own bookings
    const result = await bookingsServices.getBookings(
      loggedInUser.role === "admin" ? undefined : String(loggedInUser.id)
    );

    res.status(200).json({
      success: true,
      message:
        loggedInUser.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export const bookingsController = {
  addBookings,
  getBookings,
};
