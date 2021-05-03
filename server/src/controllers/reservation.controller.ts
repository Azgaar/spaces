import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/apiError';
import reservationService from '../services/reservation';

const list = catchAsync(async (req, res, next) => {
  const {location} = req.body;
  const reservations = await reservationService.list(location);
  if (!reservations) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot fetch reservations'));
  }

  res.status(httpStatus.OK).send(reservations);
});

const add = catchAsync(async (req, res, next) => {
  const alreadyReserved = await reservationService.check(req.body);
  if (alreadyReserved) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Workspace is already reserved'));
  }

  const addedReservation = await reservationService.add(req.body);
  if (!addedReservation) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot add reservation'));
  }

  res.status(httpStatus.CREATED).send(addedReservation);
});

const update = catchAsync(async (req, res, next) => {
  const alreadyReserved = await reservationService.check(req.body);
  if (alreadyReserved) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Workspace is already reserved'));
  }

  const updatedReservation = await reservationService.update(req.body);
  if (!updatedReservation) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot update reservation'));
  }

  const reservations = await reservationService.list(updatedReservation.location);
  if (!reservations) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot fetch reservations'));
  }

  res.status(httpStatus.OK).send(reservations);
});

const remove = catchAsync(async (req, res, next) => {
  const {location, selection} = req.body;
  const removed = await reservationService.remove(selection);
  if (!removed) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot remove reservations'));
  }

  const reservations = await reservationService.list(location);
  if (!reservations) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot fetch reservations'));
  }

  res.status(httpStatus.OK).send(reservations);
});

const listUserReservations = catchAsync(async (req, res, next) => {
  const {email, active} = req.body;
  const reservations = await reservationService.requestList(email, {active});
  if (!reservations) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot fetch reservations'));
  }

  res.status(httpStatus.OK).send(reservations);
});

const removeUserReservations = catchAsync(async (req, res, next) => {
  const {email, id} = req.body;
  const removed = await reservationService.requestRemoval(email, id);
  if (!removed) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot remove reservations'));
  }

  const reservations = await reservationService.requestList(email, {active: true});
  if (!reservations) {
    return next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Cannot fetch reservations'));
  }

  res.status(httpStatus.OK).send(reservations);
});

export const reservationController = {list, add, update, remove, listUserReservations, removeUserReservations};
