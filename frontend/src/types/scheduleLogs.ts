export interface ScheduleLogs{
    SCHEDULE_LIST_ID: number;
    SCHEDULE_ID: number;
    PARAM_SEQUENCE_NO: number;
    SCHEDULE_NAME: string;
    BI_REPORT_PATH: string;
    BI_REPORT_NAME: string;
    LAST_REFRESH_TIME: string;
    SCHEDULE_STATUS: string;
    ERROR_MESSAGE: null,
    REPORT_RECORD_COUNT: number;
    CREATED_BY: string;
    CREATION_DATE: string;
    LAST_UPDATED_BY: string;
    LAST_UPDATE_DATE: string;
    LAST_UPDATE_LOGIN: string;
}

export type ErrorLogs = {
    ERR_ID: number;
    TABLE_NAME: string;
    MERGE_QUERY: string; // CLOB can be treated as a string
    SCHEDULE_ID: number;
    SCHEDULE_LIST_ID: number;
    ERR_CODE: string;
    ERR_MSG: string;
    CREATION_DATE: string; // Use string if handling timestamps as ISO strings
    ERR_STATUS: string;
  };
  