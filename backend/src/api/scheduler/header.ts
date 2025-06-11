import { fs_node_scheduler } from "../../bundle/db-package";
import { I_singleCursorResp } from "../../interfaces";
import {
  buildDynamicQuery,
  resultSetExecute,
  simpleExecutePlSql,
  simpleExecutePlSqls,
} from "../../services/database";
import { T_GetScheduleReq, T_Import_Schedule_t, T_schedule_parameter_binds_t } from "../../types";
import { ApiResponse, SearchParams } from "../../types/ApiResponse";
import { T_ScdlHdrRes } from "../../types/schedule/header";
import {
  T_scdlErr_t,
  T_scdlList_t,
  T_scdl_parameter_t,
  T_scdl_t,
  T_scdlDelete_t,
  T_scdlDelete_parameter_t,
  T_setupDetails,
  T_updateDetail,
  T_createDetails,
  T_createUsers,
  T_scheduleDeleteUsers,
  T_loginUsersPayload,
  T_Importscdl_parameter_t,
  T_deleteLog_t,
  T_schedule_status,
  T_schedule_error_logs_bind_t,
  T_parameter_t,
} from "../../types/schedule/lines";
import oracledb, { Connection } from "oracledb";



export const readScdlHdr = async (
  binds: T_GetScheduleReq
): Promise<I_singleCursorResp<T_ScdlHdrRes>> => {
  return resultSetExecute(fs_node_scheduler.get_schedule, binds);
};

export const readQuery = async (query: string): Promise<any> => {
  return simpleExecutePlSql(query);
};

// export const readSchedulerAPI = async (): Promise<any> => {
//   return simpleExecutePlSql(fs_node_scheduler.schedule_t);
// };

export const readParameterAPI = async (binds: T_parameter_t): Promise<any> => {
  try {
    const response = simpleExecutePlSql(fs_node_scheduler.parameter_t, binds);
    return response;
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred" };
  }
};

export const readSchedulerAPI = async (
  searchParams: SearchParams
): Promise<ApiResponse> => {
  try {
    // 🔹 Build Queries
    const { sql, binds, countSql } = buildDynamicQuery(
      fs_node_scheduler.schedule_new_single_t,
      searchParams
    );
    // console.log("SQL QUERY: ", sql);
    // console.log("BINDS: ", binds);
    // console.log("COUNT QUERY: ", countSql);
    const { limit, offset, ...filteredParams } = binds;

    // const formattedBindsSql = generateBindParams(binds);

    // 🔹 Execute Queries in Parallel
    const result = await simpleExecutePlSql(sql, binds);
    const countResult = await simpleExecutePlSql(countSql, filteredParams);

    // console.log("QUERY RESULT: ", result.rows);
    // console.log("COUNT RESULT: ", countResult.rows);

    //🔹 Compute Pagination
    const totalCount = countResult?.rows?.[0]?.TOTAL ?? 0;
    const T_limit = Number(searchParams.limit) || 1;
    const totalPages = Math.ceil(totalCount / T_limit);

    // console.log("totalCount: ", totalCount);
    // console.log("T_limit: ", T_limit);
    // console.log("totalPages: ", totalPages);

    // // 🔹 Return Standardized Response
    return {
      success: true,
      data: result.rows ?? [],
      pageCount: searchParams.limit ? (result.rows ?? []).length : totalCount,
      totalPages,
    };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred" };
  }
};

// export const readListAPI = async (binds: T_scdlList_t): Promise<any> => {
//   return simpleExecutePlSql(fs_node_scheduler.schedule_list_t, binds);
// };


//build normal dynamic query
export const readListAPI = async (
  searchParams: SearchParams
): Promise<ApiResponse> => {
  try {
    // 🔹 Build Queries
    let { sql, binds, countSql } = buildDynamicQuery(
      fs_node_scheduler.schedule_logs_t,
      searchParams
    );
 
    sql = sql.replace("ORDER BY SCHEDULE_LIST_ID ASC", "ORDER BY CREATION_DATE DESC");
    if (searchParams.customWhere && Object.keys(searchParams.customWhere).length > 0) {
      sql = sql
        .replace("schedule_id = :custom_0", "schedule_id = NVL(:custom_0, schedule_id)")
        .replace("no_of_days = :custom_1", "last_update_date > TRUNC(SYSDATE - :custom_1)");

      countSql = countSql
        .replace("schedule_id = :custom_0", "schedule_id = NVL(:custom_0, schedule_id)")
        .replace("no_of_days = :custom_1", "last_update_date > TRUNC(SYSDATE - :custom_1)");
}

    const { limit, offset, ...filteredParams } = binds;

    // const formattedBindsSql = generateBindParams(binds);
    // 🔹 Execute Queries in Parallel
    const result = await simpleExecutePlSql(sql, binds);
    const countResult = await simpleExecutePlSql(countSql, filteredParams);

    //🔹 Compute Pagination
    const totalCount = countResult?.rows?.[0]?.TOTAL ?? 0;
    const T_limit = Number(searchParams.limit) || 1;
    const totalPages = Math.ceil(totalCount / T_limit);

    // 🔹 Return Standardized Response
    return {
      success: true,
      data: result.rows ?? [],
      pageCount: result.rows?.length ?? 0,
      totalPages,
    };

  } catch (error: any) {
    return { success: false, message: error.message ?? "An error occurred" };
    return { success: false, message: error.message ?? "An error occurred" };
  }
};

//ERROR DYNAMIC QUERY
export const getErrorLogsAPI = async (
  searchParams: SearchParams
): Promise<ApiResponse> => {
  try {
    // 🔹 Build Queries
    let { sql, binds, countSql } = buildDynamicQuery(
      fs_node_scheduler.schedule_error_logs_t,
      searchParams
    );

    const { limit, offset, ...filteredParams } = binds;

    // const formattedBindsSql = generateBindParams(binds);
    countSql = countSql.replace("FROM undefined", "FROM FS_SCHEDULE_ERR_LOG_T");
    // 🔹 Execute Queries in Parallel
    const result = await simpleExecutePlSql(sql, binds);
    const countResult = await simpleExecutePlSql(countSql, filteredParams);

    //🔹 Compute Pagination
    const totalCount = countResult?.rows?.[0]?.TOTAL ?? 0;
    const T_limit = Number(searchParams.limit) || 1;
    const totalPages = Math.ceil(totalCount / T_limit);

    // 🔹 Return Standardized Response
    return {
      success: true,
      data: result.rows ?? [],
      pageCount: searchParams.limit ? (result.rows ?? []).length : totalCount,
      totalPages,
    };
  } catch (error: any) {
    return { success: false, message: error.message ?? "An error occurred" };
  }
};

export const readErrorAPI = async (binds: T_scdlErr_t): Promise<any> => {
  return simpleExecutePlSql(fs_node_scheduler.schedule_error_log_t, binds);
};

// export const rreadScheduleNameAPI = async (): Promise<any> => {
//   return simpleExecutePlSql(fs_node_scheduler.schedule_names);
// };

export const readScheduleNameAPI = async (): Promise<any> => {
  try{
    const result = await simpleExecutePlSql(fs_node_scheduler.schedule_names);
   return {
      success: true,
      data: result.rows ?? [],
    };
  } catch (error: any) {
    return { success: false, message: error.message ?? "An error occurred" };
  }
};

export const readTableNameAPI = async (): Promise<any> => {
  return simpleExecutePlSql(fs_node_scheduler.table_names);
};

export const createScheduleAPI = async (binds: T_scdl_t): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.create_schedule_t, binds, opts);
};

export const createParameterAPI = async (
  binds: T_scdl_parameter_t,
  conn?: Connection
): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(
    fs_node_scheduler.create_schedule_parameter_t,
    binds,
    opts,
    conn
  );
};



// export const createParametersAPI = async (
//   parameters: T_scdl_parameter_t[]
// ): Promise<any> => {
//   let opts = { autoCommit: true };

//   const binds = parameters.map((param) => ({
//     schedule_id: param.schedule_id,
//     param_name: param.param_name,
//     param_value: param.param_value,
//     sequence_no: param.sequence_no,
//     next_schedule_time: param.next_schedule_time,
//     next_schedule_time_temp: param.next_schedule_time_temp || null,
//     created_by: param.created_by,
//     last_updated_by: param.last_updated_by,
//     param_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, 
//   }));
//   console.log("binds backend parameter create", binds);

//   return simpleExecutePlSqlMany(fs_node_scheduler.create_schedule_parameters_bulk, binds, opts);
// };



export const deleteScheduleAPI = async (
  binds: T_scdlDelete_t
): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.delete_schedule_t, binds, opts);
};

export const deleteParameterAPI = async (
  binds: T_scdlDelete_parameter_t,
  conn?: Connection
): Promise<any> => {
  let opts = { autoCommit: true };
  //check if the parameter exists
  return simpleExecutePlSql(
    fs_node_scheduler.delete_schedule_parameter_t,
    binds,
    opts,
    conn
  );
};

export const updateScheduleAPI = async (binds: T_scdl_t): Promise<any> => {
  console.log("updateScheduleAPI binds", binds);
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.update_schedule_t, binds, opts);
};


type ScheduleParameter = {
  SCHEDULE_ID: string;
  PARAM_NAME: string;
  PARAM_VALUE: string;
  SEQUENCE_NO: number;
  NEXT_SCHEDULE_TIME: string;
};

type UpdateScheduleParameter = ScheduleParameter & {
  PARAM_ID: string;
};

type DeletedScheduleIds = string[];

export type ScheduleActionPayload = {
  create: ScheduleParameter[];
  update: UpdateScheduleParameter[];
  delete: DeletedScheduleIds[];
};

export const updateCustomParameterAPI = async (
  schedule_id: number,
  data: ScheduleActionPayload
) => {

};
export const updateParameterAPI = async (
  binds: T_scdl_parameter_t,
  conn?: Connection
): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(
    fs_node_scheduler.update_schedule_parameter_t,
    binds,
    opts,
    conn
  );
};

export const getDetailsAPI = async (binds: T_setupDetails): Promise<any> => {
  return simpleExecutePlSql(fs_node_scheduler.setup_details_t, binds);
};

export const getScheduleStatusAPI = async (
  binds: T_schedule_status
): Promise<any> => {
  return simpleExecutePlSql(fs_node_scheduler.schedule_status_t, binds);
};




export const updateDetailsAPI = async (binds: T_updateDetail): Promise<any> => {
  console.log("updateDetailsAPI binds", binds);
  let opts = { autoCommit: true };
  return simpleExecutePlSql(
    fs_node_scheduler.update_setup_detail_t,
    binds,
    opts
  );
};

export const createDetailsAPI = async (
  binds: T_createDetails
): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.create_details_t, binds, opts);
};

export const createUsersAPI = async (binds: T_createUsers): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.create_users, binds, opts);
};

export const getUserAPI = async (
  binds: T_scheduleDeleteUsers
): Promise<any> => {
  return simpleExecutePlSql(fs_node_scheduler.get_user, binds);
};

export const getUsersAPI = async (
  searchParams: SearchParams 
):Promise<ApiResponse>=>{
  try {
    let { sql, binds, countSql } = buildDynamicQuery(
      fs_node_scheduler.get_users,
      searchParams
    );

    if (!countSql.includes('FROM FS_SCHEDULE_USERS')) {
      countSql = countSql.replace('FROM undefined', 'FROM FS_SCHEDULE_USERS');
    }
    const { limit, offset, ...filteredParams } = binds;

    const result = await simpleExecutePlSql(sql, binds);
    const countResult = await simpleExecutePlSql(countSql, filteredParams);
    const totalCount = countResult?.rows?.[0]?.TOTAL ?? 0;
    const T_limit = Number(searchParams.limit) || 1; 
    const totalPages = Math.ceil(totalCount / T_limit);
    console.log("SQL QUERY: ", sql);
    console.log("BINDS: ", binds);
    console.log("COUNT QUERY: ", countSql);
    return {
      success: true,
      data: result.rows ?? [],
      pageCount: searchParams.limit ? (result.rows ?? []).length : totalCount,
      totalPages,
    };
  } catch (error: any) {
    return { success: false, message: error.message || "An error occurred" };
  }
};

export const updateUsersAPI = async (binds: T_createUsers): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.update_users, binds, opts);
};

export const deleteUsersAPI = async (
  binds: T_scheduleDeleteUsers
): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.delete_users, binds, opts);
};

export const loginAPI = async (binds: T_loginUsersPayload): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.login_users, binds, opts);
};

export const getScdlStatus = async (): Promise<any> => {
  return simpleExecutePlSql(fs_node_scheduler.get_status);
};

export const importSchedulesAPI = async (
  binds: T_scdl_t,
  opts: any,
  conn: any
): Promise<any> => {
  let query = `Insert INTO fs_schedule_t (schedule_id, schedule_name,frequency_min, bi_report_path, bi_report_name,created_by,creation_date,last_updated_by,last_update_date,last_update_login,status,reset_data,db_table_name,db_column_names,operation,package_to_run_after_process,run_package_at_last_seq) VALUES (fs_schedule_s.nextval, :schedule_name, :frequency_min, :bi_report_path, :bi_report_name, :created_by, sysdate, :last_updated_by, sysdate, :last_update_login, :status, :reset_data, :db_table_name, :db_column_names, :operation, :package_to_run_after_process, :run_package_at_last_seq) returning schedule_id into :schedule_id`;
  return simpleExecutePlSqls(query, binds, opts, conn);
};

export const importParametersAPI = async (
  binds: T_Importscdl_parameter_t,
  opts: any,
  conn: any
): Promise<any> => {
  let query = `Insert INTO fs_schedule_parameters_t (param_id, schedule_id,param_name, param_value, sequence_no, next_schedule_time, next_schedule_time_temp,created_by, creation_date, last_updated_by, last_update_date) values (FS_SCHEDULE_PARAMETERS_seq.nextval, :schedule_id, :param_name, :param_value, :sequence_no, to_timestamp(to_char(TO_DATE(Translate(SUBSTR (:next_schedule_time , 1, 19),'T',' '),'YYYY-MM-DD HH24:MI:SS'),'DD-MON-YY HH24:mm:ss'),'DD-Mon-RR HH24:MI:SS'), to_timestamp(to_char(TO_DATE(Translate(SUBSTR (:next_schedule_time_temp , 1, 19),'T',' '),'YYYY-MM-DD HH24:MI:SS'),'DD-MON-YY HH24:mm:ss'),'DD-Mon-RR HH24:MI:SS'), :created_by, sysdate, :last_updated_by, sysdate) returning param_id into :param_id`;
  return simpleExecutePlSqls(query, binds, opts, conn);
};

export const deleteLogAPI = async (binds: T_deleteLog_t): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.delete_log_t, binds, opts);
};

export const createScheduleParameterAPI = async (binds: T_schedule_parameter_binds_t): Promise<any> => {
  let opts = { autoCommit: true };
  return simpleExecutePlSql(fs_node_scheduler.create_schedule_parameter_new_t, binds, opts);
};