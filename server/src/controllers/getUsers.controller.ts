import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import {User} from "../models/user";
import ApiError from "../utils/apiError";

export const getUsersController = catchAsync(async (req, res, next) => {
  const userDocuments = await User.find();
  if (!userDocuments) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Users cannot be fetched"));
  }

  res.status(httpStatus.OK).send(userDocuments);
});
