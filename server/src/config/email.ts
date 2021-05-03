type MailOptions = {
  SMTP_OPTIONS: {
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  };
  MAIL_FROM: string;
  FORGOT_PASSWORD_BYTES: number;
  FORGOT_PASSWORD_SUBJECT: string;
  FORGOT_PASSWORD_BODY: string;
};

export const getMailConfig = (): MailOptions => {
  const SMTP_OPTIONS = {
    host: String(process.env.SMTP_SERVER_HOST) || 'smtp.mailtrap.io',
    port: Number(process.env.SMTP_SERVER_PORT) || 2525,
    auth: {
      user: String(process.env.SMTP_SERVER_USER),
      pass: String(process.env.SMTP_SERVER_PASS)
    }
  };
  const MAIL_FROM = 'support.spaces@netlify.com';
  const FORGOT_PASSWORD_BYTES = 16;
  const FORGOT_PASSWORD_SUBJECT = 'SPACES: temporary password';
  const FORGOT_PASSWORD_BODY = `Your temporary password is below. If you did not request password change, please contact ${MAIL_FROM}. \r\nPassword: `;

  return {SMTP_OPTIONS, MAIL_FROM, FORGOT_PASSWORD_BYTES, FORGOT_PASSWORD_SUBJECT, FORGOT_PASSWORD_BODY};
};
