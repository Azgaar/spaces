import httpStatus from "http-status";
import {getUserId, logOut} from "../services/auth";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import {User} from "../models/user";

export const checkinController = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);
  if (!userId) return res.status(httpStatus.NO_CONTENT).end();

  const user = await User.findById(userId);
  if (!user) {
    await logOut(req, res);
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User is not found. Removing the session"));
  }

  res.status(httpStatus.OK).send(user.toJSON());
});
