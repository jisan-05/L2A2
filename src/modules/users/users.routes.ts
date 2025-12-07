import { Router } from "express";
import { usersController } from "./users.controller";

const router = Router()

router.post('/',usersController.createUser)

export const usersRoutes = router;