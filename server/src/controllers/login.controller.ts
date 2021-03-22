import httpStatus from "http-status";
import {User} from "../models/user";
import {isLoggedIn, logIn, logOut} from "../services/auth";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";

export const loginController = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;
  if (isLoggedIn(req)) return next(new ApiError(httpStatus.BAD_REQUEST, `User ${email} already logged in`));

  const user = await User.findOne({email});
  if (!user) return next(new ApiError(httpStatus.UNAUTHORIZED, `User ${email} is not registered`));

  const correctPassword = password === user.password; // TODO: store and compare hash
  if (!correctPassword) return next(new ApiError(httpStatus.UNAUTHORIZED, `Password ${password} is not correct for user ${email}`));

  logIn(req, user.id);
  const {firstName, lastName} = user;
  res.status(httpStatus.OK).send({email, firstName, lastName});
});
