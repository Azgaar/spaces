import {Router} from 'express';
import {checkSession, checkRole, validate} from '../middleware/validate';
import {UserRole} from '../types';
import {userController} from '../controllers';
import {roleChangeSchema} from '../validation/user';

export const router = Router();
router.post('/', checkSession, checkRole(UserRole.ADMIN), validate(roleChangeSchema), userController.changeRole);
