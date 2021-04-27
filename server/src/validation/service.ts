import Joi from "@hapi/joi";

const id = Joi.string().min(2).max(128).required();
const requester = Joi.string().email().min(6).max(128).lowercase().trim().required();
const status = Joi.string().min(2).max(128).required();
const description = Joi.string().min(3).max(512).trim().required();

const reservationId = Joi.string().min(2).max(128).required();
const servicesList = Joi.array().min(1).required().items(description);

const serviceRequestSchema = Joi.object({reservationId, requester, servicesList});
const serviceProcessSchema = Joi.object({id, status});
const serviceUpdateSchema = Joi.object({id, requester, description});
const serviceDeleteSchema = Joi.object({id, requester});

export {serviceRequestSchema, serviceProcessSchema, serviceUpdateSchema, serviceDeleteSchema};
