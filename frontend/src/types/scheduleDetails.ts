export interface ScheduleList {
  SCHEDULE_ID: number;
  SCHEDULE_NAME: string; //schedule name(2)
  FREQUENCY_MIN: number; //freq min(3)
  BI_REPORT_PATH: string; //report path(8)
  BI_REPORT_NAME: string; //report name(1)
  CREATED_BY: string;
  CREATION_DATE: string;
  LAST_UPDATED_BY: string;
  LAST_UPDATE_DATE: string;
  LAST_UPDATE_LOGIN: string;
  DATE:string | null;
  STATUS: string; //active toggle(7)
  RESET_DATA: string;
  DB_TABLE_NAME: string; //table name(4)
  DB_COLUMN_NAMES: string; //column name(5)
  OPERATION: string; //operation(6)
  PARAMETERS: ScheduleParameters[];
  PACKAGE_TO_RUN_AFTER_PROCESS: string; //package name(9)
  RUN_PACKAGE_AT_LAST_SEQ: string; //run package at last seq(10)
}

export interface ScheduleParameters {
  PARAM_ID: number;
  SCHEDULE_ID: number;
  PARAM_NAME: string;//nested param name(1)
  PARAM_VALUE: string;//nested value(2)
  SEQUENCE_NO: number;//nested sequence no(3)
  NEXT_SCHEDULE_TIME: Date;//nested input date and time(4)
  NEXT_SCHEDULE_TIME_TEMP?: Date;
  CREATED_BY: string;
  CREATION_DATE: string;
  LAST_UPDATED_BY: string;
  LAST_UPDATE_DATE: string;
}

export interface ScheduleDetailsResponse {
  success: boolean;
  totalPages: number;
  pageCount: number;
  data: ScheduleList[]; // Make sure ScheduleList is properly typed
}



