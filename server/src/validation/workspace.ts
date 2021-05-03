import Joi from '@hapi/joi';

const id = Joi.string().min(2).max(128).required();
const description = Joi.string().min(2).max(256).trim().required();
const location = Joi.string().min(2).max(256).trim().required();
const status = Joi.string().min(2).max(32).trim().required();
const type = Joi.string().min(2).max(32).trim().required();
const size = Joi.number().integer().min(1).max(256).required();
const equipment = Joi.array().required();

const workspaceCreationSchema = Joi.object({description, location, status, type, size, equipment});
const workspaceUpdateSchema = Joi.object({id, description, location, status, type, size, equipment});

export {workspaceCreationSchema, workspaceUpdateSchema};
