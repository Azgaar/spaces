import httpStatus from "http-status";
import {logOut} from "../services/auth";
import catchAsync from "../utils/catchAsync";

export const logoutController = catchAsync(async (req, res) => {
  await logOut(req, res);
  res.status(httpStatus.OK).send({message: "OK"});
});
