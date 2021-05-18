import {Router} from 'express';
import {locationController} from '../controllers';
import {checkRole, checkSession, validate} from '../middleware/validate';
import {UserRole} from '../types';
import {locationDeletionSchema} from '../validation/location';

export const router = Router();
router.delete('/', checkSession, checkRole(UserRole.ADMIN), validate(locationDeletionSchema), locationController.remove);
