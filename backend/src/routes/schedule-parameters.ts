import { Router } from "express";
import { ScheduleParameterController } from "../controllers/schedule-parameters";

export const ScheduleParameterRouter = Router();

//schedule
ScheduleParameterRouter.get("/readscheduler", ScheduleParameterController.readScheduler);
ScheduleParameterRouter.post("/createschedule", ScheduleParameterController.createSchedule);
ScheduleParameterRouter.put("/updateschedule/:schedule_id", ScheduleParameterController.updateSchedule);
ScheduleParameterRouter.delete("/deleteschedule/:schedule_id",ScheduleParameterController.deleteSchedule);
//parameter
ScheduleParameterRouter.get("/parameters/:schedule_id",ScheduleParameterController.readParameter);
ScheduleParameterRouter.post("/createparameter",ScheduleParameterController.createParameter);
// ScheduleParameterRouter.put("/updateparameter/:param_id",ScheduleParameterController.updateParameter);
ScheduleParameterRouter.delete("/deleteparameter/:param_id",ScheduleParameterController.deleteParameter);
ScheduleParameterRouter.post("/scheduleparameter",ScheduleParameterController.createScheduleParameter);
ScheduleParameterRouter.post("/updateBulkParameter",ScheduleParameterController.updateCustomParameter);
