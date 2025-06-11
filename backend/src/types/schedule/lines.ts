import { BindParameter } from 'oracledb';

export type T_InsScdlLineReq = {
  schedule_id: BindParameter;
  table_name: BindParameter;
  seq_no: BindParameter;
  table_structure: BindParameter;
  schedule_list: BindParameter;
  err_code: BindParameter;
  err_msg: BindParameter;
};

export type T_UpdScdlLineReq_status = {
  seq_no: BindParameter;
  last_seq: BindParameter;
  record_count: BindParameter;
  schdl_list_id: BindParameter;
  status: BindParameter;
  err_msg: BindParameter;
  err_status: BindParameter;
};

export type T_ResetLineReq_status = {
  err_code: BindParameter;
  err_msg: BindParameter;
};

export type T_ScdParamsReq = {
  schedule_id: BindParameter;
  params_count: BindParameter;
  params: BindParameter;
  err_code: BindParameter;
  err_msg: BindParameter;
  already_running: BindParameter;
};

export type T_scdlList_t = {
  schedule_id: BindParameter;
  no_of_days: BindParameter;
};

export type T_parameter_t = {
  schedule_id: BindParameter;
}

export type T_scdlErr_t = {
  table_name: BindParameter;
  no_of_days: BindParameter;
};

export type T_scdl_t = {
  schedule_id: BindParameter;
  schedule_name: BindParameter;
  frequency_min: BindParameter;
  bi_report_path: BindParameter;
  bi_report_name: BindParameter;
  created_by: BindParameter;
  last_updated_by: BindParameter;
  last_update_login: BindParameter;
  status: BindParameter;
  reset_data: BindParameter;
  db_table_name: BindParameter;
  db_column_names: BindParameter;
  operation: BindParameter;
  package_to_run_after_process: BindParameter;
  run_package_at_last_seq: BindParameter;
};

export type T_scdl_parameter_t = {
  param_id: BindParameter;
  schedule_id: BindParameter;
  param_name: BindParameter;
  param_value: BindParameter;
  sequence_no: BindParameter;
  next_schedule_time: BindParameter;
  next_schedule_time_temp: BindParameter;
  created_by?: BindParameter;
  last_updated_by: BindParameter;
};

export type T_scdlDelete_t = {
  schedule_id: BindParameter;
};

export type T_scdlDelete_parameter_t = {
  param_id: BindParameter;
};

export type T_setupDetails = {
  setup_id: BindParameter;
};

export type T_updateDetail = {
  setup_id: BindParameter;
  fusion_domain: BindParameter;
  fusion_username: BindParameter;
  fusion_password: BindParameter;
  mail_notification: BindParameter;
};

export type T_createDetails = {
  setup_id: BindParameter;
  fusion_domain: BindParameter;
  fusion_username: BindParameter;
  fusion_password: BindParameter;
  mail_notification: BindParameter;
};

export type T_createUsers = {
  user_id: BindParameter;
	user_name: BindParameter;
	password: BindParameter;
	role: BindParameter;
	created_by: BindParameter;
	last_updated_by: BindParameter;
};

export type T_scheduleDeleteUsers = {
  user_id: BindParameter;
};

export type T_loginUsersPayload = {
	user_name: BindParameter;
	password: BindParameter;
};


export type T_Importscdl_parameter_t = {
  param_id: BindParameter;
  schedule_id: BindParameter;
  param_name: BindParameter;
  param_value: BindParameter;
  sequence_no: BindParameter;
  created_by: BindParameter;
  last_updated_by: BindParameter;
  next_schedule_time: BindParameter;
  next_schedule_time_temp: BindParameter;
};

export type T_deleteLog_t = {
  no_of_weeks: BindParameter;
};

export type T_schedule_status = {
  schedule_id: BindParameter;
};

export type T_schedule_error_logs_bind_t ={
  schedule_list_id: BindParameter;
}