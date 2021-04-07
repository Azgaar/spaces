export const getMailConfig = () => {
  const SMTP_OPTIONS = {
    host: String(process.env.SMTP_SERVER_HOST) || "smtp.mailtrap.io",
    port: Number(process.env.SMTP_SERVER_PORT) || 2525,
    auth: {
      user: process.env.SMTP_SERVER_USER,
      pass: process.env.SMTP_SERVER_PASS
    }
  };
  const MAIL_FROM: string = "support.spaces@netlify.com";
  const FORGOT_PASSWORD_BYTES: number = 16;
  const FORGOT_PASSWORD_SUBJECT: string = "SPACES: temporary password";
  const FORGOT_PASSWORD_BODY: string = `Your temporary password is below. If you did not request password change, please contact ${MAIL_FROM}. \r\nPassword: `;

  return {SMTP_OPTIONS, MAIL_FROM, FORGOT_PASSWORD_BYTES, FORGOT_PASSWORD_SUBJECT, FORGOT_PASSWORD_BODY};
};
