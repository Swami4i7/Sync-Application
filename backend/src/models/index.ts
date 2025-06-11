import oracledb from 'oracledb';
import {
  BIND_IN,
  BIND_INOUT,
  BIND_OUT,
  CURSOR,
  DATE,
  ExecuteManyOptions,
  NUMBER,
  STRING,
} from "oracledb";
import {
  T_deleteLogPayload,
  T_ExeMrgQryReq,
  T_GetScheduleReq,
  T_GetTableColumnsReq,
  T_Import_Schedule_t,
  T_loginUser,
  T_scdlDelete_parameter_Payload,
  T_scdlDelete_Payload,
  T_scdlErrPayload,
  T_scdlListPayload,
  T_scdlUpdate_parameter_Payload,
  T_scdlUpdate_Payload,
  T_scdl_parameter_t_Payload,
  T_ScheduleUsersPayload,
  T_ScheduleUsersUpdate,
  T_ScheduleUsers_t,
  T_setupDetails_t,
  T_updateDetailPayload,
  T_updateDetails_t,
  T_updateSchedule_parameter_t,
  T_updateSchedule_t,
  T_ExeMrgQryBlobReq,
  T_schedule_status_Payload,
  T_SCHEDULE_ERROR_LOGS_T,
  T_UpdateUsersPayload,
  T_Scheduleparameter_t,
  T_schedule_parameter_binds_t,
} from "../types";
import {
  T_createDetails,
  T_createUsers,
  T_deleteLog_t,
  T_Importscdl_parameter_t,
  T_loginUsersPayload,
  T_ResetLineReq_status,
  T_scdlDelete_parameter_t,
  T_scdlDelete_t,
  T_scdlErr_t,
  T_scdlList_t,
  T_scdl_parameter_t,
  T_scdl_t,
  T_scheduleDeleteUsers,
  T_setupDetails,
  T_updateDetail,
  T_schedule_status,
  T_schedule_error_logs_bind_t,
  T_parameter_t,
} from "../types/schedule/lines";
import {
  T_scdl_t_Payload,
  T_setupDetailPayload,
  T_ScheduleUsersDelete,
} from "../types/index";
import { ScheduleActionPayload } from '../api/scheduler/header';

export const M_GetSchedule = (): T_GetScheduleReq => {
  return {
    cursor: {
      dir: BIND_OUT,
      type: CURSOR,
    },
    domain: {
      dir: BIND_OUT,
      type: STRING,
    },
    username: {
      dir: BIND_OUT,
      type: STRING,
    },
    password: {
      dir: BIND_OUT,
      type: STRING,
    },
    err_code: {
      dir: BIND_OUT,
      type: STRING,
    },
    err_msg: {
      dir: BIND_OUT,
      type: STRING,
    },
  };
};

export const M_GetTableColumns = (table: string): T_GetTableColumnsReq => {
  const binds: T_GetTableColumnsReq = {
    table_name: {
      dir: BIND_IN,
      type: STRING,
      val: table,
    },
    cursor: {
      dir: BIND_OUT,
      type: CURSOR,
    },
    err_code: {
      dir: BIND_OUT,
      type: STRING,
    },
    err_msg: {
      dir: BIND_OUT,
      type: STRING,
    },
  };
  return binds;
};

export const M_ExeMrgQryOptions = (): ExecuteManyOptions => {
  const opts: Record<string, T_ExeMrgQryReq> = {
    bindDefs: {
      table_name: {
        dir: BIND_INOUT,
        type: STRING,
        maxSize: 2000,
      },
      query: {
        dir: BIND_INOUT,
        type: STRING,
        maxSize: 20000,
      },
      schedule_id: {
        dir: BIND_INOUT,
        type: NUMBER,
        maxSize: 20000,
      },
      schdl_list_id: {
        dir: BIND_INOUT,
        type: NUMBER,
        maxSize: 20000,
      },
      err_code: {
        dir: BIND_OUT,
        type: STRING,
        maxSize: 2000,
      },
      err_msg: {
        dir: BIND_OUT,
        type: STRING,
        maxSize: 2000,
      },
      err_status: {
        dir: BIND_OUT,
        type: STRING,
        maxSize: 2000,
      },
    },
  };
  return opts;
};

export const M_ExeMrgQryBlobOptions = (): ExecuteManyOptions => {
  const opts: Record<string, T_ExeMrgQryBlobReq> = {
    bindDefs: {
      table_name: {
        dir: BIND_INOUT,
        type: STRING,
        maxSize: 2000,
      },
      query: {
        dir: BIND_INOUT,
        type: STRING,
        maxSize: 20000,
      },
      schedule_id: {
        dir: BIND_INOUT,
        type: NUMBER,
        maxSize: 2000,
      },
      schdl_list_id: {
        dir: BIND_INOUT,
        type: NUMBER,
        maxSize: 20000,
      },
      err_code: {
        dir: BIND_OUT,
        type: STRING,
        maxSize: 2000,
      },
      err_msg: {
        dir: BIND_OUT,
        type: STRING,
        maxSize: 2000,
      },
      err_status: {
        dir: BIND_OUT,
        type: STRING,
        maxSize: 2000,
      },
    },
  };
  return opts;
};

export const M_ResetStatus = (): T_ResetLineReq_status => {
  return {
    err_code: {
      dir: BIND_OUT,
      type: STRING,
    },
    err_msg: {
      dir: BIND_OUT,
      type: STRING,
    },
  };
};

export const M_Parameter = (schedule_id:number)=> {
  let obj: T_parameter_t = {
    schedule_id: {
      val: schedule_id,
      dir: BIND_IN,
      type: NUMBER,
    },
  };
  return obj;
  
}

export const M_scdlList = (body: T_scdlListPayload): T_scdlList_t => {
  let obj: T_scdlList_t = {
    schedule_id: {
      val: body.schedule_id,
      dir: BIND_IN,
      type: NUMBER,
    },
    no_of_days: {
      val: body.no_of_days,
      dir: BIND_IN,
      type: NUMBER,
    },
  };
  return obj;
};

export const M_scdlErr = (body: T_scdlErrPayload): T_scdlErr_t => {
  const no_of_days = Number(body.no_of_days);
  let obj: T_scdlErr_t = {
    table_name: {
      val: body.table_name,
      dir: BIND_IN,
      type: STRING,
    },
    no_of_days: {
      val: no_of_days,
      dir: BIND_IN,
      type: NUMBER,
    },
  };
  return obj;
};

export const M_scdl_t = (body: T_scdl_t_Payload): T_scdl_t => {
  let obj: T_scdl_t = {
    schedule_id: {
      val: body.schedule_id,
      dir: BIND_OUT,
      type: NUMBER,
    },
    schedule_name: {
      val: body.schedule_name,
      dir: BIND_IN,
      type: STRING,
    },
    frequency_min: {
      val: body.frequency_min,
      dir: BIND_IN,
      type: NUMBER,
    },
    bi_report_path: {
      val: body.bi_report_path,
      dir: BIND_IN,
      type: STRING,
    },
    bi_report_name: {
      val: body.bi_report_name,
      dir: BIND_IN,
      type: STRING,
    },
    created_by: {
      val: body.created_by,
      dir: BIND_IN,
      type: STRING,
    },
    last_updated_by: {
      val: body.last_updated_by,
      dir: BIND_IN,
      type: STRING,
    },
    last_update_login: {
      val: body.last_update_login,
      dir: BIND_IN,
      type: STRING,
    },
    status: {
      val: body.status,
      dir: BIND_IN,
      type: STRING,
    },
    reset_data: {
      val: body.reset_data,
      dir: BIND_IN,
      type: STRING,
    },
    db_table_name: {
      val: body.db_table_name,
      dir: BIND_IN,
      type: STRING,
    },
    db_column_names: {
      val: body.db_column_names,
      dir: BIND_IN,
      type: STRING,
    },
    operation: {
      val: body.operation,
      dir: BIND_IN,
      type: STRING,
    },
    package_to_run_after_process: {
      val: body.package_to_run_after_process,
      dir: BIND_IN,
      type: STRING,
    },
    run_package_at_last_seq: {
      val: body.run_package_at_last_seq,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_scdl_parameter_t = (
  body: T_scdl_parameter_t_Payload
): T_scdl_parameter_t => {
  let obj: T_scdl_parameter_t = {
    param_id: {
      val: body.param_id,
      dir: BIND_OUT,
      type: NUMBER,
    },
    schedule_id: {
      val: body.schedule_id,
      dir: BIND_IN,
      type: NUMBER,
    },
    param_name: {
      val: body.param_name,
      dir: BIND_IN,
      type: STRING,
    },
    param_value: {
      val: body.param_value,
      dir: BIND_IN,
      type: STRING,
    },
    sequence_no: {
      val: body.sequence_no,
      dir: BIND_IN,
      type: NUMBER,
    },
    next_schedule_time: {
      val: body.next_schedule_time,
      dir: BIND_IN,
      type: DATE,
    },
    next_schedule_time_temp: {
      val: body.next_schedule_time_temp,
      dir: BIND_IN,
      type: DATE,
    },
    created_by: {
      val: body.created_by,
      dir: BIND_IN,
      type: STRING,
    },
    last_updated_by: {
      val: body.last_updated_by,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_scdlDelete_t = (
  body: T_scdlDelete_Payload
): T_scdlDelete_t => {
  let obj: T_scdlDelete_t = {
    schedule_id: {
      val: body.schedule_id,
      dir: BIND_INOUT,
      type: STRING,
    },
  };
  return obj;
};

export const M_scdlDelete_parameter_t = (
  body: T_scdlDelete_parameter_Payload
): T_scdlDelete_parameter_t => {
  let obj: T_scdlDelete_parameter_t = {
    param_id: {
      val: body.param_id,
      dir: BIND_INOUT,
      type: STRING,
    },
  };
  return obj;
};

export const M_scdlUpdate_t = (
  params: T_scdlUpdate_Payload,
  body: T_updateSchedule_t
): T_scdl_t => {
  let obj: T_scdl_t = {
    schedule_id: {
      val: params,
      dir: BIND_IN,
      type: STRING,
    },
    schedule_name: {
      val: body.schedule_name,
      dir: BIND_IN,
      type: STRING,
    },
    frequency_min: {
      val: body.frequency_min,
      dir: BIND_IN,
      type: NUMBER,
    },
    bi_report_path: {
      val: body.bi_report_path,
      dir: BIND_IN,
      type: STRING,
    },
    bi_report_name: {
      val: body.bi_report_name,
      dir: BIND_IN,
      type: STRING,
    },
    created_by: {
      val: body.created_by,
      dir: BIND_IN,
      type: STRING,
    },
    last_updated_by: {
      val: body.last_updated_by,
      dir: BIND_IN,
      type: STRING,
    },
    last_update_login: {
      val: body.last_update_login,
      dir: BIND_IN,
      type: STRING,
    },
    status: {
      val: body.status,
      dir: BIND_IN,
      type: STRING,
    },
    reset_data: {
      val: body.reset_data,
      dir: BIND_IN,
      type: STRING,
    },
    db_table_name: {
      val: body.db_table_name,
      dir: BIND_IN,
      type: STRING,
    },
    db_column_names: {
      val: body.db_column_names,
      dir: BIND_IN,
      type: STRING,
    },
    operation: {
      val: body.operation,
      dir: BIND_IN,
      type: STRING,
    },
    package_to_run_after_process: {
      val: body.package_to_run_after_process,
      dir: BIND_IN,
      type: STRING,
    },
    run_package_at_last_seq: {
      val: body.run_package_at_last_seq,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_ParameterNUpdate_t = (
  schedule_id: number,
  body: ScheduleActionPayload
) => {
  let obj = {};
};

// schedule_id:  5040
// data:  {
//   create: [
//     {
//       SCHEDULE_ID: 5040,
//       PARAM_NAME: 'Leigh Brock',
//       PARAM_VALUE: 'Laborum quos sit do',
//       SEQUENCE_NO: 3,
//       NEXT_SCHEDULE_TIME: '1973-07-14T15:17'
//     }
//   ],
//   update: [
//     {
//       PARAM_ID: 5,
//       SCHEDULE_ID: 5040,
//       PARAM_NAME: 'Parameter 6',
//       PARAM_VALUE: 'Value for Schedule 5040 - New Row 1a',
//       SEQUENCE_NO: 2,
//       NEXT_SCHEDULE_TIME: '2024-07-09T06:30'
//     }
//   ],
//   delete: [ 6 ]
// }

export const M_scdlUpdate_parameter_t = (
  body: T_updateSchedule_parameter_t
): T_scdl_parameter_t => {
  let obj: T_scdl_parameter_t = {
    param_id: {
      val: body.param_id,
      dir: BIND_INOUT,
      type: NUMBER,
    },
    schedule_id: {
      val: body.schedule_id,
      dir: BIND_IN,
      type: NUMBER,
    },
    param_name: {
      val: body.param_name,
      dir: BIND_IN,
      type: STRING,
    },
    param_value: {
      val: body.param_value,
      dir: BIND_IN,
      type: STRING,
    },
    sequence_no: {
      val: body.sequence_no,
      dir: BIND_IN,
      type: NUMBER,
    },
    next_schedule_time: {
      val: body.next_schedule_time,
      dir: BIND_IN,
      type: DATE,
    },
    next_schedule_time_temp: {
      val: body.next_schedule_time_temp,
      dir: BIND_IN,
      type: DATE,
    },
    last_updated_by: {
      val: body.last_updated_by,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_setup_details = (params: T_setupDetailPayload): T_setupDetails => {
  let obj: T_setupDetails = {
    setup_id: {
      val: params.setup_id,
      dir: BIND_IN,
      type:STRING,
    },
  };
  return obj;
};

export const M_schedule_status = (params: T_schedule_status_Payload): T_schedule_status => {
  let obj: T_schedule_status = {
    schedule_id: {
      val: params.schedule_id,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_schedule_error_logs = (params: T_SCHEDULE_ERROR_LOGS_T): T_schedule_error_logs_bind_t => {
  let obj: T_schedule_error_logs_bind_t = {
    schedule_list_id: {
      val: params.schedule_list_id,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_updateDetail_t = (
  params: T_updateDetailPayload,
  body: T_updateDetails_t
): T_updateDetail => {
  let obj: T_updateDetail = {
    setup_id: {
      val: params,
      dir: BIND_IN,
      type: STRING,
    },
    fusion_domain: {
      val: body.fusion_domain,
      dir: BIND_IN,
      type: STRING,
    },
    fusion_username: {
      val: body.fusion_username,
      dir: BIND_IN,
      type: STRING,
    },
    fusion_password: {
      val: body.fusion_password,
      dir: BIND_IN,
      type: STRING,
    },
    mail_notification: {
      val: body.mail_notification,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_create_details_t = (body: T_setupDetails_t): T_createDetails => {
  let obj: T_createDetails = {
    setup_id: {
      val: body.setup_id,
      dir: BIND_INOUT,
      type: NUMBER,
    },
    fusion_domain: {
      val: body.fusion_domain,
      dir: BIND_IN,
      type: STRING,
    },
    fusion_username: {
      val: body.fusion_username,
      dir: BIND_IN,
      type: STRING,
    },
    fusion_password: {
      val: body.fusion_password,
      dir: BIND_IN,
      type: STRING,
    },
    mail_notification: {
      val: body.mail_notification,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_create_users_t = (body: T_ScheduleUsers_t): T_createUsers => {
  let obj: T_createUsers = {
    user_id: {
      val: body.user_id,
      dir: BIND_OUT,
      type: NUMBER,
    },
    user_name: {
      val: body.user_name,
      dir: BIND_IN,
      type: STRING,
    },
    password: {
      val: body.password,
      dir: BIND_IN,
      type: STRING,
    },
    role: {
      val: body.role,
      dir: BIND_IN,
      type: STRING,
    },
    created_by: {
      val: body.created_by,
      dir: BIND_IN,
      type: STRING,
    },
    last_updated_by: {
      val: body.created_by,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_Get_Users = (
  body: T_ScheduleUsersPayload
) => {
  let obj: Record<string, any> = {
    user_id: {
      val: body.user_id,
      dir: BIND_IN,
      type: NUMBER,
    },
  };

  if (body.searchParams) {
    if (body.searchParams.searchColumns) {
      obj.searchColumns = {
        val: body.searchParams.searchColumns,
        dir: BIND_IN,
        type: STRING,
      };
    }
    if (body.searchParams.searchTerm) {
      obj.searchTerm = {
        val: body.searchParams.searchTerm,
        dir: BIND_IN,
        type: STRING,
      };
    }
    if (body.searchParams.sortColumn) {
      obj.sortColumn = {
        val: body.searchParams.sortColumn,
        dir: BIND_IN,
        type: STRING,
      };
    }
    if (body.searchParams.sortOrder) {
      obj.sortOrder = {
        val: body.searchParams.sortOrder,
        dir: BIND_IN,
        type: STRING,
      };
    }
    if (body.searchParams.limit) {
      obj.limit = {
        val: body.searchParams.limit,
        dir: BIND_IN,
        type: NUMBER,
      };
    }
    if (body.searchParams.offset) {
      obj.offset = {
        val: body.searchParams.offset,
        dir: BIND_IN,
        type: NUMBER,
      };
    }
    if (body.searchParams.primaryKey) {
      obj.primaryKey = {
        val: body.searchParams.primaryKey,
        dir: BIND_IN,
        type: STRING,
      };
    }
  }

  return obj;
};


export const M_updateUsers_t = (
  params: T_UpdateUsersPayload,
  body: T_ScheduleUsersUpdate
): T_createUsers => {
  let obj: T_createUsers = {
    user_id: {
      val: params,
      dir: BIND_INOUT,
      type: STRING,
    },
    user_name: {
      val: body.user_name,
      dir: BIND_IN,
      type: STRING,
    },
    password: {
      val: body.password,
      dir: BIND_IN,
      type: STRING,
    },
    role: {
      val: body.role,
      dir: BIND_IN,
      type: STRING,
    },
    created_by: {
      val: body.created_by,
      dir: BIND_IN,
      type: STRING,
    },
    last_updated_by: {
      val: body.created_by,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_Delete_Users = (
  body: T_ScheduleUsersDelete
): T_scheduleDeleteUsers => {
  let obj: T_scheduleDeleteUsers = {
    user_id: {
      val: body.user_id,
      dir: BIND_INOUT,
      type: STRING,
    },
  };
  return obj;
};

export const M_login_users_t = (body: T_loginUser): T_loginUsersPayload => {
  let obj: T_loginUsersPayload = {
    user_name: {
      val: body.user_name,
      dir: BIND_IN,
      type: STRING,
    },
    password: {
      val: body.password,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_Import_scdl_t = (body: any): T_scdl_t => {
  let obj: T_scdl_t = {
    schedule_id: {
      val: body.SCHEDULE_ID,
      dir: BIND_OUT,
      type: NUMBER,
    },
    schedule_name: {
      val: body.SCHEDULE_NAME,
      dir: BIND_IN,
      type: STRING,
    },
    frequency_min: {
      val: body.FREQUENCY_MIN,
      dir: BIND_IN,
      type: NUMBER,
    },
    bi_report_path: {
      val: body.BI_REPORT_PATH,
      dir: BIND_IN,
      type: STRING,
    },
    bi_report_name: {
      val: body.BI_REPORT_NAME,
      dir: BIND_IN,
      type: STRING,
    },
    created_by: {
      val: body.CREATED_BY,
      dir: BIND_IN,
      type: STRING,
    },
    last_updated_by: {
      val: body.LAST_UPDATED_BY,
      dir: BIND_IN,
      type: STRING,
    },
    last_update_login: {
      val: body.LAST_UPDATE_DATE,
      dir: BIND_IN,
      type: STRING,
    },
    status: {
      val: body.STATUS,
      dir: BIND_IN,
      type: STRING,
    },
    reset_data: {
      val: body.RESET_DATA,
      dir: BIND_IN,
      type: STRING,
    },
    db_table_name: {
      val: body.DB_TABLE_NAME,
      dir: BIND_IN,
      type: STRING,
    },
    db_column_names: {
      val: body.DB_COLUMN_NAMES,
      dir: BIND_IN,
      type: STRING,
    },
    operation: {
      val: body.OPERATION,
      dir: BIND_IN,
      type: STRING,
    },
    package_to_run_after_process: {
      val: body.PACKAGE_TO_RUN_AFTER_PROCESS,
      dir: BIND_IN,
      type: STRING,
    },
    run_package_at_last_seq: {
      val: body.RUN_PACKAGE_AT_LAST_SEQ,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_Import_scdl_parameter_t = (
  body: any
): T_Importscdl_parameter_t => {
  let obj: T_Importscdl_parameter_t = {
    param_id: {
      val: body.PARAM_ID,
      dir: BIND_OUT,
      type: NUMBER,
    },
    schedule_id: {
      val: body.SCHEDULE_ID,
      dir: BIND_IN,
      type: NUMBER,
    },
    param_name: {
      val: body.PARAM_NAME,
      dir: BIND_IN,
      type: STRING,
    },
    param_value: {
      val: body.PARAM_VALUE,
      dir: BIND_IN,
      type: STRING,
    },
    sequence_no: {
      val: body.SEQUENCE_NO,
      dir: BIND_IN,
      type: NUMBER,
    },
    created_by: {
      val: body.CREATED_BY,
      dir: BIND_IN,
      type: STRING,
    },
    last_updated_by: {
      val: body.LAST_UPDATED_BY,
      dir: BIND_IN,
      type: STRING,
    },
    next_schedule_time: {
      val: body.NEXT_SCHEDULE_TIME,
      dir: BIND_IN,
      type: STRING,
    },
    next_schedule_time_temp: {
      val: body.NEXT_SCHEDULE_TIME_TEMP,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_DeleteLog = (body: T_deleteLogPayload): T_deleteLog_t => {
  let obj: T_deleteLog_t = {
    no_of_weeks: {
      val: body.no_of_weeks,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};

export const M_create_schedule_parameters_t = (body: T_Scheduleparameter_t): T_schedule_parameter_binds_t => {
  let obj: T_schedule_parameter_binds_t = {
    schedule_id: {
      val: body.schedule_id,
      dir: BIND_OUT,
      type: NUMBER,
    },
    schedule_name: {
      val: body.schedule_name,
      dir: BIND_IN,
      type: STRING,
    },
    frequency_min: {
      val: body.frequency_min,
      dir: BIND_IN,
      type: NUMBER,
    },
    bi_report_path: {
      val: body.bi_report_path,
      dir: BIND_IN,
      type: STRING,
    },
    bi_report_name: {
      val: body.bi_report_name,
      dir: BIND_IN,
      type: STRING,
    },
    status: {
      val: body.status,
      dir: BIND_IN,
      type: STRING,
    },
    reset_data: {
      val: body.reset_data,
      dir: BIND_IN,
      type: STRING,
    },
    db_table_name: {
      val: body.db_table_name,
      dir: BIND_IN,
      type: STRING,
    },
    db_column_names: {
      val: body.db_column_names,
      dir: BIND_IN,
      type: STRING,
    },
    operation: {
      val: body.operation,
      dir: BIND_IN,
      type: STRING,
    },
    package_to_run_after_process: {
      val: body.package_to_run_after_process,
      dir: BIND_IN,
      type: STRING,
    },
    run_package_at_last_seq: {
      val: body.run_package_at_last_seq,
      dir: BIND_IN,
      type: STRING,
    },
    param_name: {
      val: body.param_name,
      dir: BIND_IN,
      type: STRING,
    },
    param_value: {
      val: body.param_value,
      dir: BIND_IN,
      type: STRING,
    },
    sequence_no: {
      val: body.sequence_no,
      dir: BIND_IN,
      type: NUMBER,
    },
    next_schedule_time: {
      val: body.next_schedule_time,
      dir: BIND_IN,
      type: STRING,
    },
    next_schedule_time_temp: {
      val: body.next_schedule_time_temp,
      dir: BIND_IN,
      type: STRING,
    },
  };
  return obj;
};