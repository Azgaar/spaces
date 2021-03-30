import httpStatus from "http-status";
import {getUserId, logOut} from "../services/auth";
import {User} from "../models/user";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";

export const checkinController = catchAsync(async (req, res, next) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(httpStatus.NO_CONTENT).send();
  }

  const user = await User.findById(userId);
  if (!user) {
    await logOut(req, res);
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "User is not found. Removing the session"));
  }

  const {email, firstName, lastName} = user;
  res.status(httpStatus.OK).send({email, firstName, lastName});
});
