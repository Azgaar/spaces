import {Router} from 'express';
import {locationController} from '../controllers';
import {checkRole, checkSession, validate} from '../middleware/validate';
import {locationRenamingSchema} from '../validation/location';
import {UserRole} from '../types';

export const router = Router();
router.post('/', checkSession(true), checkRole(UserRole.ADMIN), validate(locationRenamingSchema), locationController.rename);
