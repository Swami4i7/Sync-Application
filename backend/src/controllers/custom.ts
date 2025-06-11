import { Request, Response } from "express";
import { Connection } from "oracledb";
import { getConnection } from "../services/database";
import { T_Import_Parameter_t, T_Import_Schedule_t, T_schedule_status_Payload } from "../types";
import { getScdlStatus, getScheduleStatusAPI, importParametersAPI, importSchedulesAPI, readQuery } from "../api/scheduler/header";
import { M_Import_scdl_parameter_t, M_Import_scdl_t, M_schedule_status } from "../models";
import { I_customReq_Params_BodyOfObject, I_ScheduleStatus } from "../interfaces";
import { Resp_err_403, Resp_success_200 } from "../middleware/util";
import { E_SchedulerStatus, I_Status } from "../interfaces/scheduler";
import { startJobs, stopJobs } from "../api/job";
import { T_getStatus, T_Metadata } from "../types/schedule/header";
import { scheduledJobs, scheduleJob } from "node-schedule";
import _ from "lodash";
import { T_MailNotificationRes } from "../types/mail";
import { readMailContent } from "../api/mail";
import { sendMail_mdlr } from "../services/mail";
import { encryptBody } from "../middleware/auth";


var startFlag: boolean = true;

export const importSchedule = async (
  req: any,
  res: Response,
) => {
  var conn: Connection;
  let opts = {};
  const schedules: any = req.body.Schedules;
  const parameters: any = req.body.Parameters;
  conn = await getConnection();
  try {
    let count = 1;
    for (let rec of schedules) {
      let payload: T_Import_Schedule_t = {
        Schedules: [
          {
            SCHEDULE_ID: rec.SCHEDULE_ID,
            SCHEDULE_NAME: rec.SCHEDULE_NAME,
            BI_REPORT_NAME: rec.BI_REPORT_NAME,
            BI_REPORT_PATH: rec.BI_REPORT_PATH,
            CREATED_BY: rec.CREATED_BY,
            CREATION_DATE: rec.CREATION_DATE,
            DB_COLUMN_NAMES: rec.DB_COLUMN_NAMES,
            DB_TABLE_NAME: rec.DB_TABLE_NAME,
            FREQUENCY_MIN: rec.FREQUENCY_MIN,
            LAST_UPDATED_BY: rec.LAST_UPDATED_BY,
            LAST_UPDATE_DATE: rec.LAST_UPDATE_DATE,
            OPERATION: rec.OPERATION,
            PACKAGE_TO_RUN_AFTER_PROCESS: rec.PACKAGE_TO_RUN_AFTER_PROCESS,
            RESET_DATA: rec.RESET_DATA,
            RUN_PACKAGE_AT_LAST_SEQ: rec.RUN_PACKAGE_AT_LAST_SEQ,
            STATUS: rec.STATUS,
          },
        ],
      };
      const result: any = await importSchedulesAPI(
        M_Import_scdl_t(payload.Schedules[0]),
        opts,
        conn
      );
      // console.log("result----", result.outBinds);
      let importSchedule: any[] = _.filter(parameters, {
        SCHEDULE_ID: rec.SCHEDULE_ID,
      });
      for (let obj of importSchedule) {
        let linepayload: T_Import_Parameter_t = {
          Parameters: [
            {
              PARAM_ID: obj.PARAM_ID,
              PARAM_NAME: obj.PARAM_NAME,
              PARAM_VALUE: obj.PARAM_VALUE,
              SCHEDULE_ID: result.outBinds.schedule_id[0],
              SEQUENCE_NO: obj.SEQUENCE_NO,
              CREATED_BY: obj.CREATED_BY,
              CREATION_DATE: obj.CREATION_DATE,
              LAST_UPDATED_BY: obj.LAST_UPDATED_BY,
              LAST_UPDATE_DATE: obj.LAST_UPDATE_DATE,
              NEXT_SCHEDULE_TIME: obj.NEXT_SCHEDULE_TIME,
              NEXT_SCHEDULE_TIME_TEMP: obj.NEXT_SCHEDULE_TIME_TEMP,
            },
          ],
        };
        const result1: any = await importParametersAPI(
          M_Import_scdl_parameter_t(linepayload.Parameters[0]),
          opts,
          conn
        );
        // console.log("result1----", result1.outBinds);
      }
      count++;
    }
    conn.commit();
    res.status(200).send({ message: "Successfully Data Inserted!!!!" });
  } catch (err: any) {
    conn.rollback();
    res.status(403).json({ message: err.message });
  } finally {
    if (conn != null) {
      conn.close();
    }
  }
};

export const getScheduleStatus = async (
  req: I_customReq_Params_BodyOfObject<T_schedule_status_Payload>,
  res: Response,
) => {
  try {
    const result = await getScheduleStatusAPI(M_schedule_status(req.params));
    res.status(200).json(result.rows);
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};

export const getStartScheduler = async (req: Request, res: Response) => {
  try {
    if (!startFlag) {
      return res.status(200).json({ message: "Please stop the scheduler" });
    }
    startFlag = false;
    const resp: I_Status = {
      status: E_SchedulerStatus.START,
    };
    Resp_success_200(res, resp);
    startJobs();
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};

export const getStopScheduler = async (req: Request, res: Response) => {
  try {
    if (startFlag) {
      return res.status(200).json({ message: "Please start the scheduler" });
    }
    startFlag = true;
    const resp: I_Status = {
      status: E_SchedulerStatus.STOP,
    };
    res.status(200).json(resp);
    stopJobs();
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};

// export const getStatusScheduler = async (req: Request, res: Response) => {
//   try {
//     const getStatus: I_ScheduleStatus<T_Metadata, T_getStatus> =
//       await getScdlStatus();
//     const logs: {
//       id: string;
//       status: string;
//       date: string | null;
//     }[] = await Promise.all(
//       _.map(getStatus.rows, (schedule) => {
//         return {
//           id: schedule.SCHEDULE_ID,
//           bi_report_name: schedule.BI_REPORT_NAME,
//           status: schedule.STATUS,
//           date: scheduledJobs[schedule.SCHEDULE_ID.toString()]
//             ?.nextInvocation()
//             ?.toString(),
//         };
//       })
//     );
//     res.status(200).json(logs);
//   } catch (err: any) {
//     Resp_err_403(res, err.message);
//   }
// };

export const getStatusScheduler = async (req: Request, res: Response) => {
  try {
        
    const getStatus: I_ScheduleStatus<T_Metadata, T_getStatus> =
      await getScdlStatus();
    console.log("getStatus", getStatus);
    const logs: {
      id: string;
      status: string;
      date: string | null;
    }[] = await Promise.all(
      _.map(getStatus.rows, (schedule) => {
        return {
          id: schedule.SCHEDULE_ID,
          bi_report_name: schedule.BI_REPORT_NAME,
          status: schedule.STATUS,
          date: scheduledJobs[schedule.SCHEDULE_ID.toString()]
            ?.nextInvocation()
            ?.toString(),
        };
      })
    );
    console.log("logs", logs);
    const { ciphertext, iv } = encryptBody(JSON.stringify(logs));
    const encryptedBody = JSON.stringify({ ciphertext, iv });
    console.log("ciphertext", ciphertext);
    console.log("iv", iv);
    console.log("encryptedBody", encryptedBody);
    res.status(200).json(encryptedBody);
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};


export const mailNotification = async () => {
  scheduleJob(
    process.env.MAIL_SCHEDULER_NAME || "Sync Mail Notification",
    `${process.env.MAIL_NOTIFICATION_MIN} ${process.env.MAIL_NOTIFICATION_HOUR} * * *`,
    () => {
      getMailContent();
    }
  );
};

export const getMailContent = async () => {
  try {
    const mailNotification: T_MailNotificationRes = await readMailContent();
    if (mailNotification.err_code) console.error("Mail Scheduler Error");
    if (
      mailNotification.mailNotificationFlag === "Y" &&
      mailNotification.recordCount > 0
    ) {
      let mailtoArray = mailNotification.mailTo.split(",");
      sendMail_mdlr({
        html: mailNotification.mailContent[0].MAIL_CONTENT,
        subject: mailNotification.mailSubject,
        to: mailtoArray,
        from: mailNotification.mailFrom,
      });
    }
  } catch (err: any) {
    console.log(err.message);
  }
};

export const getResult = async (req: Request, res: Response) => {
  try {
    let query = req.params?.query.toUpperCase();
    if (query) {
      if (query.includes("DELETE") || query.includes("UPDATE")) {
        res.status(200).json("Delete or update operation not allowed!");
      } else {
        const result: any = await readQuery(query);
        res.status(200).json(result?.rows);
      }
    } else {
      res.status(200).json("Query not provided!");
    }
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};

export const CustomFunctionController = {
  importSchedule,
    getScheduleStatus,
    getStartScheduler,
    getStopScheduler,
    getStatusScheduler,
    getResult,
}