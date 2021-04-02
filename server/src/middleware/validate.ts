import {ObjectSchema} from "@hapi/joi";
import {isLoggedIn, isLoggedAsAdmin} from "../services/auth";
import httpStatus from "http-status";
import ApiError from "../utils/apiError";
import config from "../config";
import type {Request, Response, NextFunction} from "express";

const DISCLOSE_MESSAGE = true;
const OBFUSCATE_MESSAGE = false;

const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const {value, error} = schema.validate(req.body, config.joi.options);

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage, DISCLOSE_MESSAGE));
  }

  return next();
};

const notLogged = (req: Request, res: Response, next: NextFunction) => {
  if (isLoggedIn(req)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "User is already logged in", DISCLOSE_MESSAGE));
  }

  return next();
};

const isLogged = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.session.userId);
  if (!isLoggedIn(req)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "User is not logged in", DISCLOSE_MESSAGE));
  }

  return next();
};

const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!isLoggedAsAdmin(req)) {
    return next(new ApiError(httpStatus.FORBIDDEN, "Operation is only allowed for admin users", OBFUSCATE_MESSAGE));
  }

  return next();
};

export {validate, notLogged, isLogged, isAdmin};
