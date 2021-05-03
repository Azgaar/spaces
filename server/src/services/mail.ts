import nodemailer, {SendMailOptions} from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport(config.email.SMTP_OPTIONS);

export const sendMail = (options: SendMailOptions): void => {
  transporter.sendMail({...options});
};
