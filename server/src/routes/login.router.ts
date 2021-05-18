import {Router} from 'express';
import {validate} from '../middleware/validate';
import {loginSchema} from '../validation/user';
import {authController} from '../controllers';

export const router = Router();
router.post('/', validate(loginSchema), authController.login);
