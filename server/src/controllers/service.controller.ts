import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import service from "../services/service";

const list = catchAsync(async (req, res, next) => {

});

const add = catchAsync(async (req, res, next) => {
  const addedServices = await service.add(req.body);
  if (!addedServices) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot request services"));

  res.status(httpStatus.CREATED).send(addedServices);
});

const process = catchAsync(async (req, res, next) => {


});

const update = catchAsync(async (req, res, next) => {

});

const remove = catchAsync(async (req, res, next) => {

});

export const serviceController = {list, add, process, update, remove};
