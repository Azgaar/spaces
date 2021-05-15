import {Router} from 'express';
import {checkRole, checkSession, validate, checkBodyForRole} from '../middleware/validate';
import {registerSchema, updateSchema} from '../validation/user';
import {userController} from '../controllers';
import {UserRole} from '../types';

export const users = Router();

users.get('/', checkSession, checkRole(UserRole.ADMIN), userController.getUsers);
users.post('/', validate(registerSchema), userController.registerUser);
users.patch('/:id', checkSession, checkBodyForRole(UserRole.ADMIN), validate(updateSchema), userController.modifyUser);
users.delete('/:id', checkSession, checkRole(UserRole.ADMIN), userController.deleteUser);
