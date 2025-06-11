import { BindParameter } from "oracledb";

export type T_GetScheduleReq = {
  cursor: BindParameter;
  domain: BindParameter;
  username: BindParameter;
  password: BindParameter;
  err_code: BindParameter;
  err_msg: BindParameter;
};

export type T_GetScheduler = {
  param_id: BindParameter;
  sequence_no: BindParameter;
};

export type T_GetTableColumnsReq = {
  table_name: BindParameter;
  cursor: BindParameter;
  err_code: BindParameter;
  err_msg: BindParameter;
};

export type T_ExeMrgQryReq = {
	table_name: BindParameter;
	query: BindParameter;
	schedule_id: BindParameter;
	schdl_list_id: BindParameter;
	err_code: BindParameter;
	err_msg: BindParameter;
	err_status: BindParameter;
  };
  
  export type T_ExeMrgQryBlobReq = {
	table_name: BindParameter;
	query: BindParameter;
	schedule_id: BindParameter;
	schdl_list_id: BindParameter;
	err_code: BindParameter;
	err_msg: BindParameter;
	err_status: BindParameter;
  };

export type T_ExeMrgQryRes = {
  table_name: string;
  query: string;
  err_code: string | null;
  err_msg: string | null;
};

 export type T_scdlListPayload = {
	schedule_id: number; 
  no_of_days: number;
};

 export type T_scdlErrPayload = {
	table_name: string; 
  	no_of_days: number;
};

export type T_scdl_t_Payload = {
  schedule_id: number;
	schedule_name: string; 
	frequency_min: number; 
	bi_report_path: string;
	bi_report_name: string;  
	created_by: string; 
	last_updated_by: string;  
	last_update_login: string; 
	status: string; 
	reset_data: string;
	db_table_name: string; 
	db_column_names: string;
	operation: string;
	package_to_run_after_process: string;
	run_package_at_last_seq: string;
};

export type T_scdl_parameter_t_Payload = {
		param_id?: number;
		schedule_id: number;
		param_name: string;
		param_value: string;
		sequence_no: number; 
		next_schedule_time: Date;
	next_schedule_time_temp: Date;
		created_by?: string;
		last_updated_by: string; 
};

export type T_scdlDelete_Payload = {
	schedule_id: string;
};

export type T_scdlDelete_parameter_Payload = {
	param_id: string;
};

export type T_scdlUpdate_Payload = {
	schedule_id: string;
};
 
export type T_scdlUpdate_parameter_Payload = {
		param_id: string;
};

export type T_updateSchedule_t = {
	schedule_id: number; 
	schedule_name: string; 
	frequency_min: number; 
	bi_report_path: string;
	bi_report_name: string;  
	created_by: string; 
	last_updated_by: string;  
	last_update_login: string; 
	status: string; 
	reset_data: string;
	db_table_name: string; 
	db_column_names: string;
	operation: string;
	package_to_run_after_process: string;
	run_package_at_last_seq: string;
	ciphertext: string;
	iv: string;
}

export type T_updateSchedule_parameter_t = {
	param_id?: number;
		schedule_id: number;
		param_name: string;
		param_value: string;
		sequence_no: number; 
		next_schedule_time: Date;
		next_schedule_time_temp: Date | null;
		created_by?: string;  
		last_updated_by: string; 
};

export type T_setupDetailPayload = {
	setup_id: string;
};

export type T_schedule_status_Payload = {
  schedule_id: string;
};


export type T_updateDetailPayload ={
	setup_id: string;
};

export type T_updateDetails_t ={
	setup_id: number;
	fusion_domain: string;
	fusion_username: string;
	fusion_password: string;
	mail_notification: string;
	ciphertext: string;
	iv: string;
};

export type T_setupDetails_t = {
	setup_id: number;
	fusion_domain: string;
	fusion_username: string;
	fusion_password: string;
	mail_notification: string;
	ciphertext: string;
	iv: string;
};

export type T_ScheduleUsers_t = {
	user_id: number;
	user_name: string;
	password: string;
	role: string;
	created_by: string;
	creation_date: Date;
	last_updated_by: string;
	last_update_date: Date;
};

export type SearchParams = {
	searchColumns?: string[];
	searchTerm?: string;
	sortColumn?: string;
	sortOrder?: "ASC" | "DESC";
	limit?: number;
	offset?: number;
	primaryKey?: string;
  };

  export type T_UpdateUsersPayload = {
	user_id: string;
  }
  export type T_ScheduleUsersPayload = {
	searchParams: SearchParams;
	searchTerm: string;
	user_id: string;
  };
export type T_ScheduleUsersUpdate = {
	user_id: string;
	user_name: string;
	password: string;
	role: string;
	created_by: string;
	creation_date: Date;
	last_updated_by: string;
	last_update_date: Date;
};

export type T_ScheduleUsersDelete = {
	user_id: string;
};

export type T_loginUser = {
	user_name: string;
	password: string;
};

export type T_Import_Schedule_t = {
Schedules: [
    {
      SCHEDULE_ID: number,
      SCHEDULE_NAME: string,
      BI_REPORT_NAME: string,
      BI_REPORT_PATH: string,
      CREATED_BY: string,
      CREATION_DATE: string,
      DB_COLUMN_NAMES: string,
      DB_TABLE_NAME: string,
      FREQUENCY_MIN: number,
      LAST_UPDATED_BY: string,
      LAST_UPDATE_DATE: string,
      OPERATION: string,
      PACKAGE_TO_RUN_AFTER_PROCESS: string,
      RESET_DATA: string,
      RUN_PACKAGE_AT_LAST_SEQ: string,
      STATUS: string,
    }
  ],
};

export type T_Import_Parameter_t = {
	Parameters: [
    {
      PARAM_ID: number,
      PARAM_NAME: string,
      PARAM_VALUE: string,
      SCHEDULE_ID: number,
      SEQUENCE_NO: number,
      CREATED_BY: string,
      CREATION_DATE: string,
      LAST_UPDATED_BY: string,
      LAST_UPDATE_DATE: string,
      NEXT_SCHEDULE_TIME: string,
      NEXT_SCHEDULE_TIME_TEMP: string,
    }
  ],
};

export type T_deleteLogPayload = {
	 no_of_weeks: string;
};

export type T_SCHEDULE_ERROR_LOGS_T = {
	schedule_list_id: string;
}

export type T_Scheduleparameter_t = {
	schedule_id: number;
	schedule_name: string;
	frequency_min: number;
	bi_report_path: string;
	bi_report_name: string;
	status: string;
	reset_data: string;
	db_table_name: string;
	db_column_names: string;
	operation: string;
	package_to_run_after_process: string;
	run_package_at_last_seq: string;
	param_name: string;
	param_value?: string;
	sequence_no: number;
	next_schedule_time: Date;
	next_schedule_time_temp: Date;
	ciphertext: string;
	iv: string;
  };
  
  export type T_schedule_parameter_binds_t = {
	schedule_id: BindParameter;
	schedule_name: BindParameter;
	frequency_min: BindParameter;
	bi_report_path: BindParameter;
	bi_report_name: BindParameter;
	status: BindParameter;
	reset_data: BindParameter;
	db_table_name: BindParameter;
	db_column_names: BindParameter;
	operation: BindParameter;
	package_to_run_after_process: BindParameter;
	run_package_at_last_seq: BindParameter;
	param_name: BindParameter;
	param_value: BindParameter;
	sequence_no: BindParameter;
	next_schedule_time: BindParameter;
	next_schedule_time_temp: BindParameter;
  };