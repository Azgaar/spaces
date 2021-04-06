import Joi from "@hapi/joi";

const locationDescriptionSchema = Joi.string().min(2).max(256).trim().required();
const locationIdSchema = Joi.string().min(2).max(128).required();
const locationRenamingSchema = Joi.object({id: locationIdSchema, description: locationDescriptionSchema});

export {locationDescriptionSchema, locationIdSchema, locationRenamingSchema};
