import { BIND_IN, BIND_OUT, CURSOR, NUMBER, STRING } from "oracledb";
import {
  T_InsScdlLineReq,
  T_UpdScdlLineReq_status,
  T_ScdParamsReq
} from "../../types/schedule/lines";

export const M_insScdlLine = (
  scheduleId: number,
  tableName: string,
  seqNo: number
): T_InsScdlLineReq => {
  return {
    schedule_id: {
      dir: BIND_IN,
      type: NUMBER,
      val: scheduleId,
    },
    table_name: {
      dir: BIND_IN,
      type: STRING,
      val: tableName,
    },
    seq_no:{
      dir: BIND_IN,
      type: NUMBER,
      val:seqNo
    },
    err_code: {
      dir: BIND_OUT,
      type: STRING,
    },
    err_msg: {
      dir: BIND_OUT,
      type: STRING,
    },
    schedule_list: {
      dir: BIND_OUT,
      type: CURSOR,
    },
    table_structure: {
      dir: BIND_OUT,
      type: CURSOR,
    },
  };
};

export const M_readScdParams = (
  scheduleId: number
): T_ScdParamsReq => {
  return {
    schedule_id: {
      dir: BIND_IN,
      type: NUMBER,
      val: scheduleId,
    },
    params_count: {
      dir: BIND_OUT,
      type: NUMBER,
    },
    params:{
      dir: BIND_OUT,
      type: CURSOR,
    },
    already_running: {
      dir: BIND_OUT,
      type: NUMBER,
    },
    err_code: {
      dir: BIND_OUT,
      type: STRING,
    },
    err_msg: {
      dir: BIND_OUT,
      type: STRING,
    }
  };
};

export const M_updScdlLine_status = (
  schdl_list_id: string,
  status: string,
  err_msg: string | null,
  seqno: number,
  lastseq: string,
  recordCount: number
): T_UpdScdlLineReq_status => {
  return {
    schdl_list_id: {
      dir: BIND_IN,
      type: STRING,
      val: schdl_list_id,
    },
    status: {
      dir: BIND_IN,
      type: STRING,
      val: status,
    },
    seq_no:{
      dir: BIND_IN,
      type: NUMBER,
      val: seqno,
    },
    last_seq:{
      dir: BIND_IN,
      type: STRING,
      val: lastseq,
    },
    record_count:{
      dir: BIND_IN,
      type: NUMBER,
      val: recordCount,
    },
    err_msg: {
      dir: BIND_IN,
      type: STRING,
      val: err_msg,
    },
    err_status: {
      dir: BIND_OUT,
      type: STRING,
    },
  };
};

