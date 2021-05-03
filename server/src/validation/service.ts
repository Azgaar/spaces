import Joi from '@hapi/joi';

const id = Joi.string().min(2).max(128).required();
const requester = Joi.string().email().min(6).max(128).lowercase().trim().required();
const status = Joi.string().min(2).max(128).required();
const description = Joi.string().min(3).max(512).trim().required();

const location = Joi.string().min(2).max(128).required();
const reservationId = Joi.string().min(2).max(128).required();
const servicesList = Joi.array().min(1).required().items(description);
const serviceIds = Joi.array().min(1).required().items(id);

const serviceRequestSchema = Joi.object({location, reservationId, requester, servicesList});
const serviceRemovalRequestSchema = Joi.object({id, requester});
const serviceProcessSchema = Joi.object({serviceIds, status});
const serviceDeleteSchema = Joi.object({serviceIds});

export {serviceRequestSchema, serviceRemovalRequestSchema, serviceProcessSchema, serviceDeleteSchema};
