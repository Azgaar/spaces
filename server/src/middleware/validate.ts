import {ObjectSchema} from "@hapi/joi";
import httpStatus from "http-status";
import ApiError from "../utils/apiError";
import type {Request, Response, NextFunction} from "express";

const validate = (schema: ObjectSchema) => (req: Request, res: Response, next: NextFunction) => {
  const {value, error} = schema.validate(req.body, {abortEarly: true});

  if (error) {
    const errorMessage = error.details.map(details => details.message).join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }

  return next();
};

export default validate;
