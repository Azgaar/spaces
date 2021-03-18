import {User} from "../models/user";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";

const register = catchAsync(async (req, res, next) => {
  const {email, firstName, lastName, password} = req.body;
  const userExists = await User.exists({email});

  if (userExists) {
    const PROD = process.env.NODE_ENV === "production";
    const message = PROD ? "Bad request" : `User ${email} already exists`;
    return next(new ApiError(httpStatus.BAD_REQUEST, message));
  }

  const user = await User.create({email, firstName, lastName, password});
  res.status(httpStatus.CREATED).send({user});
});

export default register;
