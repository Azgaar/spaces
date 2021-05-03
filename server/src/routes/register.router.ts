import {Router} from 'express';
import {checkSession, validate} from '../middleware/validate';
import {registerSchema} from '../validation/user';
import {userController} from '../controllers';

export const router = Router();
router.post('/', checkSession(false), validate(registerSchema), userController.register);
