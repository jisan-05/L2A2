import { usersRoutes } from "./modules/users/users.routes";
import { authRouter } from "./modules/Auth/auth.routes";
import { vehiclesRouter } from "./modules/Vehicles/vehicles.routes";
import { bookingsRouter } from "./modules/Bookings/bookings.routes";

import express, { Request, Response } from "express";
import { Pool } from "pg";
import config from "./config/index";
import initDB from "./config/db";

// initial db
initDB();

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(express.json());

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/vehicles", vehiclesRouter);

app.use("/api/v1/users", usersRoutes);

app.use("/api/v1/bookings", bookingsRouter);

export default app;
