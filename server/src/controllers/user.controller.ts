import httpStatus from 'http-status';
import {isLoggedIn, logIn} from '../services/auth';
import {createUser, removeUser, updateUser} from '../services/user';
import {User} from '../models/user';
import {compare} from 'bcryptjs';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/apiError';
import {UserRole} from '../types';

const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  if (!users) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch users'));
  }

  res.status(httpStatus.OK).send(users);
});

const registerUser = catchAsync(async (req, res, next) => {
  const {email, firstName, lastName, password} = req.body;

  const userExists = await User.exists({email});
  if (userExists) {
    return next(new ApiError(httpStatus.BAD_REQUEST, `User ${email} already exists`, {obfuscate: true}));
  }

  const userData = {email, firstName, lastName, password, role: UserRole.USER};
  const user = await createUser(userData);

  if (!user) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create user'));
  }

  if (!isLoggedIn(req)) {
    logIn(req, user.id, user.email, user.role);
  }

  res.status(httpStatus.CREATED).send(user);
});

const modifyUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot find user ${userId}`));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {password, passwordNew, passwordNewRepeat, ...rest} = req.body;

  if (password || passwordNew) {
    const correctPassword = await compare(password, user.password);
    if (!correctPassword) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, `Password ${password} is not correct`));
    }
  }

  // password change
  if (passwordNew) {
    const updatedUser = await updateUser(user, {password: passwordNew});
    if (!updatedUser) {
      return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot update user ${user.email}`));
    }

    res.status(httpStatus.OK).send(updatedUser);
  }

  const updatedUser = await updateUser(user, rest);
  if (!updatedUser) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot update user ${user.email}`));
  }

  res.status(httpStatus.OK).send(updatedUser);
});

const deleteUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Cannot find user ${userId}`));
  }

  const deletionResult = await removeUser(userId);
  res.status(httpStatus.OK).send(deletionResult);
});

export const userController = {getUsers, registerUser, modifyUser, deleteUser};
