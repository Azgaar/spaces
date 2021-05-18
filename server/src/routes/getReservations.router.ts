import {Router} from 'express';
import {reservationController} from '../controllers';
import {checkRole, checkSession} from '../middleware/validate';
import {UserRole} from '../types';

export const router = Router();
router.post('/', checkSession, checkRole(UserRole.ADMIN), reservationController.list);
