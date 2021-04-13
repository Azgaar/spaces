import httpStatus from "http-status";
import catchAsync from "../utils/catchAsync";
import ApiError from "../utils/apiError";
import reservationService from "../services/reservation";

const list = catchAsync(async (req, res, next) => {
  const {location} = req.body;
  const reservations = await reservationService.list(location);
  if (!reservations) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch reservations"));

  res.status(httpStatus.OK).send(reservations);
});

const add = catchAsync(async (req, res, next) => {
  const addedReservation = await reservationService.add(req.body);
  if (!addedReservation) return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Cannot add reservation"));

  res.status(httpStatus.CREATED).send(addedReservation);
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
