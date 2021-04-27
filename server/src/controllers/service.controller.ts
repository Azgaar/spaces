import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import service from "../services/service";
import logger from "../utils/logger";

const list = catchAsync(async (req, res, next) => {

});

const add = catchAsync(async (req, res, next) => {
  const {services, reservation} = await service.add(req.body);
  if (!services || !reservation) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot request services"));

  logger.info(`[Service] Service requests ${services.map(s => s.id).join(", ")} are created and added to reservation ${reservation.id}`);
  res.status(httpStatus.CREATED).send(services);
});

const process = catchAsync(async (req, res, next) => {


});

const update = catchAsync(async (req, res, next) => {

});

const remove = catchAsync(async (req, res, next) => {

});

export const serviceController = {list, add, process, update, remove};
