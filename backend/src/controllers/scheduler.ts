import { NextFunction, query, Request, Response } from "express";
import { startJobs, stopJobs } from "../api/job";
import { E_SchedulerStatus, I_Status } from "../interfaces/scheduler";
import { Resp_err_403, Resp_success_200 } from "../middleware/util";
import {
  I_customReq_BodyOfObject,
  I_customReq_Params,
  I_customReq_Params_BodyOfObject,
  I_singleCursorResp,
  I_ScheduleStatus,
} from "../interfaces";
import _ from "lodash";
import { scheduledJobs, scheduleJob } from "node-schedule";
import {
  readScdlHdr,
  readQuery,
  readSchedulerAPI,
  readListAPI,
  readErrorAPI,
  readScheduleNameAPI,
  readTableNameAPI,
  createScheduleAPI,
  createParameterAPI,
  deleteScheduleAPI,
  deleteParameterAPI,
  updateScheduleAPI,
  updateParameterAPI,
  getDetailsAPI,
  updateDetailsAPI,
  createDetailsAPI,
  createUsersAPI,
  getUserAPI,
  getUsersAPI,
  updateUsersAPI,
  deleteUsersAPI,
  loginAPI,
  getScdlStatus,
  importParametersAPI,
  importSchedulesAPI,
  deleteLogAPI,
  getScheduleStatusAPI,
  getErrorLogsAPI,
  readParameterAPI,
  updateCustomParameterAPI,
  createScheduleParameterAPI,
} from "../api/scheduler/header";
import {
  M_create_details_t,
  M_create_users_t,
  M_DeleteLog,
  M_Delete_Users,
  M_GetSchedule,
  M_Get_Users,
  M_Import_scdl_parameter_t,
  M_Import_scdl_t,
  M_login_users_t,
  M_scdlDelete_parameter_t,
  M_scdlDelete_t,
  M_scdlErr,
  M_scdlUpdate_parameter_t,
  M_scdlUpdate_t,
  M_scdl_parameter_t,
  M_scdl_t,
  M_setup_details,
  M_updateDetail_t,
  M_updateUsers_t,
  M_schedule_status,
  M_schedule_error_logs,
  M_Parameter,
  M_create_schedule_parameters_t,
} from "../models";
import {
  T_ScdlHdrRes,
  T_getStatus,
  T_Metadata,
} from "../types/schedule/header";
import { readMailContent } from "../api/mail";
import { T_MailNotificationRes } from "../types/mail";
import { sendMail_mdlr } from "../services/mail";
import {
  T_deleteLogPayload,
  T_Import_Parameter_t,
  T_Import_Schedule_t,
  T_loginUser,
  T_scdlDelete_parameter_Payload,
  T_scdlDelete_Payload,
  T_scdlErrPayload,
  T_scdlListPayload,
  T_scdlUpdate_parameter_Payload,
  T_scdlUpdate_Payload,
  T_scdl_parameter_t_Payload,
  T_scdl_t_Payload,
  T_ScheduleUsersDelete,
  T_ScheduleUsersPayload,
  T_ScheduleUsersUpdate,
  T_ScheduleUsers_t,
  T_setupDetailPayload,
  T_setupDetails_t,
  T_updateDetails_t,
  T_updateSchedule_parameter_t,
  T_updateSchedule_t,
  T_schedule_status_Payload,
  T_SCHEDULE_ERROR_LOGS_T,
  T_UpdateUsersPayload,
  T_Scheduleparameter_t,
} from '../types';
import { M_scdlList } from '../models/index';
import { T_updateDetailPayload } from '../types/index';
import { Connection } from 'oracledb';
import { getConnection, parseCustomWhere } from '../services/database';
import { ApiResponse, SearchParams } from '../types/ApiResponse';
import { format } from 'date-fns';



