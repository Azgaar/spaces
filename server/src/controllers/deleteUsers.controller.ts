import httpStatus from "http-status";
import {User} from "../models/user";
import {deleteUsers} from "../services/user";
import ApiError from "../utils/apiError";
import catchAsync from "../utils/catchAsync";

export const deleteUsersController = catchAsync(async (req, res, next) => {
  const emailsToDelete: Array<string> = req.body;
  await deleteUsers(emailsToDelete);

  const remainingUsers = await User.find();
  if (!remainingUsers) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Users cannot be fetched"));
  }

  res.status(httpStatus.OK).send(remainingUsers);
});
