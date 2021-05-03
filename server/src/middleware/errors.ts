import mongoose from 'mongoose';
import config from '../config';
import httpStatus from 'http-status';
import logger from '../utils/logger';
import ApiError from '../utils/apiError';
import type {Request, Response, NextFunction} from 'express';

const errorConverter = (err: Error | ApiError, req: Request, res: Response, next: NextFunction): void => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = String(error.message || httpStatus[statusCode]);
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err: ApiError, req: Request, res: Response): void => {
  let {statusCode, message} = err;
  const DEV = config.env === 'development';

  if (!DEV && !err.isOperational) {
    if (statusCode !== httpStatus.UNAUTHORIZED) {
      statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    }
    message = String(httpStatus[httpStatus.INTERNAL_SERVER_ERROR]);
  }

  DEV && logger.error(`[Error] ${err.statusCode}: ${err.message}`);
  res.locals.errorMessage = err.message;

  const response = {code: statusCode, message, stack: DEV && err.stack};
  res.status(statusCode).json(response);
};

export {errorConverter, errorHandler};
