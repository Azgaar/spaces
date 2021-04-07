import mongoose from "mongoose";
import config from "../config";
import httpStatus from "http-status";
import logger from "../utils/logger";
import ApiError from "../utils/apiError";
import type {Request, Response, NextFunction} from "express";
import {logOut} from "../services/auth";

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
  const DEV = config.env === "development";

  if (!DEV && !err.isOperational) {
    if (statusCode !== httpStatus.UNAUTHORIZED) statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = String(httpStatus[httpStatus.INTERNAL_SERVER_ERROR]);
  }

  if (DEV) logger.error(`[Error] ${err.statusCode}: ${err.message}`);
  res.locals.errorMessage = err.message;

  const response = {code: statusCode, message, stack: DEV && err.stack};
  res.status(statusCode).json(response);
};

export {errorConverter, errorHandler};
