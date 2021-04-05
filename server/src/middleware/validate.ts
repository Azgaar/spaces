import {ObjectSchema} from "@hapi/joi";
import {isLoggedIn, getUserRole} from "../services/auth";
import httpStatus from "http-status";
import ApiError from "../utils/apiError";
import config from "../config";
import type {Request, Response, NextFunction} from "express";
import {UserRole} from "../types";

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

const checkSession = (sessionExpected: boolean) => (req: Request, res: Response, next: NextFunction) => {
  if (sessionExpected !== isLoggedIn(req)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, "User is not logged in", DISCLOSE_MESSAGE));
  }

  return next();
};

const checkRole = (roleExpected: UserRole) => (req: Request, res: Response, next: NextFunction) => {
  if (roleExpected !== getUserRole(req)) {
    return next(new ApiError(httpStatus.FORBIDDEN, `Operation is only allowed for ${roleExpected} users`, OBFUSCATE_MESSAGE));
  }

  return next();
};

export {validate, checkSession, checkRole};
