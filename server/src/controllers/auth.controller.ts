import httpStatus from 'http-status';
import {compare} from 'bcryptjs';
import {getUserId, logIn, logOut} from '../services/auth';
import {User} from '../models/user';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/apiError';

const login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if (!user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, `User ${email} is not registered`));
  }

  const correctPassword = await compare(password, user.password);
  if (!correctPassword) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, `Password ${password} is not correct for user ${email}`));
  }

  logIn(req, user.id, user.email, user.role);
  res.status(httpStatus.OK).send(user.toJSON());
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
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User is not found. Removing the session'));
  }

  res.status(httpStatus.OK).send(user.toJSON());
});

export const authController = {login, logout, checkin};
