import {Router} from 'express';
import {locationController} from '../controllers';
import {checkRole, checkSession, validate} from '../middleware/validate';
import {locationUpdateSchema} from '../validation/location';
import {UserRole} from '../types';

export const locations = Router();
locations.patch('/:id', checkSession, checkRole(UserRole.ADMIN), validate(locationUpdateSchema), locationController.update);
