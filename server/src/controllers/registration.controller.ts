import httpStatus from "http-status";
import {User} from "../models/user";
import {logIn} from "../services/auth";
import {createUser} from "../services/user";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import {UserRole} from "../types";

export const registerController = catchAsync(async (req, res, next) => {
  const {email, firstName, lastName, password} = req.body;

  const userExists = await User.exists({email});
  if (userExists) return next(new ApiError(httpStatus.BAD_REQUEST, `User ${email} already exists`));

  const userData = {email, firstName, lastName, password, role: UserRole.USER};
  const user = await createUser(userData);
  logIn(req, user.id);

  res.status(httpStatus.CREATED).send({email, firstName, lastName});
});
