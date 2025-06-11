import { Router } from "express";
import { ScheduleLogsController } from "../controllers/schedule-logs";

export const ScheduleLogsRouter = Router();

ScheduleLogsRouter.get("/readlist",ScheduleLogsController.readList);
ScheduleLogsRouter.post("/readerror",ScheduleLogsController.readError);
ScheduleLogsRouter.get("/readschedulename",ScheduleLogsController.readScheduleName);
ScheduleLogsRouter.get("/readtablename",ScheduleLogsController.readTableName);
ScheduleLogsRouter.get("/getErrorLogs",ScheduleLogsController.getErrorLogs);
ScheduleLogsRouter.delete("/deletelog/:no_of_weeks",ScheduleLogsController.deleteLog);
