import httpStatus from 'http-status';
import {compare} from 'bcryptjs';
import {getUserId, logIn, logOut} from '../services/auth';
import {User} from '../models/user';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/apiError';
import {randomBytes} from 'crypto';
import {sendMail} from '../services/mail';
import config from '../config';
import {updateUser} from '../services/user';

const login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if (!user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, `Invalid username or password`));
  }

  const correctPassword = await compare(password, user.password);
  if (!correctPassword) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, `Invalid username or password`));
  }

  logIn(req, user.id, user.email, user.role);
  res.status(httpStatus.OK).send(user);
});

const logout = catchAsync(async (req, res) => {
  await logOut(req, res);
  res.status(httpStatus.OK).send({message: 'OK'});
});

const checkin = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(httpStatus.NO_CONTENT).end();
  }

  const user = await User.findById(userId);
  if (!user) {
    await logOut(req, res);
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User is not found. Removing the session', {obfuscate: true}));
  }

  res.status(httpStatus.OK).send(user.toJSON());
});

const resetPassword = catchAsync(async (req, res) => {
  const {email} = req.body;

  const user = await User.findOne({email});
  if (user) {
    const password = randomBytes(config.email.FORGOT_PASSWORD_BYTES).toString('hex');
    await updateUser(user, {password});
    const from = config.email.MAIL_FROM;
    const subject = config.email.FORGOT_PASSWORD_SUBJECT;
    const text = config.email.FORGOT_PASSWORD_BODY + password;
    sendMail({to: email, subject, text, from});
  }

  res.status(httpStatus.OK).send({message: 'OK'});
});

export const authController = {login, logout, checkin, resetPassword};
