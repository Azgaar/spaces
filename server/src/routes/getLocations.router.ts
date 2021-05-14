import {Router} from 'express';
import {locationController} from '../controllers';
import {checkSession} from '../middleware/validate';

export const router = Router();
router.post('/', checkSession, locationController.list);
