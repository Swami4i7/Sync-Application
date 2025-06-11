import {
    BIND_IN,
    BIND_INOUT,
    BIND_OUT,
    CURSOR,
    ExecuteManyOptions,
    STRING,
    NUMBER
  } from "oracledb";
  import {
    T_MailNotificationReq
  } from "../types/mail";
  
  export const M_MailReq = (): T_MailNotificationReq => {
    return {
      mailNotificationFlag:{
        dir: BIND_OUT,
        type: STRING,
      },
      recordCount:{
        dir: BIND_OUT,
        type: NUMBER,
      },
      mailTo:{
        dir: BIND_OUT,
        type: STRING,
      },
      mailFrom:{
        dir: BIND_OUT,
        type: STRING,
      },
      mailSubject:{
        dir: BIND_OUT,
        type: STRING,
      },
      mailContent:{
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
  };