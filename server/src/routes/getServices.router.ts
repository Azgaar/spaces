import {Router} from 'express';
import {serviceController} from '../controllers';
import {checkRole, checkSession} from '../middleware/validate';
import {UserRole} from '../types';

export const router = Router();
router.post('/', checkSession(true), checkRole(UserRole.ADMIN), serviceController.list);
