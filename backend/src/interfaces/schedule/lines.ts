import { I_TabStruct } from "..";

export interface I_ScdlLinesRes {
  SCHEDULE_LIST_ID: number;
  SCHEDULE_ID: number;
  SCHEDULE_NAME: string;
  BI_REPORT_PATH: string;
  BI_REPORT_NAME: string;
  LAST_REFRESH_TIME: Date;
  SCHEDULE_STATUS: string;
  ERROR_MESSAGE: string;
  CREATED_BY: string;
  CREATION_DATE: Date;
  LAST_UPDATED_BY: string;
  LAST_UPDATE_DATE: Date;
  LAST_UPDATE_LOGIN: string;
}

export interface I_InsScdlLineRes {
  schedule_list: I_ScdlLinesRes[];
  table_structure: [I_TabStruct];
  err_code: string;
  err_msg: string;
}

export interface I_ScdParamsRes {
  params_count: number;
  params: I_ParamsRes[];
  already_running: number;
  err_code: string;
  err_msg: string;
}

export interface I_ParamsRes {
  PARAM_ID: number;
  SCHEDULE_ID: number;
  PARAM_NAME: string;
  PARAM_VALUE: string;
  SEQUENCE_NO: number;
}

export interface I_scdlList_t {
  schedule_list_id: number; 
	schedule_id: number; 
	param_sequence_no: number;
	schedule_name: string; 
	bi_report_path: string; 
	bi_report_name: string;  
	last_refresh_time: Date; 
	schedule_status: string; 
	error_message: string; 
	report_record_count: number;
	created_by: string; 
	creation_date: Date; 
	last_updated_by: string; 
	last_update_date: Date;
	last_update_login: string;
};

export interface I_scdlErr_t {
  schedule_list_id: number; 
	schedule_id: number; 
	param_sequence_no: number;
	schedule_name: string; 
	bi_report_path: string; 
	bi_report_name: string;  
	last_refresh_time: Date; 
	schedule_status: string; 
	error_message: string; 
	report_record_count: number;
	created_by: string; 
	creation_date: Date; 
	last_updated_by: string; 
	last_update_date: Date;
	last_update_login: string;
};

export interface I_scdlErr_t {
  ERR_ID: number; 
	TABLE_NAME: string; 
	MERGE_QUERY: string; 
	ERR_CODE: string; 
	ERR_MSG: string; 
	CREATION_DATE: Date;
};