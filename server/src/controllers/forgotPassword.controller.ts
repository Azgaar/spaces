import httpStatus from "http-status";
import {updateUser} from "../services/user";
import {User} from "../models/user";
import catchAsync from "../utils/catchAsync";
import {sendMail} from "../services/mail";
import {randomBytes} from "crypto";
import config from "../config";

export const forgotPasswordController = catchAsync(async (req, res, next) => {
  const {email} = req.body;

  const user = await User.findOne({email});
  if (user) {
    const password = randomBytes(config.email.FORGOT_PASSWORD_BYTES).toString("hex");
    await updateUser(user, {password});
    const from = config.email.MAIL_FROM;
    const subject = config.email.FORGOT_PASSWORD_SUBJECT;
    const text = config.email.FORGOT_PASSWORD_BODY + password;
    sendMail({to: email, subject, text, from});
  }

  res.status(httpStatus.OK).send({message: "OK"});
});
