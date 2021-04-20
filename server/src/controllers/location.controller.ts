import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import locationService from "../services/location";

const list = catchAsync(async (req, res, next) => {
  const {onlyWithWorkspaces} = req.body;
  const locations = await locationService.list({onlyWithWorkspaces});
  if (!locations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch locations"));

  res.status(httpStatus.OK).send(locations);
});

const add = catchAsync(async (req, res, next) => {
  const {description} = req.body;
  const location = await locationService.add({description});
  if (!location) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot add location"));

  res.status(httpStatus.CREATED).send(location);
});

const rename = catchAsync(async (req, res, next) => {
  const {id, description} = req.body;
  const location = await locationService.rename({id, description});
  if (!location) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot rename location"));

  const locations = await locationService.list({onlyWithWorkspaces: false});
  if (!locations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch locations"));

  res.status(httpStatus.OK).send(locations);
});

const remove = catchAsync(async (req, res, next) => {
  const {id} = req.body;
  const location = await locationService.remove({id});
  if (!location) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot remove location"));

  const locations = await locationService.list({onlyWithWorkspaces: false});
  if (!locations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch locations"));

  res.status(httpStatus.OK).send(locations);
});

export const locationController = {list, add, rename, remove};
