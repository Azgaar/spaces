import Joi from "@hapi/joi";

const locationSchema = Joi.string().min(2).max(256).trim().required();

export {locationSchema};
