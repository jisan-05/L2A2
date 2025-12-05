import express, { Request, Response } from "express";
import { Pool } from "pg";
import config from "./config/index";
import initDB from "./config/db";
import { authRoutes } from "./modules/Auth/auth.routes";

const app = express();
const port = 5000;
console.log(config.port);

app.use(express.json());

app.use("/api/v1/auth",authRoutes)

// initial db
initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
