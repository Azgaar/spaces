import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import locationService from "../services/location";

const list = catchAsync(async (req, res, next) => {
  const locations = locationService.list();
  if (!locations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Locations cannot be fetched"));

  res.status(httpStatus.OK).send(locations);
});

const add = catchAsync(async (req, res, next) => {
  await locationService.add({description: req.body});
  list(req, res, next);
});

const rename = catchAsync(async (req, res, next) => {
  const {id, description} = req.body;
  await locationService.rename({id, description});
  list(req, res, next);
});

const remove = catchAsync(async (req, res, next) => {
  await locationService.remove({id: req.body});
  list(req, res, next);
});

export const locationController = {list, add, rename, remove};
