import {Router} from "express";
import {locationController} from "../controllers";
import {checkRole, checkSession} from "../middleware/validate";
import {UserRole} from "../types";

export const router = Router();
router.delete("/", checkSession(true), checkRole(UserRole.ADMIN), locationController.remove);
