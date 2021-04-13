import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import reservationService from "../services/reservation";

const list = catchAsync(async (req, res, next) => {
  const {location} = req.body;
  const workspaces = await reservationService.list(location);
  if (!workspaces) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch workspaces"));

  res.status(httpStatus.OK).send(workspaces);
});

const add = catchAsync(async (req, res, next) => {
  const addedWorkspace = await reservationService.add(req.body);
  if (!addedWorkspace) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot add workspace"));

  res.status(httpStatus.CREATED).send(addedWorkspace);
});

const update = catchAsync(async (req, res, next) => {
  next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Not implemented"));
});

const remove = catchAsync(async (req, res, next) => {
  next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Not implemented"));
});

const find = catchAsync(async (req, res, next) => {
  next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Not implemented"));
});

export const reservationController = {list, add, update, remove, find};
