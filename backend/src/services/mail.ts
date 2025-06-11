/// <reference path="../index.d.ts" />
import nodemailer from "nodemailer";
import inLineCss from "nodemailer-juice";
import inlineBase64 from "nodemailer-plugin-inline-base64";
import { SMTP_TRANSPORT } from "../config/mail";

export const sendMail_mdlr = ({
  html,
  subject,
  to,
  from
}: {
  html: string;
  subject: string;
  to: string[];
  from: string;
}) => {
  try {
    let transporter = nodemailer.createTransport(SMTP_TRANSPORT);
    transporter.use("compile", inLineCss());
    transporter.use("compile", inlineBase64());
    transporter.sendMail({
      from,
      priority: "high",
      to,
      subject,
      html
    });
  } catch (err:any) {
    console.log("error-mail", err.message);
    throw err;
  }
};
