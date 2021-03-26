import {ObjectSchema} from "@hapi/joi";
import {isLoggedIn} from "../services/auth";
import httpStatus from "http-status";
import ApiError from "../utils/apiError";
import config from "../config";
import type {Request, Response, NextFunction} from "express";

const isOperational = true; // validation errors messages to be disclosed to end-user in production

const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const {value, error} = schema.validate(req.body, config.joi.options);

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage, isOperational));
  }

  return next();
};

const notLogged = (req: Request, res: Response, next: NextFunction) => {
  if (isLoggedIn(req)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "User is already logged in", isOperational));
  }

  return next();
};

const isLogged = (req: Request, res: Response, next: NextFunction) => {
  if (!isLoggedIn(req)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "User is not logged in", isOperational));
  }

  return next();
};

export {validate, notLogged, isLogged};
