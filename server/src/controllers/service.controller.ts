import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import service from "../services/service";

const list = catchAsync(async (req, res, next) => {
  const {location} = req.body;
  const reservations = await service.list(location);
  if (!reservations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch reservations"));

  res.status(httpStatus.OK).send(reservations);
});

const add = catchAsync(async (req, res, next) => {
  const addedReservation = await service.add(req.body);
  if (!addedReservation) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot add reservation"));

  res.status(httpStatus.CREATED).send(addedReservation);
});

const process = catchAsync(async (req, res, next) => {
  const processedReservation = await service.update(req.body);
  if (!processedReservation) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot update reservation"));

  const reservations = await service.list(processedReservation.location);
  if (!reservations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch reservations"));

  res.status(httpStatus.OK).send(reservations);
});

const update = catchAsync(async (req, res, next) => {
  const updatedReservation = await service.update(req.body);
  if (!updatedReservation) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot update reservation"));

  const reservations = await service.list(updatedReservation.location);
  if (!reservations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch reservations"));

  res.status(httpStatus.OK).send(reservations);
});

const remove = catchAsync(async (req, res, next) => {
  const {location, selection} = req.body;
  const removed = await service.remove(selection);
  if (!removed) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot remove reservations"));

  const reservations = await service.list(location);
  if (!reservations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch reservations"));

  res.status(httpStatus.OK).send(reservations);
});

export const serviceController = {list, add, process, update, remove};
