import Joi from '@hapi/joi';
import {UserRole} from '../types';

const email = Joi.string().email().min(6).max(128).lowercase().trim().required();
const firstName = Joi.string().min(1).max(128).trim().required();
const lastName = Joi.string().min(1).max(128).trim().required();
const password = Joi.string().min(8).max(72, 'utf8').required();
const passwordRepeat = Joi.valid(Joi.ref('password')).required();
const passwordNewRepeat = Joi.valid(Joi.ref('passwordNew')).required();
const acceptTerms = Joi.bool().valid(true);
const role = Joi.string()
  .valid(...Object.values(UserRole))
  .required();

const registerSchema = Joi.object({email, firstName, lastName, password, passwordRepeat, acceptTerms});
const loginSchema = Joi.object({email, password});
const userUpdateSchema = Joi.object({email, firstName, lastName, password});
const passwordChangeSchema = Joi.object({password, passwordNew: password, passwordNewRepeat});
const forgotPasswordSchema = Joi.object({email});
const roleChangeSchema = Joi.object({email, role});

export {registerSchema, loginSchema, userUpdateSchema, passwordChangeSchema, forgotPasswordSchema, roleChangeSchema};
