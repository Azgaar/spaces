import {Router} from 'express';
import {checkSession, validate} from '../middleware/validate';
import {loginSchema} from '../validation/user';
import {authController} from '../controllers';

export const router = Router();
router.post('/', checkSession(false), validate(loginSchema), authController.login);
