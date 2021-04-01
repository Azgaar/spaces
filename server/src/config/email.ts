export const SMTP_OPTIONS = {
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "fd50613b5f3539",
    pass: "f584a126799fbe"
  }
};
export const MAIL_FROM: string = "support.spaces@netlify.com";
export const FORGOT_PASSWORD_BYTES: number = 16;
export const FORGOT_PASSWORD_SUBJECT: string = "SPACES: temporary password";
export const FORGOT_PASSWORD_BODY: string = `Your temporary password is below. If you did not request password change, please contact ${MAIL_FROM}. \r\nPassword: `;
