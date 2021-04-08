import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import workspaceService from "../services/workspace";

const list = catchAsync(async (req, res, next) => {
  const {location} = req.body;
  const workspaces = await workspaceService.list(location);
  if (!workspaces) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch workspaces"));

  res.status(httpStatus.OK).send(workspaces);
});

const add = catchAsync(async (req, res, next) => {
  res.status(httpStatus.OK).send(location);
});

const rename = catchAsync(async (req, res, next) => {
  list(req, res, next);
});

const remove = catchAsync(async (req, res, next) => {
  list(req, res, next);
});

export const workspaceController = {list, add, rename, remove};
