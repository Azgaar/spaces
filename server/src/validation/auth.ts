import Joi from "@hapi/joi";

const registerSchema = Joi.object({
  email: Joi.string().email().min(6).max(128).lowercase().trim().required(),
  firstName: Joi.string().min(1).max(128).trim().required(),
  lastName: Joi.string().min(1).max(128).trim().required(),
  password: Joi.string().min(8).max(128).required(),
  passwordRepeat: Joi.valid(Joi.ref("password")).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().min(6).max(128).lowercase().trim().required(),
  password: Joi.string().min(8).max(128).required()
});

export {registerSchema, loginSchema};
