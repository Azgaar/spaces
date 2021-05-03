import {Router} from 'express';
import {checkSession, checkRole} from '../middleware/validate';
import {UserRole} from '../types';
import {userController} from '../controllers';

export const router = Router();
router.delete('/', checkSession(true), checkRole(UserRole.ADMIN), userController.remove);
