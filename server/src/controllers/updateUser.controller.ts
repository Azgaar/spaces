import httpStatus from "http-status";
import {compare} from "bcryptjs";
import {getUserId, logOut} from "../services/auth";
import {updateUser} from "../services/user";
import {User} from "../models/user";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";

export const updateUserController = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) return next(new ApiError(httpStatus.UNAUTHORIZED, "Session is not set"));

  const user = await User.findById(userId);
  if (!user) {
    await logOut(req, res);
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User is not found. Removing the session"));
  }

  const {email, firstName, lastName, passwordOld, password, role} = req.body;

  const correctPassword = await compare(passwordOld, user.password);
  if (!correctPassword) return next(new ApiError(httpStatus.UNAUTHORIZED, `Password ${passwordOld} is not correct for user ${email}`));

  const userData = {email, firstName, lastName, password, role: role || user.role};
  updateUser(user, userData);
  res.status(httpStatus.OK).send({message: "OK"});
});
