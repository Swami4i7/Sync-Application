import { Request, Response } from "express";
import { ApiResponse, SearchParams } from "../types/ApiResponse";
import { parseCustomWhere } from "../services/database";
import { createParameterAPI, createScheduleAPI, createScheduleParameterAPI, deleteParameterAPI, deleteScheduleAPI, readParameterAPI, readSchedulerAPI, updateParameterAPI, updateScheduleAPI } from "../api/scheduler/header";
import { I_customReq_BodyOfObject, I_customReq_Params, I_customReq_Params_BodyOfObject } from "../interfaces";
import { T_scdl_parameter_t_Payload, T_scdl_t_Payload, T_scdlDelete_parameter_Payload, T_scdlDelete_Payload, T_scdlUpdate_parameter_Payload, T_scdlUpdate_Payload, T_Scheduleparameter_t, T_updateSchedule_parameter_t, T_updateSchedule_t } from "../types";
import { M_create_schedule_parameters_t, M_Parameter, M_scdl_parameter_t, M_scdl_t, M_scdlDelete_parameter_t, M_scdlDelete_t, M_scdlUpdate_parameter_t, M_scdlUpdate_t } from "../models";
import { Resp_err_403 } from "../middleware/util";
import { format } from "date-fns";
import { decryptBody, encryptBody } from "../middleware/auth";

export const readScheduler = async (req: Request, res: Response) => {
  try {
    // Convert query params properly
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
    const response: ApiResponse = await readSchedulerAPI(searchParams);
    const { ciphertext, iv } = encryptBody(JSON.stringify(response));
    const encryptedBody = JSON.stringify({ ciphertext, iv });
    //console.log("encryptedBody", encryptedBody);
    res.status(response.success ? 200 : 400).json(encryptedBody);
  } catch (err: any) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createSchedule = async (
  req: I_customReq_BodyOfObject<T_scdl_t_Payload>,
  res: Response,
) => {
  try {
    const result: any = await createScheduleAPI(M_scdl_t(req.body));
    // res.status(200).json(result.outBinds);
     res.status(201).json({ success: true, data: result.outBinds });
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};

export const updateSchedule = async (
  req: I_customReq_Params<T_scdlUpdate_Payload, T_updateSchedule_t>,
  res: Response,
) => {
  const { ciphertext, iv } = req.body;
    if (!ciphertext || !iv) {
      res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
      res.setHeader("X-Timestamp", res.locals.timestamp);
      res.status(400).json({ error: "Missing ciphertext or IV" });
      return;
    }
  try {
    const decryptedBody = decryptBody(ciphertext, iv);
    console.log("decryptedBody", decryptedBody);
    const scheduleData = JSON.parse(decryptedBody);
    const scheduleID = (scheduleData.schedule_id).toString();
    console.log("scheduleID", scheduleID);
    console.log("scheduleData", scheduleData);
    console.log("scheduleData.schedule_id", scheduleData.schedule_id);

    const result: any = await updateScheduleAPI(
      M_scdlUpdate_t(scheduleID,scheduleData )
    );
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    const signature = req.headers['x-hmac-signature'] as string | undefined;
const timestamp = req.headers['x-timestamp'] as string | undefined;

if (!signature || !timestamp) {
  return res.status(400).json({ error: 'Missing HMAC signature or timestamp' });
}

    res.status(200).json(result.outBinds);
    } catch (err: any) {
      res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
      res.setHeader("X-Timestamp", res.locals.timestamp);
    Resp_err_403(res, err.message);
  }
};

export const deleteSchedule = async (
  req: I_customReq_Params_BodyOfObject<T_scdlDelete_Payload>,
  res: Response,
) => {
  const { ciphertext, iv } = req.body;
  if (!ciphertext || !iv) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(400).json({ error: "Missing ciphertext or IV" });
    return;
  }
  try {
    const decryptedBody = decryptBody(ciphertext, iv);
    const scheduleData = JSON.parse(decryptedBody);
    console.log("scheduleData", scheduleData);
    const result: any = await deleteScheduleAPI(M_scdlDelete_t(scheduleData));
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(200).json(result.outBinds);
    } catch (err: any) {
       res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    Resp_err_403(res, err.message);
  }
};



export const readParameter = async (req: Request, res: Response) => {
  try {
    const result = await readParameterAPI(
      M_Parameter(Number(req.params.schedule_id))
    );
    res.status(200).json({ success: true, data: result.rows });
    
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};  

export const createParameter = async (
  req: I_customReq_BodyOfObject<T_scdl_parameter_t_Payload>,
  res: Response,
) => {
  try {
    const result: any = await createParameterAPI(M_scdl_parameter_t(req.body));
    res.status(201).json({ success: true, data: result.outBinds });
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};


// export const updateParameter = async (
//   req: I_customReq_Params<
//     T_scdlUpdate_parameter_Payload,
//     T_updateSchedule_parameter_t
//   >,
//   res: Response,
// ) => {
//   try {
//     const result: any = await updateParameterAPI(
//       M_scdlUpdate_parameter_t(req.params, req.body)
//     );
//      res.status(200).json({ success: true, data: result.outBinds });
//   } catch (err: any) {
//     Resp_err_403(res, err.message);
//   }
// };

export const deleteParameter = async (
  req: I_customReq_Params_BodyOfObject<T_scdlDelete_parameter_Payload>,
  res: Response,
) => {
  try {
    const result: any = await deleteParameterAPI(
      M_scdlDelete_parameter_t(req.params)
    );
     res.status(200).json({ success: true, data: result.outBinds });
  } catch (err: any) {
    Resp_err_403(res, err.message);
  }
};

export const createScheduleParameter = async (
  req: I_customReq_BodyOfObject<T_Scheduleparameter_t>,
  res: Response,
) => {
  const { ciphertext, iv } = req.body;
  if (!ciphertext || !iv) {
  res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
  res.setHeader("X-Timestamp", res.locals.timestamp);
  res.status(400).json({ error: "Missing ciphertext or IV" });
  return;
}
  try {
    const decryptedBody = decryptBody(ciphertext, iv);
    const scheduleParameterData = JSON.parse(decryptedBody);

    const result: any = await createScheduleParameterAPI(
      M_create_schedule_parameters_t(scheduleParameterData)
    );
    console.log("createschparam result",result);
    console.log("createschdparam req body",req.body);
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(200).json(result.outBinds);
  } catch (err: any) {
     res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    Resp_err_403(res, err.message);
  }
};

// export const updateCustomParameter = async (req: Request, res: Response) => {
//   const { create, update, delete: deletedIds } = req.body;

//   // console.log("Request Body: ", req.body);

//   try {
//     const resultData = {
//       created: [] as number[],
//       updated: [] as number[],
//       deleted: [] as number[],
//     };

//     // Process creates
//     if (create?.length) {
//       resultData.created = await createParameters(create);
//     }

//     // Process updates
//     if (update?.length) {
//       resultData.updated = await updateParameters(update);
//     }

//     // Process deletes
//     if (deletedIds?.length) {
//       resultData.deleted = await deleteParameters(deletedIds);
//     }

//     // Commit is assumed to be handled elsewhere if transactions are used.

//     // console.log("Result: ", resultData);
//     res.status(200).json({
//       success: true,
//       data: [resultData],
//       message: "Parameters Saved Successfully",
//     });
//   } catch (error: any) {
//     // Rollback is assumed to be handled elsewhere if transactions are used.
//     console.error("Error in updateCustomParameter: ", error);
//     res.status(500).json({
//       success: false,
//       // Propagate the specific error message from helper functions
//       message: error.message || "Operation failed",
//     });
//   } finally {
//     // Connection release is assumed to be handled elsewhere.
//   }

  

//   // Helper functions - simplified, no connection parameter
//   async function createParameters(
//     create: T_scdl_parameter_t_Payload[]
//   ): Promise<number[]> {
//     const paramIds: number[] = [];
//     try {
//       for (const item of create) {
//         const reqBody = {
//           schedule_id: item.schedule_id,
//           param_name: item.param_name,
//           param_value: item.param_value,
//           sequence_no: item.sequence_no,
//           next_schedule_time: new Date(item.next_schedule_time), 
//           next_schedule_time_temp: new Date(),
//           created_by: item.created_by,
//           last_updated_by: item.last_updated_by,
//         };
//         // console.log("Creating reqBody: ", reqBody);
//         // Connection is no longer passed here
//         const result = await createParameterAPI(M_scdl_parameter_t(reqBody));
//         // Ensure result structure is as expected and handle potential variations
//         if (result?.outBinds?.param_id?.[0]) {
//           paramIds.push(result.outBinds.param_id[0]);
//         } else {
//           console.warn(
//             "Create parameter API did not return expected param_id structure for item:",
//             item
//           );
//           // Decide how to handle this - throw error, push null/undefined, or skip?
//           // Throwing an error might be safest if an ID is always expected.
//           throw new Error(
//             `Create failed: Did not receive param_id for ${item.param_name}`
//           );
//         }
//       }
//       return paramIds;
//     } catch (error: any) {
//       // Re-throw with more context
//       throw new Error(`Create parameters failed: ${error.message}`);
//     }
//   }

//   async function updateParameters(
//     update: T_updateSchedule_parameter_t[]
//   ): Promise<number[]> {
//     const updatedParamIds: number[] = [];
//     // const update_param_id = update.[0].param_id;
//     try {
//       for (const item of update) {
//         const reqBody = {
//           param_id: item.param_id,
//           schedule_id: item.schedule_id,
//           param_name: item.param_name,
//           param_value: item.param_value,
//           sequence_no: item.sequence_no,
//           next_schedule_time: new Date(item.next_schedule_time),
//           next_schedule_time_temp: new Date(),
//           last_updated_by: item.last_updated_by,
//         };
//         // console.log("Updating reqBody: ", reqBody);
//         // Connection is no longer passed here
//         const result = await updateParameterAPI(
//           M_scdlUpdate_parameter_t(reqBody)
//         );
//         // Ensure result structure is as expected
//         if (result?.outBinds?.param_id) {
//           // Assuming update returns the ID directly
//           updatedParamIds.push(Number(result.outBinds.param_id)); // Convert if needed
//         } else {
//           console.warn(
//             "Update parameter API did not return expected param_id structure for item:",
//             item
//           );
//           throw new Error(
//             `Update failed: Did not receive param_id for ${item.param_name}`
//           );
//         }
//       }
//       return updatedParamIds;
//     } catch (error: any) {
//       // Re-throw with more context
//       throw new Error(`Update parameters failed: ${error.message}`);
//     }
//   }

//   async function deleteParameters(deleteIds: number[]): Promise<number[]> {
//     const deletedParamIds: number[] = [];
//     try {
//       for (const paramId of deleteIds) {
//         // console.log("Deleting param_id: ", paramId);
//         // Connection is no longer passed here
//         const result = await deleteParameterAPI(
//           M_scdlDelete_parameter_t({ param_id: String(paramId) })
//         );
//         // Ensure result structure is as expected
//         if (result?.outBinds?.param_id) {
//           // Assuming delete returns the ID directly
//           deletedParamIds.push(Number(result.outBinds.param_id)); // Convert if needed
//         } else {
//           console.warn(
//             "Delete parameter API did not return expected param_id structure for ID:",
//             paramId
//           );
//           throw new Error(
//             `Delete failed: Did not receive confirmation for param_id ${paramId}`
//           );
//         }
//       }
//       return deletedParamIds;
//     } catch (error: any) {
//       // Re-throw with more context
//       throw new Error(`Delete parameters failed: ${error.message}`);
//     }
//   }
// };

export const updateCustomParameter = async (req: Request, res: Response) => {
  const { ciphertext, iv } = req.body;

  // Validate ciphertext and iv
  if (!ciphertext || !iv) {
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(400).json({ error: "Missing ciphertext or IV" });
    return;
  }

  try {
    // Decrypt the request body
    const decryptedBody = decryptBody(ciphertext, iv);
    const { create, update, delete: deletedIds } = JSON.parse(decryptedBody);

    const resultData = {
      created: [] as number[],
      updated: [] as number[],
      deleted: [] as number[],
    };

    // Process creates
    if (create?.length) {
      resultData.created = await createParameters(create);
    }

    // Process updates
    if (update?.length) {
      resultData.updated = await updateParameters(update);
    }

    // Process deletes
    if (deletedIds?.length) {
      resultData.deleted = await deleteParameters(deletedIds);
    }

    // Encrypt the response data
    const responseData = {
      success: true,
      data: [resultData],
      message: "Parameters Saved Successfully",
    };
    const { ciphertext: responseCiphertext, iv: responseIv } = encryptBody(JSON.stringify(responseData));
    const encryptedBody = JSON.stringify({ ciphertext: responseCiphertext, iv: responseIv });

    // Set headers and send encrypted response
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(200).json(encryptedBody);
  } catch (error: any) {
    // Set headers and send error response
    res.setHeader("X-HMAC-Signature", res.locals.hmacSignature);
    res.setHeader("X-Timestamp", res.locals.timestamp);
    res.status(500).json({
      success: false,
      message: error.message || "Operation failed",
    });
  } finally {
    // Connection release is assumed to be handled elsewhere.
  }

  // Helper functions - simplified, no connection parameter
  async function createParameters(
    create: T_scdl_parameter_t_Payload[]
  ): Promise<number[]> {
    const paramIds: number[] = [];
    try {
      for (const item of create) {
        const reqBody = {
          schedule_id: item.schedule_id,
          param_name: item.param_name,
          param_value: item.param_value,
          sequence_no: item.sequence_no,
          next_schedule_time: new Date(item.next_schedule_time),
          next_schedule_time_temp: new Date(),
          created_by: item.created_by,
          last_updated_by: item.last_updated_by,
        };
        const result = await createParameterAPI(M_scdl_parameter_t(reqBody));
        if (result?.outBinds?.param_id?.[0]) {
          paramIds.push(result.outBinds.param_id[0]);
        } else {
          console.warn(
            "Create parameter API did not return expected param_id structure for item:",
            item
          );
          throw new Error(
            `Create failed: Did not receive param_id for ${item.param_name}`
          );
        }
      }
      return paramIds;
    } catch (error: any) {
      throw new Error(`Create parameters failed: ${error.message}`);
    }
  }

  async function updateParameters(
    update: T_updateSchedule_parameter_t[]
  ): Promise<number[]> {
    const updatedParamIds: number[] = [];
    try {
      for (const item of update) {
        const reqBody = {
          param_id: item.param_id,
          schedule_id: item.schedule_id,
          param_name: item.param_name,
          param_value: item.param_value,
          sequence_no: item.sequence_no,
          next_schedule_time: new Date(item.next_schedule_time),
          next_schedule_time_temp: new Date(),
          last_updated_by: item.last_updated_by,
        };
        const result = await updateParameterAPI(
          M_scdlUpdate_parameter_t(reqBody)
        );
        if (result?.outBinds?.param_id) {
          updatedParamIds.push(Number(result.outBinds.param_id));
        } else {
          console.warn(
            "Update parameter API did not return expected param_id structure for item:",
            item
          );
          throw new Error(
            `Update failed: Did not receive param_id for ${item.param_name}`
          );
        }
      }
      return updatedParamIds;
    } catch (error: any) {
      throw new Error(`Update parameters failed: ${error.message}`);
    }
  }

  async function deleteParameters(deleteIds: number[]): Promise<number[]> {
    const deletedParamIds: number[] = [];
    try {
      for (const paramId of deleteIds) {
        const result = await deleteParameterAPI(
          M_scdlDelete_parameter_t({ param_id: String(paramId) })
        );
        if (result?.outBinds?.param_id) {
          deletedParamIds.push(Number(result.outBinds.param_id));
        } else {
          console.warn(
            "Delete parameter API did not return expected param_id structure for ID:",
            paramId
          );
          throw new Error(
            `Delete failed: Did not receive confirmation for param_id ${paramId}`
          );
        }
      }
      return deletedParamIds;
    } catch (error: any) {
      throw new Error(`Delete parameters failed: ${error.message}`);
    }
  }
};

export const ScheduleParameterController = {
  readScheduler,
  createSchedule,
  deleteSchedule,
  updateSchedule,
  readParameter,
  // updateParameter,
  createParameter,
  deleteParameter,
  createScheduleParameter,
  updateCustomParameter,
};