import httpStatus from 'http-status';
import {getUserId, logIn, logOut} from '../services/auth';
import {createUser, deleteUsers, updateUser} from '../services/user';
import {User} from '../models/user';
import {compare} from 'bcryptjs';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/apiError';
import {UserRole} from '../types';
import {randomBytes} from 'crypto';
import {sendMail} from '../services/mail';
import config from '../config';

const register = catchAsync(async (req, res, next) => {
  const {email, firstName, lastName, password} = req.body;

  const userExists = await User.exists({email});
  if (userExists) {
    return next(new ApiError(httpStatus.BAD_REQUEST, `User ${email} already exists`));
  }

  const userData = {email, firstName, lastName, password, role: UserRole.USER};
  const user = await createUser(userData);
  logIn(req, user.id, user.email, user.role);

  res.status(httpStatus.CREATED).send({email, firstName, lastName});
});

const update = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  const user = await User.findById(userId);
  if (!user) {
    await logOut(req, res);
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User is not found. Removing the session'));
  }

  const {email, firstName, lastName, password} = req.body;

  const correctPassword = await compare(password, user.password);
  if (!correctPassword) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, `Password ${password} is not correct for user ${email}`));
  }

  await updateUser(user, {email, firstName, lastName});
  res.status(httpStatus.OK).send({email, firstName, lastName});
});

const changePassword = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  const user = await User.findById(userId);
  if (!user) {
    await logOut(req, res);
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User is not found. Removing the session'));
  }

  const {password, passwordNew} = req.body;

  const correctPassword = await compare(password, user.password);
  if (!correctPassword) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, `Password ${password} is not correct for user ${user.email}`));
  }

  await updateUser(user, {password: passwordNew});
  res.status(httpStatus.OK).send({message: 'OK'});
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

const remove = catchAsync(async (req, res, next) => {
  const emailsToDelete: Array<string> = req.body;
  await deleteUsers(emailsToDelete);

  const remainingUsers = await User.find();
  if (!remainingUsers) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Users cannot be fetched'));
  }

  res.status(httpStatus.OK).send(remainingUsers);
});

const list = catchAsync(async (req, res, next) => {
  const userDocuments = await User.find({});
  if (!userDocuments) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Users cannot be fetched'));
  }

  res.status(httpStatus.OK).send(userDocuments);
});

export const userController = {register, update, changePassword, resetPassword, remove, list};
