import {Router} from "express";
import {checkSession, checkRole} from "../middleware/validate";
import {deleteUsersController} from "../controllers";
import {UserRole} from "../types";

export const router = Router();
router.delete("/", checkSession(true), checkRole(UserRole.ADMIN), deleteUsersController);
