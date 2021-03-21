import {User} from "../models/user";
import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";

const register = catchAsync(async (req, res, next) => {
  const {email, firstName, lastName, password} = req.body;
  const userExists = await User.exists({email});

  if (userExists) return next(new ApiError(httpStatus.BAD_REQUEST, `User ${email} already exists`));

  const user = await User.create({email, firstName, lastName, password});

  // save session and log in user
  req.session.userId = user._id;

  res.status(httpStatus.CREATED).send({user});
});

export default register;
