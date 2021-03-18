import mongoose from "mongoose";
import config from "../config";
import httpStatus from "http-status";
import logger from "../utils/logger";
import ApiError from "../utils/apiError";
import type {Request, Response, NextFunction} from "express";

const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  let {statusCode, message} = err;
  if (config.env === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = String(httpStatus[httpStatus.INTERNAL_SERVER_ERROR]);
  }

  if (config.env === "development") logger.error(err);
  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === "development" && {stack: err.stack})
  };
  res.status(statusCode).send(response);
};

export {errorConverter, errorHandler};
