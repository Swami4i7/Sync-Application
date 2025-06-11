import { fs_node_scheduler } from "../../bundle/db-package";
import { I_InsScdlLineRes, I_ScdParamsRes } from "../../interfaces/schedule/lines";
import { resultSetExecute } from "../../services/database";
import {
  T_InsScdlLineReq,
  T_UpdScdlLineReq_status,
  T_ResetLineReq_status,
  T_ScdParamsReq
} from "../../types/schedule/lines";

export const insScdlLine_api = async (
  binds: T_InsScdlLineReq
): Promise<I_InsScdlLineRes> => {
  return resultSetExecute(fs_node_scheduler.ins_schdl_list, binds);
};

export const updScdlLine_status_api = async (
  binds: T_UpdScdlLineReq_status
): Promise<any> => {
  return resultSetExecute(fs_node_scheduler.upd_schdl_list_status, binds);
};

export const resetLine_status_api = async (
  binds: T_ResetLineReq_status
): Promise<any> => {
  return resultSetExecute(fs_node_scheduler.reset_schdl_list_status, binds);
};

export const readScdParams_api = async (
  binds: T_ScdParamsReq
): Promise<I_ScdParamsRes> => {
  return resultSetExecute(fs_node_scheduler.get_schedule_params, binds);
};

export const executePackage_api = async (procedure:string) : Promise<any> => {
  return resultSetExecute(procedure);
};
