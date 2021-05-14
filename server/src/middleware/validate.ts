import {AnySchema} from '@hapi/joi';
import {isLoggedIn, getUserRole, getUserEmail} from '../services/auth';
import httpStatus from 'http-status';
import ApiError from '../utils/apiError';
import config from '../config';
import type {Request, Response, NextFunction} from 'express';
import {UserRole} from '../types';

const DISCLOSE_MESSAGE = true;
const OBFUSCATE_MESSAGE = false;

const validate =
  (schema: AnySchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const {error} = schema.validate(req.body, config.joi.options);

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage, DISCLOSE_MESSAGE));
    }

    return next();
  };

const checkSession =
  (sessionExpected: boolean) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (sessionExpected !== isLoggedIn(req)) {
      return next(new ApiError(httpStatus.BAD_REQUEST, `User is ${sessionExpected ? 'not' : 'already'} logged in`, DISCLOSE_MESSAGE));
    }

    return next();
  };

const checkRole =
  (roleExpected: UserRole) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (roleExpected !== getUserRole(req)) {
      return next(new ApiError(httpStatus.FORBIDDEN, `Operation is only allowed for ${roleExpected} users`, OBFUSCATE_MESSAGE));
    }

    return next();
  };

const checkBodyForRole =
  (roleExpected: UserRole) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.body.role && roleExpected !== getUserRole(req)) {
      return next(new ApiError(httpStatus.FORBIDDEN, `Operation is only allowed for ${roleExpected} users`, OBFUSCATE_MESSAGE));
    }

    return next();
  };

const checkEmail = (req: Request, res: Response, next: NextFunction): void => {
  const emailAddedToRequest = req.body.email || req.body.requester;
  const emailOfLoggedUser = getUserEmail(req);
  if (!emailAddedToRequest || emailAddedToRequest !== emailOfLoggedUser) {
    const mess = `User ${emailOfLoggedUser} is not authorized to perform the operation for user ${emailAddedToRequest}`;
    return next(new ApiError(httpStatus.FORBIDDEN, mess, OBFUSCATE_MESSAGE));
  }

  return next();
};

export {validate, checkSession, checkRole, checkBodyForRole, checkEmail};
