import {Router} from 'express';
import {validate} from '../middleware/validate';
import {registerSchema} from '../validation/user';
import {userController} from '../controllers';

export const router = Router();
router.post('/', validate(registerSchema), userController.register);
