import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';
import { SEND_EMAIL } from '../constants/sendEmail.js';

const transporter = nodemailer.createTransport({
  host: getEnvVar(SEND_EMAIL.SMTP_HOST),
  port: Number(getEnvVar(SEND_EMAIL.SMTP_PORT)),
  secure: false,
  auth: {
    user: getEnvVar(SEND_EMAIL.SMTP_USER),
    pass: getEnvVar(SEND_EMAIL.SMTP_PASSWORD),
  },
});

export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
