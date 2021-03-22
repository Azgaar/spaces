import {ObjectSchema} from "@hapi/joi";
import {isLoggedIn} from "../services/auth";
import httpStatus from "http-status";
import ApiError from "../utils/apiError";
import type {Request, Response, NextFunction} from "express";

const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const {value, error} = schema.validate(req.body, {abortEarly: true});

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(", ");
    const isOperational = true;
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage, isOperational));
  }

  return next();
};

const notLogged = (req: Request, res: Response, next: NextFunction) => {
  if (isLoggedIn(req)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, `User is already logged in`));
  }

  return next();
};

export {notLogged, validate};
