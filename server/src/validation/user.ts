import Joi from '@hapi/joi';
import {UserRole} from '../types';

const email = Joi.string().email().min(6).max(128).lowercase().trim().required();
const firstName = Joi.string().min(1).max(128).trim().required();
const lastName = Joi.string().min(1).max(128).trim().required();
const password = Joi.string().min(8).max(72, 'utf8').required();
const passwordRepeat = Joi.valid(Joi.ref('password')).required();
const acceptTerms = Joi.bool().valid(true);
const role = Joi.string().valid(...Object.values(UserRole));

const registerSchema = Joi.object({email, firstName, lastName, password, passwordRepeat, acceptTerms});
const loginSchema = Joi.object({email, password});
const forgotPasswordSchema = Joi.object({email});

const updateSchema = Joi.object({
  role: role.optional(),
  email: email.optional(),
  firstName: firstName.optional(),
  lastName: lastName.optional(),
  password: password.when('role', {is: Joi.exist(), then: Joi.optional()}),
  passwordNew: password.optional(),
  passwordNewRepeat: Joi.valid(Joi.ref('passwordNew')).when('passwordNew', {is: Joi.exist(), then: Joi.required()})
});

export {registerSchema, loginSchema, updateSchema, forgotPasswordSchema};
