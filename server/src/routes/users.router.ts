import {Router} from 'express';
import {checkRole, checkSession, validate, checkBodyForRole} from '../middleware/validate';
import {registerSchema, updateSchema} from '../validation/user';
import {userController} from '../controllers';
import {UserRole} from '../types';

export const users = Router();

users.get('/', checkSession(true), checkRole(UserRole.ADMIN), userController.getUsers);
users.post('/', validate(registerSchema), userController.registerUser);
// see https://stackoverflow.com/questions/28459418/use-of-put-vs-patch-methods-in-rest-api-real-life-scenarios for PATCH vs PUT
users.patch('/:id', checkSession(true), checkBodyForRole(UserRole.ADMIN), validate(updateSchema), userController.modifyUser);
users.delete('/:id', checkSession(true), checkRole(UserRole.ADMIN), userController.deleteUser);
