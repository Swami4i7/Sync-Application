import { format } from "date-and-time";
import _ from "lodash";
import { scheduledJobs, scheduleJob } from "node-schedule";
import { executeMergeQuery, pushblobReports, pushReports } from ".";
import { I_singleCursorResp } from "../interfaces";
import { I_InsScdlLineRes, I_ScdParamsRes } from "../interfaces/schedule/lines";
import { M_ExeMrgQryOptions, M_GetSchedule, M_ResetStatus } from "../models";
import { M_insScdlLine, M_updScdlLine_status, M_readScdParams } from "../models/scheduler/lines";
import { M_ReportArgsSoap } from "../models/soap";
import { T_ScdlHdrRes } from "../types/schedule/header";
import { T_Credentials } from "../types/soap";
import { readScdlHdr } from "./scheduler/header";
import {
  insScdlLine_api,
  updScdlLine_status_api,
  resetLine_status_api,
  readScdParams_api,
  executePackage_api,
} from "./scheduler/lines";
import { getReportData } from "./soap";

export const runJob = async (
  {
    SCHEDULE_ID,
    BI_REPORT_NAME,
    BI_REPORT_PATH,
    DB_COLUMN_NAMES,
    DB_TABLE_NAME,
    OPERATION,
    RESET_DATA,
    PACKAGE_TO_RUN_AFTER_PROCESS,
    RUN_PACKAGE_AT_LAST_SEQ,
  }: T_ScdlHdrRes,
  credentials: T_Credentials
) => {
  var params: I_ScdParamsRes | null;
  try {
    params = await readScdParams_api(M_readScdParams(SCHEDULE_ID));
    await processReportData(
      SCHEDULE_ID,
      BI_REPORT_NAME,
      BI_REPORT_PATH,
      DB_COLUMN_NAMES,
      DB_TABLE_NAME,
      OPERATION,
      RESET_DATA,
      credentials,
      1,
      params,
      PACKAGE_TO_RUN_AFTER_PROCESS,
      RUN_PACKAGE_AT_LAST_SEQ,
      0
    );
  } catch (err: any) {
    console.error(err);
  }
};

export const processReportData = async (
  SCHEDULE_ID: number,
  BI_REPORT_NAME: string,
  BI_REPORT_PATH: string,
  DB_COLUMN_NAMES: string | null,
  DB_TABLE_NAME: string,
  OPERATION: "INSERT" | "MERGE",
  RESET_DATA: string,
  credentials: T_Credentials,
  paramcount: number,
  params: I_ScdParamsRes,
  PACKAGE_TO_RUN_AFTER_PROCESS: string | null,
  RUN_PACKAGE_AT_LAST_SEQ: string,
  TOTAL_REPORT_COUNT: number
) => {
  var lastParam: string = "NO";
  var recordCount = 0;
  if (params.params_count === 0 || paramcount === params.params_count) {
    lastParam = "YES";
  }
  var scdlList: I_InsScdlLineRes | null;
  try {
    let paramList = params.params.filter((par) => {
      return par.SEQUENCE_NO === paramcount;
    });
    scdlList = await insScdlLine_api(M_insScdlLine(SCHEDULE_ID, DB_TABLE_NAME, paramcount));
    console.log("schedule_list_id-----", scdlList.schedule_list[0].SCHEDULE_LIST_ID.toString());
    if (params.already_running === 0) {
      const reportAbsolutePath: string = `${BI_REPORT_PATH}/${BI_REPORT_NAME}.xdo`;
      let lastUpdate: string = "";
      if (scdlList.schedule_list[0].LAST_REFRESH_TIME) {
        lastUpdate = format(scdlList.schedule_list[0].LAST_REFRESH_TIME, "MM-DD-YYYY HH:mm:ss");
      }
      // console.log(scdlList.schedule_list[0].LAST_REFRESH_TIME);
      // const lastUpdate: string = "01-01-2010 06:00:00"; // MM-dd-yyyy HH:mm:ss
      // console.log(M_ReportArgsSoap(lastUpdate, reportAbsolutePath, credentials));
      const reportData: any = await getReportData(
        credentials,
        M_ReportArgsSoap(lastUpdate, reportAbsolutePath, credentials, paramList),
        SCHEDULE_ID.toString()
      );
      if (RESET_DATA === "Y" && paramcount === 1)
        await executeMergeQuery(
          [{ table_name: DB_TABLE_NAME, query: `delete from ${DB_TABLE_NAME}` }],
          M_ExeMrgQryOptions()
        );

      if (reportData?.DATA_DS?.G_1) {
        recordCount = reportData.DATA_DS.G_1.length;
        const blobColumns = scdlList.table_structure.filter((column) => column.DATA_TYPE === "BLOB");
        if (blobColumns.length > 0) {
          pushblobReports(
            DB_TABLE_NAME,
            DB_COLUMN_NAMES,
            scdlList.table_structure,
            OPERATION,
            reportData.DATA_DS.G_1,
            SCHEDULE_ID,
            scdlList.schedule_list[0].SCHEDULE_LIST_ID
          );
        } else {
          pushReports(
            DB_TABLE_NAME,
            DB_COLUMN_NAMES,
            scdlList.table_structure,
            OPERATION,
            reportData.DATA_DS.G_1,
            SCHEDULE_ID,
            scdlList.schedule_list[0].SCHEDULE_LIST_ID
          );
        }
      }
      updScdlLine_status_api(
        M_updScdlLine_status(
          scdlList.schedule_list[0].SCHEDULE_LIST_ID.toString(),
          "COMPLETED",
          null,
          paramcount,
          lastParam,
          recordCount
        )
      );
      TOTAL_REPORT_COUNT += recordCount;
      if (
        PACKAGE_TO_RUN_AFTER_PROCESS &&
        PACKAGE_TO_RUN_AFTER_PROCESS !== null &&
        TOTAL_REPORT_COUNT > 0 &&
        (RUN_PACKAGE_AT_LAST_SEQ !== "Y" || lastParam === "YES")
      ) {
        let packageCall = `BEGIN
          ${PACKAGE_TO_RUN_AFTER_PROCESS};
          END;`;
        await executePackage_api(packageCall);
      }
      paramcount += 1;
      if (lastParam === "NO") {
        await processReportData(
          SCHEDULE_ID,
          BI_REPORT_NAME,
          BI_REPORT_PATH,
          DB_COLUMN_NAMES,
          DB_TABLE_NAME,
          OPERATION,
          RESET_DATA,
          credentials,
          paramcount,
          params,
          PACKAGE_TO_RUN_AFTER_PROCESS,
          RUN_PACKAGE_AT_LAST_SEQ,
          TOTAL_REPORT_COUNT
        );
      }
    } else {
      updScdlLine_status_api(
        M_updScdlLine_status(
          scdlList.schedule_list[0].SCHEDULE_LIST_ID.toString(),
          "ALREADY RUNNING",
          null,
          paramcount,
          lastParam,
          recordCount
        )
      );
    }
  } catch (err: any) {
    console.error(err);
    if (scdlList!.schedule_list?.length && scdlList!.schedule_list[0].SCHEDULE_LIST_ID.toString())
      updScdlLine_status_api(
        M_updScdlLine_status(
          scdlList!.schedule_list[0].SCHEDULE_LIST_ID.toString(),
          "ERROR",
          err.message ? err.message.substring(0, 2000) : err.toString().substring(0, 2000),
          paramcount,
          lastParam,
          recordCount
        )
      );
    paramcount += 1;
    if (lastParam === "NO") {
      await processReportData(
        SCHEDULE_ID,
        BI_REPORT_NAME,
        BI_REPORT_PATH,
        DB_COLUMN_NAMES,
        DB_TABLE_NAME,
        OPERATION,
        RESET_DATA,
        credentials,
        paramcount,
        params,
        PACKAGE_TO_RUN_AFTER_PROCESS,
        RUN_PACKAGE_AT_LAST_SEQ,
        TOTAL_REPORT_COUNT
      );
    }
  }
};

export const startJobs = async () => {
  await resetLine_status_api(M_ResetStatus());
  const getSchedule: I_singleCursorResp<T_ScdlHdrRes> = await readScdlHdr(M_GetSchedule());
  if (getSchedule.cursor) {
    _.each(getSchedule.cursor, (scdlHdr: T_ScdlHdrRes) => {
      const { SCHEDULE_ID, FREQUENCY_MIN, OPERATION, DB_COLUMN_NAMES } = scdlHdr;
      if (!scheduledJobs[SCHEDULE_ID.toString()]) {
        let minorhour = FREQUENCY_MIN / 60;
        let rule = "";
        if (minorhour < 1) {
          rule = `*/${FREQUENCY_MIN} * * * *`;
        } else {
          let hour = Math.floor(minorhour);
          if (hour === 24) {
            hour = 0;
            rule = `0 ${hour} * * *`;
          } else {
            rule = `0 */${hour} * * *`;
          }
        }
        scheduleJob(SCHEDULE_ID.toString(), rule, () => {
          if ((OPERATION === "MERGE" && DB_COLUMN_NAMES) || OPERATION === "INSERT")
            runJob(scdlHdr, {
              domain: getSchedule.domain,
              password: getSchedule.password,
              username: getSchedule.username,
            });
        });
      } else {
        console.log(SCHEDULE_ID.toString(), " schedule id is already running");
      }
    });
  }
};

export const stopJobs = () => {
  _.each(scheduledJobs, (job) => {
    if (job.name !== process.env.MAIL_SCHEDULER_NAME) {
      job.cancel();
    }
  });
};