import Joi from "@hapi/joi";

const id = Joi.string().min(2).max(128).required();
const description = Joi.string().min(2).max(256).trim().required();

const locationCreationSchema = Joi.object({description});
const locationDeletionSchema = Joi.object({id});
const locationRenamingSchema = Joi.object({id, description});

export {locationCreationSchema, locationDeletionSchema, locationRenamingSchema};
