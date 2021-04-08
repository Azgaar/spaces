import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import workspaceService from "../services/workspace";
import logger from "../utils/logger";

const list = catchAsync(async (req, res, next) => {
  const {location} = req.body;
  const workspaces = await workspaceService.list(location);
  if (!workspaces) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch workspaces"));

  res.status(httpStatus.OK).send(workspaces);
});

const add = catchAsync(async (req, res, next) => {
  const addedWorkspace = await workspaceService.add(req.body);
  if (!addedWorkspace) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot add workspace"));

  res.status(httpStatus.CREATED).send(addedWorkspace);
});

const rename = catchAsync(async (req, res, next) => {
  list(req, res, next);
});

const remove = catchAsync(async (req, res, next) => {
  list(req, res, next);
});

export const workspaceController = {list, add, rename, remove};
