import httpStatus from "http-status";
import {compare} from "bcryptjs";
import {getUserId, logOut} from "../services/auth";
import {updateUser} from "../services/user";
import {User} from "../models/user";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";

export const changePasswordController = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  const user = await User.findById(userId);
  if (!user) {
    await logOut(req, res);
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User is not found. Removing the session"));
  }

  const {password, passwordNew} = req.body;

  const correctPassword = await compare(password, user.password);
  if (!correctPassword) return next(new ApiError(httpStatus.UNAUTHORIZED, `Password ${password} is not correct for user ${user.email}`));

  await updateUser(user, {password: passwordNew});
  res.status(httpStatus.NO_CONTENT).end();
});
