import httpStatus from "http-status";
import {compare} from "bcryptjs";
import {User} from "../models/user";
import {logIn} from "../services/auth";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";

export const loginController = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;

  const user = await User.findOne({email});
  if (!user) return next(new ApiError(httpStatus.UNAUTHORIZED, `User ${email} is not registered`));

  const correctPassword = await compare(password, user.password);
  if (!correctPassword) return next(new ApiError(httpStatus.UNAUTHORIZED, `Password ${password} is not correct for user ${email}`));

  logIn(req, user.id, user.role);
  res.status(httpStatus.OK).send(user.toJSON());
});
