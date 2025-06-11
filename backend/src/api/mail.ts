import { fs_node_scheduler } from "../bundle/db-package";
import { resultSetExecute } from "../services/database";
import { T_MailNotificationRes } from "../types/mail";
import { M_MailReq } from "../models/mail";

export const readMailContent = async (
): Promise<T_MailNotificationRes> => {
  return resultSetExecute(fs_node_scheduler.mail_notification, M_MailReq());
};