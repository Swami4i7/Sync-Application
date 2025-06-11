export type T_ScdlHdrRes = {
  SCHEDULE_ID: number;
  SCHEDULE_NAME: string;
  FREQUENCY_MIN: number;
  OPERATION: "INSERT" | "MERGE";
  RESET_DATA: "Y" | "N";
  BI_REPORT_PATH: string;
  BI_REPORT_NAME: string;
  NEXT_SCHEDULE_TIME: Date;
  CREATED_BY: string;
  CREATION_DATE: string;
  LAST_UPDATED_BY: string;
  LAST_UPDATE_DATE: Date;
  LAST_UPDATE_LOGIN: string;
  STATUS: string;
  DB_TABLE_NAME: string;
  DB_COLUMN_NAMES: string | null;
  PACKAGE_TO_RUN_AFTER_PROCESS: string | null;
  RUN_PACKAGE_AT_LAST_SEQ: string;
};

export type T_getStatus = {
  scheduleJob(SCHEDULE_ID: string): any;
  BI_REPORT_NAME: string;
  STATUS: string;
  SCHEDULE_ID:string;
};

export type T_Metadata = {
  name: string;
};

export type T_ScdlList = {
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

