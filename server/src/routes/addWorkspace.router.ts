import {Router} from 'express';
import {workspaceController} from '../controllers';
import {checkRole, checkSession, validate} from '../middleware/validate';
import {UserRole} from '../types';
import {workspaceCreationSchema} from '../validation/workspace';

export const router = Router();
router.post('/', checkSession(true), checkRole(UserRole.ADMIN), validate(workspaceCreationSchema), workspaceController.add);
