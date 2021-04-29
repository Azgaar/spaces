import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import service from "../services/service";
import logger from "../utils/logger";

const add = catchAsync(async (req, res, next) => {
  const {services, reservation} = await service.add(req.body);
  if (!services || !reservation) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot request services"));

  logger.info(`[Service] Service requests ${services.map(s => s.id).join(", ")} are created and added to reservation ${reservation.id}`);
  res.status(httpStatus.CREATED).send(services);
});

const requestRemoval = catchAsync(async (req, res, next) => {
  const {id, requester} = req.body;
  const result = await service.requestRemoval(id, requester);
  if (!result) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot remove service request"));
  logger.info(`[Service] Service request ${id} is removed`);
  res.status(httpStatus.OK).send({id});
});

const list = catchAsync(async (req, res, next) => {
  const {location, status} = req.body;
  const services = await service.list(location, status);
  if (!services) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot get service requests"));
  res.status(httpStatus.OK).send(services);
});

const process = catchAsync(async (req, res, next) => {
  const {serviceIds, status} = req.body;
  const result = await service.process(serviceIds, status);
  if (!result) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot process service requests"));
  logger.info(`[Service] Service requests ${serviceIds.join(", ")} are processed to ${status}`);
  res.status(httpStatus.OK).send(result);
});

const remove = catchAsync(async (req, res, next) => {
  const {serviceIds} = req.body;
  const result = await service.remove(serviceIds);
  if (!result) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot remove service requests"));
  logger.info(`[Service] Service requests ${serviceIds.join(", ")} are removed`);
  res.status(httpStatus.OK).send(result);
});

export const serviceController = {add, requestRemoval, list, process, remove};
