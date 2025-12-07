import express, { Request, Response } from "express";
import { Pool } from "pg";
import config from "./config/index";
import initDB from "./config/db";
import { usersRoutes } from "./modules/users/users.routes";
import { authRouter } from "./modules/Auth/auth.routes";
import { vehiclesRouter } from "./modules/Vehicles/vehicles.routes";

const app = express();
const port = 5000;
console.log(config.port);

app.use(express.json());

app.use("/api/v1/auth/signup",usersRoutes)

app.use("/api/v1/auth/signin",authRouter)

app.use("/api/v1/vehicles",vehiclesRouter)

// initial db
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
