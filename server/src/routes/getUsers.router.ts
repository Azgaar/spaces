import {Router} from "express";
import {checkSession, checkRole} from "../middleware/validate";
import {userController} from "../controllers";
import {UserRole} from "../types";

export const router = Router();
router.post("/", checkSession(true), checkRole(UserRole.ADMIN), userController.list);
