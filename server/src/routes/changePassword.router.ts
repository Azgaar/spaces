import {Router} from 'express';
import {checkSession, validate} from '../middleware/validate';
import {passwordChangeSchema} from '../validation/user';
import {userController} from '../controllers';

export const router = Router();
router.post('/', checkSession, validate(passwordChangeSchema), userController.changePassword);
