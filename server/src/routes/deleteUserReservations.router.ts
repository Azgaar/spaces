import {Router} from 'express';
import {reservationController} from '../controllers';
import {checkSession, checkEmail, validate} from '../middleware/validate';
import {reservationUserDeleteSchema} from '../validation/reservation';

export const router = Router();
router.delete('/', checkSession(true), checkEmail, validate(reservationUserDeleteSchema), reservationController.removeUserReservations);
