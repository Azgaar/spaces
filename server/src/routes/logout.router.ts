import {Router} from 'express';
import {checkSession} from '../middleware/validate';
import {authController} from '../controllers';

export const router = Router();
router.post('/', checkSession, authController.logout);
