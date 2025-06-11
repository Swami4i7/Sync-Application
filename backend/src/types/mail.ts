import { BindParameter } from "oracledb";

export type T_MailNotificationReq = {
    mailNotificationFlag: BindParameter;
    recordCount: BindParameter;
    mailFrom: BindParameter;
    mailTo: BindParameter;
    mailSubject: BindParameter;
    mailContent: BindParameter;
    err_code: BindParameter;
    err_msg: BindParameter;
  };

  export type T_MailNotificationRes = {
    mailNotificationFlag: string;
    recordCount: number;
    mailFrom: string;
    mailTo: string;
    mailSubject: string;
    mailContent: [T_MailContent];
    err_code: string | null;
    err_msg: string | null;
  };

  export type T_MailContent = {
    MAIL_CONTENT: string;
  }