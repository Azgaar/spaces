import {Router} from 'express';
import {checkSession, validate} from '../middleware/validate';
import {userUpdateSchema} from '../validation/user';
import {userController} from '../controllers';

export const router = Router();
router.post('/', checkSession, validate(userUpdateSchema), userController.update);
