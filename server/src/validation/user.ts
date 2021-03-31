import Joi from "@hapi/joi";

const email = Joi.string().email().min(6).max(128).lowercase().trim().required();
const firstName = Joi.string().min(1).max(128).trim().required();
const lastName = Joi.string().min(1).max(128).trim().required();
const password = Joi.string().min(8).max(72, "utf8").required();
const passwordRepeat = Joi.valid(Joi.ref("password")).required();
const passwordNew = Joi.string().min(8).max(72, "utf8").required();
const passwordNewRepeat = Joi.valid(Joi.ref("passwordNew")).required();
const acceptTerms = Joi.bool().valid(true);

const registerSchema = Joi.object({email, firstName, lastName, password, passwordRepeat, acceptTerms});
const loginSchema = Joi.object({email, password});
const userUpdateSchema = Joi.object({email, firstName, lastName, password});
const passwordChangeSchema = Joi.object({password, passwordNew, passwordNewRepeat});

export {registerSchema, loginSchema, userUpdateSchema, passwordChangeSchema};
