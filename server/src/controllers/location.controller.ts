import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import locationService from "../services/location";

const list = catchAsync(async (req, res, next) => {
  const locations = await locationService.list();
  if (!locations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Locations cannot be fetched"));

  res.status(httpStatus.OK).send(locations);
});

const add = catchAsync(async (req, res, next) => {
  const {description} = req.body;
  await locationService.add({description});
  list(req, res, next);
});

const rename = catchAsync(async (req, res, next) => {
  const {id, description} = req.body;
  await locationService.rename({id, description});
  list(req, res, next);
});

const remove = catchAsync(async (req, res, next) => {
  const {id} = req.body;
  await locationService.remove({id});
  list(req, res, next);
});

export const locationController = {list, add, rename, remove};
