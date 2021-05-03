import {Router} from 'express';
import {reservationController} from '../controllers';
import {checkSession, validate} from '../middleware/validate';
import {reservationCreationSchema} from '../validation/reservation';

export const router = Router();
router.post('/', checkSession(true), validate(reservationCreationSchema), reservationController.add);
