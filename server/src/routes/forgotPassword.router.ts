import {Router} from 'express';
import {validate} from '../middleware/validate';
import {forgotPasswordSchema} from '../validation/user';
import {authController} from '../controllers';

export const router = Router();
router.post('/', validate(forgotPasswordSchema), authController.resetPassword);
