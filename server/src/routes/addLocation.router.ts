import {Router} from 'express';
import {locationController} from '../controllers';
import {checkRole, checkSession, validate} from '../middleware/validate';
import {UserRole} from '../types';
import {locationCreationSchema} from '../validation/location';

export const router = Router();
router.post('/', checkSession, checkRole(UserRole.ADMIN), validate(locationCreationSchema), locationController.add);
