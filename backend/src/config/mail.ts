import SMTPTransport from "nodemailer/lib/smtp-transport";

export const SMTP_TRANSPORT: SMTPTransport.Options = 
{
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 25,
        secure: false, 
        auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD 
        },
        tls: {
                rejectUnauthorized: false
        }
};
