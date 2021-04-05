import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";

export const deleteUsersController = catchAsync(async (req, res, next) => {
  const selelection: Array<string> = req.body;

  // const user = await User.findOne({email});
  // if (!user) return next(new ApiError(httpStatus.UNAUTHORIZED, `User ${email} is not registered`));

  //res.status(httpStatus.OK).send(user.toJSON());
  res.status(httpStatus.OK).send({message: "OK"});
});
