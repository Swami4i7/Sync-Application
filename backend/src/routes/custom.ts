import { Router } from "express";
import { CustomFunctionController } from "../controllers/custom";

export const CustomFunctionRouter = Router();

CustomFunctionRouter.post("/import",CustomFunctionController.importSchedule);
CustomFunctionRouter.get("schedule/:schedule_id",CustomFunctionController.getScheduleStatus);
CustomFunctionRouter.get("/start",CustomFunctionController.getStartScheduler);
CustomFunctionRouter.get("/stop",CustomFunctionController.getStopScheduler);
CustomFunctionRouter.get("/status",CustomFunctionController.getStatusScheduler);
CustomFunctionRouter.get("result/:query",CustomFunctionController.getResult);
