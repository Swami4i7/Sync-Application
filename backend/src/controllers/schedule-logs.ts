import { Request, Response } from "express";
import { ApiResponse, SearchParams } from "../types/ApiResponse";
import { parseCustomWhere } from "../services/database";
import { deleteLogAPI, getErrorLogsAPI, readErrorAPI, readListAPI, readScheduleNameAPI, readTableNameAPI } from "../api/scheduler/header";
import { I_customReq_BodyOfObject, I_customReq_Params_BodyOfObject } from "../interfaces";
import { T_deleteLogPayload, T_scdlErrPayload } from "../types";
import { M_DeleteLog, M_scdlErr } from "../models";
import { Resp_err_403 } from "../middleware/util";
import { encryptBody } from "../middleware/auth";

export const readList = async (req: Request, res: Response) => {
  try {
    const searchParams: SearchParams = {
      searchColumns: req.query.searchColumns
        ? (req.query.searchColumns as string).split(",")
        : undefined,
      searchTerm: req.query.searchTerm as string | undefined,
      sortColumn: req.query.sortColumn as string | undefined,
      sortOrder: req.query.sortOrder as "ASC" | "DESC" | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined,
        primaryKey: req.query.primaryKey as string | undefined,
        customWhere: parseCustomWhere(
          req.query.customWhere as string | undefined
      ),
    };    
    const response: ApiResponse = await readListAPI(searchParams);
    const { ciphertext, iv } = encryptBody(JSON.stringify(response));
    const encryptedBody = JSON.stringify({ ciphertext, iv });
    res.status(response.success ? 200 : 400).json(encryptedBody);
  } catch (err: any) {
    console.error("Error in fetching Sync Logs:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// export const getErrorLogs = async (
//   req: I_customReq_Params_BodyOfObject<T_SCHEDULE_ERROR_LOGS_T>,
//   res: Response,
// ) => {
//   try {
//     console.log("req.params", req.params);
//     const result = await getErrorLogsAPI(M_schedule_error_logs(req.params));
//     res.status(200).json(result.rows);
//   } catch (err: any) {
//     Resp_err_403(res, err.message);
//   }
// };


// export const getErrorLogs = async (req: Request, res: Response) => {
//   try {
//     const searchParams: SearchParams = {
//       searchColumns: req.query.searchColumns
//         ? (req.query.searchColumns as string).split(",")
//         : undefined,
//       searchTerm: req.query.searchTerm as string | undefined,
//       sortColumn: req.query.sortColumn as string | undefined,
//       sortOrder: req.query.sortOrder as "ASC" | "DESC" | undefined,
//       limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
//       offset: req.query.offset
//         ? parseInt(req.query.offset as string)
//         : undefined,
//         primaryKey: req.query.primaryKey as string | undefined,
//         customWhere: parseCustomWhere(
//           req.query.customWhere as string | undefined
//       ),
//     };
//     console.log("searchParams", searchParams);
//     const response: ApiResponse = await getErrorLogsAPI(searchParams);
//     res.status(response.success ? 200 : 400).json(response);
//   } catch (err: any) {
//     console.error("Error in fetching Error Logs:", err);
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };


export const getErrorLogs = async (req: Request, res: Response) => {
  try {
    const searchParams: SearchParams = {
      searchColumns: req.query.searchColumns
        ? (req.query.searchColumns as string).split(",")
        : undefined,
      searchTerm: req.query.searchTerm as string | undefined,
      sortColumn: req.query.sortColumn as string | undefined,
      sortOrder: req.query.sortOrder as "ASC" | "DESC" | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset
        ? parseInt(req.query.offset as string)
        : undefined,
        primaryKey: req.query.primaryKey as string | undefined,
        customWhere: parseCustomWhere(
          req.query.customWhere as string | undefined
      ),
    };
    const response: ApiResponse = await getErrorLogsAPI(searchParams);
    const { ciphertext, iv } = encryptBody(JSON.stringify(response));
    const encryptedBody = JSON.stringify({ ciphertext, iv });
    res.status(response.success ? 200 : 400).json(encryptedBody);
  } catch (err: any) {
    console.error("Error in fetching Error Logs:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const readError = async (
  req: I_customReq_BodyOfObject<T_scdlErrPayload>,
  res: Response,
) => {
  try {
    const result: any = await readErrorAPI(M_scdlErr(req.body));
    res.status(200).json(result.rows);
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};

// export const rreadScheduleName = async (req: Request, res: Response) => {
//   try {
//     const result = await readScheduleNameAPI();
//     res.status(200).json(result.rows);
//   } catch (err: any) {
//     Resp_err_403(res, err.message);
//   }
// };

export const readScheduleName = async (req: Request, res: Response) => {
  try {
    const response = await readScheduleNameAPI();
    const { ciphertext, iv } = encryptBody(JSON.stringify(response));
    const encryptedBody = JSON.stringify({ ciphertext, iv });
    res.status(response.success ? 200 : 400).json(encryptedBody);
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};

export const readTableName = async (req: Request, res: Response) => {
  try {
    const result = await readTableNameAPI();
    res.status(200).json(result.rows);
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};


export const deleteLog = async (
  req: I_customReq_Params_BodyOfObject<T_deleteLogPayload>,
  res: Response,
) => {
  try {
    if (parseInt(req.params.no_of_weeks) < 4) {
      res.status(400).json({ message: "Greater Than 4 Weeks Mandatory" });
    } else {
      const result: any = await deleteLogAPI(M_DeleteLog(req.params));
      res
        .status(200)
        .json({ Message: "Deleted Rows", Rows: result.rowsAffected });
    }
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};


export const ScheduleLogsController = {
  readList,
  readError,
  readScheduleName,
  readTableName,
  getErrorLogs,
  deleteLog,
}