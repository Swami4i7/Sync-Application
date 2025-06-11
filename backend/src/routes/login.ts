import { Router } from "express";
import { UserController } from "../controllers/users";

export const LoginRouter = Router();

LoginRouter.post("/",UserController.loginUsers);
