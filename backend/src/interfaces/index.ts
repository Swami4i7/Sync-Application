import { Request } from "express";
import * as core from "express-serve-static-core";

export interface I_singleCursorResp<T = any> {
  cursor: T[];
  domain: string;
  username: string;
  password: string;
  err_code: string;
  err_msg: string;
}

export interface I_TabStruct {
  COLUMN_NAME: string;
  DATA_TYPE: string;
}

export interface I_ScheduleStatus<meatadataT = any,rowsT = any> {
  metadata:meatadataT[];
  rows:rowsT[];
}

export interface I_customReq_BodyOfObject<T> extends Request {
  body: T;
}


export interface I_customReq_Params_BodyOfObject<
  T_Params extends core.ParamsDictionary,
> extends Request {
  params: T_Params;
}

export interface I_customReq_Params<
  T_Params extends core.ParamsDictionary,
  T_Body
> extends Request {
  params: T_Params;
  body: T_Body;
}

