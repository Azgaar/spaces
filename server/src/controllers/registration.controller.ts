import httpStatus from "http-status";
import {User} from "../models/user";
import {logIn} from "../services/auth";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";

export const registerController = catchAsync(async (req, res, next) => {
  const {email, firstName, lastName, password} = req.body;
  const userExists = await User.exists({email});

  if (userExists) return next(new ApiError(httpStatus.BAD_REQUEST, `User ${email} already exists`));

  const user = await User.create({email, firstName, lastName, password, role: "user"});
  logIn(req, user.id);
  res.status(httpStatus.CREATED).send({email, firstName, lastName});
});

