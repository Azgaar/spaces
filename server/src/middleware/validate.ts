import {ObjectSchema} from "@hapi/joi";
import httpStatus from "http-status";
import ApiError from "../utils/apiError";
import config from "../config";
import type {Request, Response, NextFunction} from "express";

const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const {value, error} = schema.validate(req.body, config.joi.options);

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(", ");
    const isOperational = true;
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage, isOperational));
  }

  return next();
};

export default validate;
