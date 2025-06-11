import Router from "express";
import { END_POINTS } from "../constants/end-points";
import { UsersRouter } from "./users";
import { SetupDetailsRouter } from "./setup-details";
import { ScheduleParameterRouter } from "./schedule-parameters";
import { ScheduleLogsRouter } from "./schedule-logs";
import { CustomFunctionRouter } from "./custom";
import { verifyHMAC, verifyToken } from "../middleware/auth";
import { LoginRouter } from "./login";

const router = Router();

router.use(END_POINTS.SETUP_DETAILS, verifyToken, verifyHMAC,SetupDetailsRouter);
router.use(END_POINTS.SCHEDULE_DETAILS, verifyToken, verifyHMAC,ScheduleParameterRouter);
router.use(END_POINTS.SCHEDULE_LOGS, verifyToken, verifyHMAC, ScheduleLogsRouter);
router.use(END_POINTS.USERS, verifyToken, verifyHMAC, UsersRouter);
router.use(END_POINTS.CUSTOM, verifyToken,CustomFunctionRouter);
router.use(END_POINTS.LOGIN, verifyHMAC,LoginRouter);
export default router;
