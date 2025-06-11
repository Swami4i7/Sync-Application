import { Router } from "express";
import { UserController } from "../controllers/users";

export const UsersRouter = Router();

UsersRouter.get("/",UserController.getUsers);
UsersRouter.post("/",UserController.createUsers);
UsersRouter.patch("/:user_id",UserController.updateUsers);
UsersRouter.delete("/:user_id",UserController.deleteUsers);
